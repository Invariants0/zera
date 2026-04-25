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

const logger = pino({
  level: process.env['LOG_LEVEL'] ?? 'info',
  transport: { target: 'pino-pretty' },
});

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

function extractBoolean(value: unknown): boolean | null {
  if (typeof value === 'boolean') {
    return value;
  }

  if (Array.isArray(value)) {
    for (const candidate of value) {
      const parsed = extractBoolean(candidate);
      if (parsed !== null) {
        return parsed;
      }
    }
    return null;
  }

  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const candidateKeys = ['result', 'returnValue', 'value', 'output', 'data'];
    for (const key of candidateKeys) {
      if (key in obj) {
        const parsed = extractBoolean(obj[key]);
        if (parsed !== null) {
          return parsed;
        }
      }
    }
  }

  return null;
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

async function getBackendWallet(): Promise<any> {
  if (cachedWallet) {
    return cachedWallet;
  }

  const runtime = await loadMidnightRuntime();
  const config = runtime.getConfig();
  if (config.networkId !== 'undeployed') {
    throw new Error('Contract API is currently enabled for the local undeployed network only');
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

async function getAssetCount(contractAddress: string, providers: any, runtime: MidnightRuntime) {
  const state = await providers.publicDataProvider.queryContractState(contractAddress);
  if (!state) {
    return null;
  }
  return runtime.ledger(state.data).assetCount;
}

async function getLedgerState(contractAddress: string, providers: any, runtime: MidnightRuntime) {
  const state = await providers.publicDataProvider.queryContractState(contractAddress);
  if (!state) {
    throw new Error('Unable to query contract state');
  }
  return runtime.ledger(state.data);
}

async function executeCircuit(
  circuitId: string,
  args: unknown[],
): Promise<{ txResult: unknown; contractAddress: string }> {
  const runtime = await loadMidnightRuntime();
  const config = runtime.getConfig();
  const wallet = await getBackendWallet();
  const providers = runtime.buildProviders(wallet, runtime.zkConfigPath, config);
  const contractAddress = await readDeploymentAddress();
  const compiledContract = getCompiledContract(runtime);

  const txResult = await submitCallTx(providers, {
    compiledContract,
    contractAddress,
    privateStateId: PRIVATE_STATE_ID,
    circuitId,
    args,
  } as any);

  return { txResult, contractAddress };
}

export async function registerAsset(input: RegisterAssetInput): Promise<RegisterAssetResult> {
  const runtime = await loadMidnightRuntime();
  const config = runtime.getConfig();
  const wallet = await getBackendWallet();
  const providers = runtime.buildProviders(wallet, runtime.zkConfigPath, config);
  const contractAddress = await readDeploymentAddress();
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
    message: 'Asset registered on the local Midnight contract',
    data: input,
  };
}

export async function assignOwnership(input: AssignOwnershipInput): Promise<ContractOpResult> {
  const assetId = toAssetId(input.assetId);

  const assignResult = await executeCircuit('assignOwnership', [assetId]);
  let transferTx: string | undefined;

  if (input.newOwner && input.newOwner.trim()) {
    const newOwnerPublicKey = toHashBytes(input.newOwner.trim());
    const transferResult = await executeCircuit('transferOwnership', [assetId, newOwnerPublicKey]);
    transferTx = extractTxId(transferResult.txResult);
  }

  return {
    success: true,
    transactionHash: transferTx ?? extractTxId(assignResult.txResult),
    contractAddress: assignResult.contractAddress,
    message: input.newOwner
      ? 'Ownership assigned and transferred to provided owner'
      : 'Ownership assigned to caller witness owner',
    data: {
      assetId: input.assetId,
      newOwner: input.newOwner,
    },
  };
}

export async function transferOwnership(input: TransferOwnershipInput): Promise<ContractOpResult> {
  const assetId = toAssetId(input.assetId);
  const newOwnerPublicKey = toHashBytes(input.to.trim());

  const { txResult, contractAddress } = await executeCircuit('transferOwnership', [
    assetId,
    newOwnerPublicKey,
  ]);

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

  const { txResult, contractAddress } = await executeCircuit('verifyOwnership', [
    assetId,
    ownerPublicKey,
  ]);

  const verified = extractBoolean(txResult);

  return {
    success: true,
    transactionHash: extractTxId(txResult),
    contractAddress,
    message: verified === false ? 'Ownership verification failed' : 'Ownership verification executed',
    data: {
      assetId: input.assetId,
      claimedOwner: input.claimedOwner,
      claimedOwnerPublicKeyHex: toHex(ownerPublicKey),
      verified,
    },
  };
}

export async function verifyAssetAuthenticity(assetIdParam: string): Promise<ContractOpResult> {
  const assetId = toAssetId(assetIdParam);
  const runtime = await loadMidnightRuntime();

  const config = runtime.getConfig();
  const wallet = await getBackendWallet();
  const providers = runtime.buildProviders(wallet, runtime.zkConfigPath, config);
  const contractAddress = await readDeploymentAddress();

  const state = await getLedgerState(contractAddress, providers, runtime);
  if (!state.assets.member(assetId)) {
    return {
      success: true,
      contractAddress,
      message: 'Asset does not exist',
      data: {
        assetId: assetIdParam,
        verified: false,
      },
    };
  }

  const asset = state.assets.lookup(assetId);
  const txResult = await executeCircuit('verifyAsset', [asset.assetHash, asset.creatorPublicKey]);
  const verified = extractBoolean(txResult.txResult);

  return {
    success: true,
    transactionHash: extractTxId(txResult.txResult),
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

export async function assetExists(assetIdParam: string): Promise<ContractOpResult> {
  const assetId = toAssetId(assetIdParam);
  const runtime = await loadMidnightRuntime();

  const config = runtime.getConfig();
  const wallet = await getBackendWallet();
  const providers = runtime.buildProviders(wallet, runtime.zkConfigPath, config);
  const contractAddress = await readDeploymentAddress();

  const state = await getLedgerState(contractAddress, providers, runtime);
  const exists = state.assets.member(assetId);

  return {
    success: true,
    contractAddress,
    message: exists ? 'Asset exists' : 'Asset not found',
    data: {
      assetId: assetIdParam,
      exists,
    },
  };
}

export async function getAsset(assetIdParam: string): Promise<ContractOpResult> {
  const assetId = toAssetId(assetIdParam);
  const runtime = await loadMidnightRuntime();

  const config = runtime.getConfig();
  const wallet = await getBackendWallet();
  const providers = runtime.buildProviders(wallet, runtime.zkConfigPath, config);
  const contractAddress = await readDeploymentAddress();

  const state = await getLedgerState(contractAddress, providers, runtime);
  if (!state.assets.member(assetId)) {
    return {
      success: false,
      contractAddress,
      message: 'Asset does not exist',
      data: {
        assetId: assetIdParam,
      },
    };
  }

  const asset = state.assets.lookup(assetId);

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
