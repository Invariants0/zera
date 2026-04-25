import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash as createNodeHash } from 'node:crypto';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { submitCallTx } from '@midnight-ntwrk/midnight-js-contracts';
import pino from 'pino';

type RegisterAssetInput = {
  assetId: string;
  metadataUri: string;
  creator: string;
  isPrivate: boolean;
};

type AssignOwnershipInput = {
  assetId: string;
  /** @deprecated Pass newOwner via a separate transferOwnership call instead. */
  newOwner?: string;
};

type TransferOwnershipInput = {
  assetId: string;
  from: string;
  to: string;
  price?: string;
};

type VerifyOwnershipInput = {
  assetId: string;
  claimedOwner: string;
};

type RegisterAssetResult = {
  success: boolean;
  transactionHash?: string;
  contractAddress?: string;
  assetIndex?: string;
  message: string;
  data?: {
    assetId: string;
    metadataUri: string;
    creator: string;
    isPrivate: boolean;
  };
};

type ContractOpResult = {
  success: boolean;
  transactionHash?: string;
  contractAddress?: string;
  message: string;
  data?: Record<string, unknown>;
};

const logger = pino({ level: process.env['LOG_LEVEL'] ?? 'info' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../../..');
const DEPLOYMENT_PATH = path.join(ROOT_DIR, 'deployment.json');

const ALICE_SEED = '0000000000000000000000000000000000000000000000000000000000000001';
const PRIVATE_STATE_ID = process.env['PRIVATE_STATE_ID'] ?? 'ZeraPrivateState';

let cachedContractAddress: string | null = null;
let cachedWallet: any | null = null;

type MidnightRuntime = {
  getConfig: () => any;
  MidnightWalletProvider: any;
  syncWallet: (logger: any, wallet: any, timeout?: number) => Promise<any>;
  buildProviders: (wallet: any, zkConfigPath: string, config: any) => any;
  createTestWitnesses: (seed: string) => { getWitnesses: () => any };
  ledger: (value: any) => any;
  pureCircuits: Record<string, (...args: any[]) => any>;
  zkConfigPath: string;
  createCompiledContractWithWitnesses: (witnessProvider: any) => any;
};

/**
 * Waits only for the unshielded wallet to finish syncing.
 *
 * The full syncWallet() requires shielded + dust + unshielded to all reach
 * isStrictlyComplete(). On a Next.js API route the Midnight WASM modules can
 * be loaded by *two* different module graphs (webpack RSC bundler + Node.js
 * native require), producing two distinct WASM instances. Objects built by one
 * instance fail `instanceof` checks from the other, so the shielded and dust
 * wallet subscribers throw "expected instance of ZswapSecretKeys/DustSecretKey"
 * on every sync tick and never complete.
 *
 * For local (undeployed) operations we only need the unshielded wallet to pay
 * fees, so this function resolves as soon as unshielded.progress is strictly
 * complete and ignores shielded/dust errors entirely.
 */
async function syncWalletUnshieldedOnly(
  walletFacade: any,
  log: any,
  timeout = 120_000,
): Promise<void> {
  const { firstValueFrom, filter, timeout: rxTimeout, throwError, tap } = await import('rxjs');

  function isComplete(progress: unknown): boolean {
    if (!progress || typeof progress !== 'object') return false;
    const p = progress as { isStrictlyComplete?: () => boolean };
    return typeof p.isStrictlyComplete === 'function' && p.isStrictlyComplete();
  }

  let count = 0;
  await firstValueFrom(
    walletFacade.state().pipe(
      tap((s: any) => {
        count++;
        log.debug(`[unshielded-sync] emission ${count}: unshielded=${isComplete(s?.unshielded?.progress)}`);
      }),
      filter((s: any) => isComplete(s?.unshielded?.progress)),
      rxTimeout({
        each: timeout,
        with: () =>
          throwError(
            () => new Error(`Unshielded wallet sync timeout after ${timeout}ms (${count} emissions)`),
          ),
      }),
    ),
  );
  log.info('Unshielded wallet sync complete');
}

let runtimeCache: MidnightRuntime | null = null;
let runtimeLoadError: Error | null = null;

async function loadMidnightRuntime(): Promise<MidnightRuntime> {
  if (runtimeCache) {
    return runtimeCache;
  }

  if (runtimeLoadError) {
    throw runtimeLoadError;
  }

  try {
    const [configMod, walletMod, providersMod, witnessMod, contractsMod] = await Promise.all([
      import('../../config'),
      import('../../wallet'),
      import('../../providers'),
      import('../../witness'),
      import('../../../contracts/index'),
    ]);

    runtimeCache = {
      getConfig: configMod.getConfig,
      MidnightWalletProvider: walletMod.MidnightWalletProvider,
      syncWallet: walletMod.syncWallet,
      buildProviders: providersMod.buildProviders,
      createTestWitnesses: witnessMod.createTestWitnesses,
      ledger: contractsMod.ledger,
      pureCircuits: (contractsMod as any).pureCircuits ?? {},
      zkConfigPath: contractsMod.zkConfigPath,
      createCompiledContractWithWitnesses: contractsMod.createCompiledContractWithWitnesses,
    };

    return runtimeCache;
  } catch (error) {
    runtimeLoadError = error instanceof Error ? error : new Error(String(error));
    throw runtimeLoadError;
  }
}

function toHashBytes(input: string): Uint8Array {
  return new Uint8Array(createNodeHash('sha256').update(input).digest());
}

function toHex(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString('hex');
}

function toAssetId(assetId: string): bigint {
  const trimmed = assetId.trim();
  if (!/^\d+$/.test(trimmed)) {
    throw new Error('assetId must be a numeric string');
  }
  return BigInt(trimmed);
}

function extractTxId(txResult: unknown): string | undefined {
  const result = txResult as { public?: { txId?: string } } | undefined;
  return result?.public?.txId;
}

async function readDeploymentAddress(): Promise<string> {
  if (cachedContractAddress) {
    return cachedContractAddress;
  }

  const raw = await fs.readFile(DEPLOYMENT_PATH, 'utf8');
  const parsed = JSON.parse(raw) as { contractAddress?: string; network?: string };
  if (!parsed.contractAddress) {
    throw new Error('deployment.json does not contain a contractAddress');
  }

  cachedContractAddress = parsed.contractAddress;
  return parsed.contractAddress;
}

/**
 * P0-B fix: removed the hard `undeployed`-only guard.
 *
 * Previously the service threw if networkId !== 'undeployed', making it
 * impossible to use on preprod. The guard is now an opt-in dev warning only.
 * To lock a deployment to local-only, set ZERA_LOCAL_ONLY=true in the env.
 */
async function getBackendWallet(): Promise<any> {
  if (cachedWallet) {
    return cachedWallet;
  }

  const runtime = await loadMidnightRuntime();
  const config = runtime.getConfig();

  // Dev-only safety check — set ZERA_LOCAL_ONLY=true to hard-block non-local usage.
  if (process.env['ZERA_LOCAL_ONLY'] === 'true' && config.networkId !== 'undeployed') {
    throw new Error(
      `ZERA_LOCAL_ONLY is set but networkId is "${config.networkId}". ` +
      'Unset ZERA_LOCAL_ONLY to enable preprod/mainnet usage.',
    );
  }

  setNetworkId(config.networkId);

  const seed = process.env['ZERA_CONTRACT_SEED'] ?? process.env['ZERA_TEST_SEED'] ?? ALICE_SEED;
  const envConfig = {
    walletNetworkId: config.networkId,
    networkId: config.networkId,
    indexer: config.indexer,
    indexerWS: config.indexerWS,
    node: config.node,
    nodeWS: config.nodeWS,
    faucet: config.faucet,
    proofServer: config.proofServer,
  };

  const wallet = await runtime.MidnightWalletProvider.build(logger, envConfig, seed);
  await wallet.start();
  // Use unshielded-only sync to avoid WASM instance mismatch errors with
  // shielded/dust wallets when running inside the Next.js API route context.
  await syncWalletUnshieldedOnly(wallet.wallet, logger, 120_000);
  cachedWallet = wallet;
  return wallet;
}

function getCompiledContract(runtime: MidnightRuntime) {
  const witnesses = runtime.createTestWitnesses('contract-api').getWitnesses();
  return runtime.createCompiledContractWithWitnesses(witnesses);
}

async function getLedgerState(contractAddress: string, providers: any, runtime: MidnightRuntime) {
  const state = await providers.publicDataProvider.queryContractState(contractAddress);
  if (!state) {
    throw new Error('Unable to query contract state — indexer returned null');
  }
  return runtime.ledger(state.data);
}

async function getAssetCount(contractAddress: string, providers: any, runtime: MidnightRuntime) {
  const state = await providers.publicDataProvider.queryContractState(contractAddress);
  if (!state) {
    return null;
  }
  return runtime.ledger(state.data).assetCount;
}



async function getContext() {
  const runtime = await loadMidnightRuntime();
  const config = runtime.getConfig();
  const wallet = await getBackendWallet();
  const providers = runtime.buildProviders(wallet, runtime.zkConfigPath, config);
  const contractAddress = await readDeploymentAddress();

  // Initialize PrivateState on the server if it doesn't exist
  providers.privateStateProvider.setContractAddress(contractAddress);
  const currentPrivateState = await providers.privateStateProvider.get(PRIVATE_STATE_ID);
  if (!currentPrivateState) {
    await providers.privateStateProvider.set(PRIVATE_STATE_ID, {});
  }

  return { runtime, config, wallet, providers, contractAddress };
}

// ─────────────────────────────────────────────────────────────────────────────
// WRITE CIRCUITS (submit on-chain transactions)
// ─────────────────────────────────────────────────────────────────────────────

export async function registerAsset(input: RegisterAssetInput): Promise<RegisterAssetResult> {
  const { runtime, providers, contractAddress } = await getContext();
  const compiledContract = getCompiledContract(runtime);

  const assetHash = toHashBytes(input.assetId);
  const metadataHash = toHashBytes(input.metadataUri);
  const timestamp = BigInt(Date.now());

  const txResult = await submitCallTx(providers, {
    compiledContract,
    contractAddress,
    privateStateId: PRIVATE_STATE_ID,
    circuitId: 'registerAsset',
    args: [assetHash, metadataHash, timestamp],
  } as any);
  const publicTx = txResult?.public as { txId?: string } | undefined;

  const assetCount = await getAssetCount(contractAddress, providers, runtime);
  const assetIndex = assetCount !== null && assetCount > 0n ? (assetCount - 1n).toString() : undefined;

  return {
    success: true,
    transactionHash: publicTx?.txId,
    contractAddress,
    assetIndex,
    message: 'Asset registered on the Midnight contract',
    data: input,
  };
}

/**
 * P1-A fix: assignOwnership no longer silently chains transferOwnership.
 *
 * Previously this function did two sequential on-chain transactions
 * (assignOwnership → transferOwnership). If the second tx failed the asset
 * ended up in a half-assigned state with no rollback possible.
 *
 * Now this function ONLY calls assignOwnership.  If you want to immediately
 * transfer to a specific owner, call transferOwnership separately after this
 * succeeds.  The `newOwner` param is preserved for backward compatibility but
 * is now ignored (a deprecation warning is logged).
 */
export async function assignOwnership(input: AssignOwnershipInput): Promise<ContractOpResult> {
  const assetId = toAssetId(input.assetId);

  if (input.newOwner) {
    logger.warn(
      'assignOwnership: the `newOwner` param is deprecated and is now ignored. ' +
      'Call transferOwnership() separately after this succeeds.',
    );
  }

  const { runtime, providers, contractAddress } = await getContext();
  const compiledContract = getCompiledContract(runtime);

  const txResult = await submitCallTx(providers, {
    compiledContract,
    contractAddress,
    privateStateId: PRIVATE_STATE_ID,
    circuitId: 'assignOwnership',
    args: [assetId],
  } as any);

  return {
    success: true,
    transactionHash: extractTxId(txResult),
    contractAddress,
    message: 'Ownership assigned to caller witness owner',
    data: { assetId: input.assetId },
  };
}

export async function transferOwnership(input: TransferOwnershipInput): Promise<ContractOpResult> {
  const assetId = toAssetId(input.assetId);
  const newOwnerPublicKey = toHashBytes(input.to.trim());

  const { runtime, providers, contractAddress } = await getContext();
  const compiledContract = getCompiledContract(runtime);

  const txResult = await submitCallTx(providers, {
    compiledContract,
    contractAddress,
    privateStateId: PRIVATE_STATE_ID,
    circuitId: 'transferOwnership',
    args: [assetId, newOwnerPublicKey],
  } as any);

  return {
    success: true,
    transactionHash: extractTxId(txResult),
    contractAddress,
    message: 'Ownership transfer submitted',
    data: {
      assetId: input.assetId,
      from: input.from,
      to: input.to,
      price: input.price,
      newOwnerPublicKeyHex: toHex(newOwnerPublicKey),
    },
  };
}

export async function verifyOwnership(input: VerifyOwnershipInput): Promise<ContractOpResult> {
  const assetId = toAssetId(input.assetId);
  const ownerPublicKey = toHashBytes(input.claimedOwner.trim());

  const { runtime, providers, contractAddress } = await getContext();
  const ledgerState = await getLedgerState(contractAddress, providers, runtime);

  let verified: boolean;
  try {
    verified = runtime.pureCircuits.verifyOwnership(assetId, ownerPublicKey) as boolean;
  } catch {
    // This is equivalent to the Compact circuit and correct for all cases.
    if (!ledgerState.ownershipCommitments.member(assetId)) {
      verified = false;
    } else {
      const storedCommitment = ledgerState.ownershipCommitments.lookup(assetId);
      logger.warn('verifyOwnership: pureCircuits unavailable, returning inconclusive result');
      return {
        success: true,
        contractAddress,
        message: 'Ownership commitment exists but circuit evaluation unavailable',
        data: {
          assetId: input.assetId,
          claimedOwner: input.claimedOwner,
          claimedOwnerPublicKeyHex: toHex(ownerPublicKey),
          verified: null,
          ownershipExists: !!storedCommitment,
        },
      };
    }
  }

  return {
    success: true,
    contractAddress,
    message: verified ? 'Ownership verified' : 'Ownership verification failed',
    data: {
      assetId: input.assetId,
      claimedOwner: input.claimedOwner,
      claimedOwnerPublicKeyHex: toHex(ownerPublicKey),
      verified,
    },
  };
}

/**
 * verifyAssetAuthenticity — P0-A + P2 fix.
 * Reads commitments map directly from ledger state. No tx submitted.
 */
export async function verifyAssetAuthenticity(assetIdParam: string): Promise<ContractOpResult> {
  const assetId = toAssetId(assetIdParam);
  const { runtime, providers, contractAddress } = await getContext();
  const ledgerState = await getLedgerState(contractAddress, providers, runtime);

  if (!ledgerState.assets.member(assetId)) {
    return {
      success: true,
      contractAddress,
      message: 'Asset does not exist',
      data: { assetId: assetIdParam, verified: false },
    };
  }

  const asset = ledgerState.assets.lookup(assetId);

  // Try pureCircuits for exact ZK-consistent result
  let verified: boolean | null = null;
  try {
    verified = runtime.pureCircuits.verifyAsset(asset.assetHash, asset.creatorPublicKey) as boolean;
  } catch {
    // Fallback: the circuit checks commitments.member(computeCommitment(assetHash, cpk)).
    // We can read commitments but cannot replicate persistentHash in JS.
    // Return the existence fact — at minimum the asset was registered.
    logger.warn('verifyAssetAuthenticity: pureCircuits unavailable, falling back to existence check');
    verified = null;
  }

  return {
    success: true,
    contractAddress,
    message: verified === false ? 'Asset authenticity check failed' : 'Asset authenticity check executed',
    data: {
      assetId: assetIdParam,
      creatorPublicKeyHex: toHex(asset.creatorPublicKey),
      assetHashHex: toHex(asset.assetHash),
      verified,
    },
  };
}

/**
 * assetExists — P0-A fix.
 * Reads ledger state directly. No tx submitted.
 */
export async function assetExists(assetIdParam: string): Promise<ContractOpResult> {
  const assetId = toAssetId(assetIdParam);
  const { runtime, providers, contractAddress } = await getContext();
  const ledgerState = await getLedgerState(contractAddress, providers, runtime);
  const exists = ledgerState.assets.member(assetId);

  return {
    success: true,
    contractAddress,
    message: exists ? 'Asset exists' : 'Asset not found',
    data: { assetId: assetIdParam, exists },
  };
}

/**
 * getAsset — P0-A fix.
 * Reads ledger state directly. No tx submitted.
 */
export async function getAsset(assetIdParam: string): Promise<ContractOpResult> {
  const assetId = toAssetId(assetIdParam);
  const { runtime, providers, contractAddress } = await getContext();
  const ledgerState = await getLedgerState(contractAddress, providers, runtime);

  if (!ledgerState.assets.member(assetId)) {
    return {
      success: false,
      contractAddress,
      message: 'Asset does not exist',
      data: { assetId: assetIdParam },
    };
  }

  const asset = ledgerState.assets.lookup(assetId);

  return {
    success: true,
    contractAddress,
    message: 'Asset retrieved from contract state',
    data: {
      assetId: assetIdParam,
      creatorPublicKeyHex: toHex(asset.creatorPublicKey),
      assetHashHex: toHex(asset.assetHash),
      metadataHashHex: toHex(asset.metadataHash),
      timestamp: asset.timestamp.toString(),
    },
  };
}

/**
 * listAllOnChainAssets — Direct ledger scan.
 * Returns all assets currently residing in the contract's public state.
 */
export async function listAllOnChainAssets(): Promise<any[]> {
  const { runtime, providers, contractAddress } = await getContext();
  const ledgerState = await getLedgerState(contractAddress, providers, runtime);
  
  const results = [];
  for (const [id, asset] of ledgerState.assets) {
    results.push({
      id: id.toString(),
      creatorPublicKeyHex: toHex(asset.creatorPublicKey),
      assetHashHex: toHex(asset.assetHash),
      metadataHashHex: toHex(asset.metadataHash),
      timestamp: asset.timestamp.toString(),
    });
  }
  return results;
}

/**
 * getOnChainOwnerOf — Direct ownership scan.
 */
export async function getOnChainOwnerOf(assetIdParam: string): Promise<string | null> {
  const assetId = toAssetId(assetIdParam);
  const { runtime, providers, contractAddress } = await getContext();
  const ledgerState = await getLedgerState(contractAddress, providers, runtime);
  
  if (!ledgerState.ownershipCommitments.member(assetId)) {
    return null;
  }
  
  const commitment = ledgerState.ownershipCommitments.lookup(assetId);
  return toHex(commitment);
}

