import * as dotenv from 'dotenv';
dotenv.config({ path: '../.env.local' });
import { WebSocket } from 'ws';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import {
  deployContract,
} from '@midnight-ntwrk/midnight-js-contracts';
import { MidnightBech32m } from '@midnight-ntwrk/wallet-sdk-address-format';
import { unshieldedToken } from '@midnight-ntwrk/ledger-v8';
import { signData, signingKeyFromBip340, signatureVerifyingKey } from '@midnight-ntwrk/ledger-v8';
import {
  ShieldedAddress,
  ShieldedCoinPublicKey,
  ShieldedEncryptionPublicKey,
} from '@midnight-ntwrk/wallet-sdk-address-format';
import pino from 'pino';
import { createInterface } from 'readline';
import { randomBytes } from 'crypto';
import * as Rx from 'rxjs';
import { getUnshieldedSeed } from '@midnight-ntwrk/testkit-js';

import { getConfig } from './config.js';
import { MidnightWalletProvider } from './wallet.js';
import { buildProviders } from './providers.js';
import { createTestWitnesses } from './witness.js';
import {
  zkConfigPath,
  createCompiledContractWithWitnesses,
} from './index.js';

// Required for GraphQL subscriptions in Node.js
// @ts-expect-error WebSocket global assignment for apollo
globalThis.WebSocket = WebSocket;

process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION:', reason);
  console.error('Promise:', promise);
});

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
});

const logger = pino({
  level: process.env['LOG_LEVEL'] ?? 'info',
  transport: { target: 'pino-pretty' },
});

const withStatus = async <T>(message: string, fn: () => Promise<T>): Promise<T> => {
  const clocks = ['🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛'];
  let i = 0;
  const interval = setInterval(() => {
    process.stdout.write(`\r  ${clocks[i++ % clocks.length]} ${message}`);
  }, 150);

  try {
    const result = await fn();
    clearInterval(interval);
    process.stdout.write(`\r  OK ${message}\n`);
    return result;
  } catch (error) {
    clearInterval(interval);
    process.stdout.write(`\r  FAIL ${message}\n`);
    throw error;
  }
};

// Preprod faucet dispenses 1000 tNight and wallet balances are returned in base units.
// In practice, 1_000_000_000 base units corresponds to 1000 tNight.
const TNIGHT_SCALE = 1_000_000n;

const formatDust = (raw: bigint): string => {
  const whole = raw / 1_000_000_000_000_000n;
  const fraction = (raw % 1_000_000_000_000_000n).toString().padStart(15, '0');
  return `${whole.toLocaleString()}.${fraction}`;
};

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, message: string): Promise<T> {
  return await Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error(message)), timeoutMs);
    }),
  ]);
}

function isProgressStrictlyComplete(progress: unknown): boolean {
  if (!progress || typeof progress !== 'object') {
    return false;
  }
  const candidate = progress as { isStrictlyComplete?: unknown };
  if (typeof candidate.isStrictlyComplete !== 'function') {
    return false;
  }
  return (candidate.isStrictlyComplete as () => boolean)();
}

async function waitForUnshieldedSync(logger: any, walletFacade: any, timeout = 300_000): Promise<Record<string, any>> {
  logger.info('Waiting for unshielded wallet sync...');
  let emissionCount = 0;
  
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      subscription.unsubscribe();
      reject(new Error(`Unshielded wallet sync timeout after ${timeout}ms`));
    }, timeout);

    const subscription = walletFacade.state().subscribe({
      next: (state: any) => {
        emissionCount++;
        const unshieldedSynced = isProgressStrictlyComplete(state.unshielded?.progress);
        logger.info(
          `Wallet sync [${emissionCount}]: shielded=${isProgressStrictlyComplete(state.shielded?.state?.progress)}, ` +
          `unshielded=${unshieldedSynced}, ` +
          `dust=${isProgressStrictlyComplete(state.dust?.state?.progress)}`,
        );
        
        if (unshieldedSynced) {
          clearTimeout(timeoutId);
          subscription.unsubscribe();
          resolve(state);
        }
      },
      error: (err: any) => {
        clearTimeout(timeoutId);
        logger.error(`Unshielded wallet sync error: ${err}`);
        reject(err);
      }
    });
  });
}

async function waitForDustAvailable(walletFacade: any, logger: any, timeout = 120_000): Promise<void> {
  logger.info('Checking wallet readiness (DUST generated on-demand)...');
  logger.info(`Waiting up to ${timeout / 1000}s for DUST generation...`);

  return new Promise((resolve) => {
    const startTime = Date.now();
    const subscription = walletFacade.state().subscribe({
      next: (state: any) => {
        if (state.dust?.availableCoins?.length > 0) {
          logger.info(`DUST is available for deployment: ${state.dust.balance(new Date())}`);
          subscription.unsubscribe();
          resolve(undefined);
        } else if (Date.now() - startTime > timeout) {
          logger.warn(`DUST generation timeout after ${timeout / 1000}s - proceeding anyway`);
          subscription.unsubscribe();
          resolve(undefined);
        }
      },
      error: (err: any) => {
        logger.error(`Error checking DUST status: ${err}`);
        subscription.unsubscribe();
        resolve(undefined);
      }
    });
  });
}

function pickDustRegistrationUtxos(state: any): Array<any> {
  const utxos = state.unshielded?.availableCoins ?? [];
  return utxos.filter((entry: any) => {
    const tokenType = entry?.utxo?.tokenType ?? entry?.tokenType;
    const registered = entry?.meta?.registeredForDustGeneration;
    return tokenType === unshieldedToken().raw && !registered;
  });
}

async function registerDustGeneration(
  walletFacade: any,
  seed: string,
  logger: any,
): Promise<void> {
  logger.info('Looking for NIGHT UTXOs that can be registered for DUST generation...');

  const signingKey = signingKeyFromBip340(getUnshieldedSeed(seed));
  const verifyingKey = signatureVerifyingKey(signingKey);
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const state: any = await withTimeout<any>(
        walletFacade.waitForSyncedState(),
        45_000,
        'Timed out waiting for wallet sync before DUST registration',
      );

      if (state.dust?.availableCoins?.length > 0) {
        logger.info(`DUST already available: ${formatDust(state.dust.balance(new Date()))}`);
        return;
      }

      const candidates = pickDustRegistrationUtxos(state);
      if (candidates.length === 0) {
        logger.warn('No unregistered NIGHT UTXOs found for DUST registration.');
        logger.warn('If the wallet is newly funded, wait for the faucet transfer to sync and try again.');
        return;
      }

      logger.info(
        `Registering ${candidates.length} NIGHT UTXO(s) for DUST generation (attempt ${attempt}/${maxAttempts})...`,
      );

      const txHash = await withTimeout(
        (async () => {
          const recipe = await walletFacade.registerNightUtxosForDustGeneration(
            candidates,
            verifyingKey,
            (payload: Uint8Array) => signData(signingKey, payload),
            state.dust?.address,
          );
          const finalized = await walletFacade.finalizeRecipe(recipe);
          return await walletFacade.submitTransaction(finalized);
        })(),
        90_000,
        'Timed out while registering NIGHT UTXOs for DUST generation',
      );

      logger.info(`DUST registration transaction submitted: ${txHash}`);
      return;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const transientSyncError =
        message.includes('Wallet.Sync') ||
        message.includes('disconnected') ||
        message.includes('timeout') ||
        message.includes('Timed out');

      if (!transientSyncError || attempt === maxAttempts) {
        throw err;
      }

      logger.warn(`DUST registration attempt ${attempt} failed due to transient sync issue: ${message}`);
      logger.warn('Retrying after wallet resync...');
      await sleep(2_500);
    }
  }
}

async function main() {
  const config = getConfig();
  setNetworkId(config.networkId);

  let wallet: MidnightWalletProvider | null = null;
  let seed: string;

  // Graceful shutdown handler
  const cleanup = async () => {
    if (wallet) {
      logger.info('Shutting down wallet...');
      try {
        await wallet.stop();
      } catch (err) {
        logger.error(`Error stopping wallet: ${err}`);
      }
    }
    process.exit(0);
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);

  try {
    // Step 1: Create or Restore a Wallet
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║  MIDNIGHT WALLET SETUP                 ║');
    console.log('╚════════════════════════════════════════╝\n');

  // For local network, use testkit pre-funded wallet seeds
  // These seeds are pre-funded by the local Midnight testnet
  if (config.networkId === 'undeployed') {
    console.log('  ✓ Local network detected - using testkit pre-funded wallet\n');
    // Use ALICE_SEED which is known to be pre-funded in testkit
    seed = '0000000000000000000000000000000000000000000000000000000000000001';
    logger.info('Using testkit ALICE_SEED for local deployment - this seed is pre-funded');
    console.log('  Using ALICE_SEED (pre-funded in testkit)\n');
  } else {
    // For preprod, use interactive seed management
    console.log('  Preprod network detected - use https://faucet.preprod.midnight.network/ to fund new wallets\n');
    
    const envSeed = process.env['ZERA_TEST_SEED'];
    if (envSeed) {
      seed = envSeed;
      logger.info('Using seed from ZERA_TEST_SEED environment variable');
      console.log('  Using environment seed for deployment\n');
    } else {
      const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      const question = (prompt: string): Promise<string> => {
        return new Promise((resolve) => {
          rl.question(prompt, resolve);
        });
      };

      const choice = await question(
        '  [1] Create new wallet\n  [2] Restore from seed\n  > '
      );

      if (choice.trim() === '2') {
        seed = await question('\n  Enter your 64-character seed: ');
      } else {
        // Generate random seed
        const randomSeed = randomBytes(32);
        seed = randomSeed
          .toString('hex');
        console.log(`\n  ⚠️  SAVE THIS SEED (you'll need it later):\n  ${seed}\n`);
        console.log('  ⚠️  Fund this wallet at: https://faucet.preprod.midnight.network/\n');
      }

      rl.close();
    }
  }

  const privateStateId = process.env['PRIVATE_STATE_ID'] || 'ZeraPrivateState';

  logger.info('Initializing wallet...');
  wallet = await MidnightWalletProvider.build(logger, {
    walletNetworkId: config.networkId,
    networkId: config.networkId,
    indexer: config.indexer,
    indexerWS: config.indexerWS,
    node: config.node,
    nodeWS: config.nodeWS,
    faucet: config.faucet,
    proofServer: config.proofServer,
  }, seed);

  await wallet.start();
  
  // Wait for initial sync with shorter timeout
  const walletState: any = await waitForUnshieldedSync(logger, wallet.wallet, 300_000);

  // Step 2: Get Your Wallet Address - properly encode to Bech32m
  const addressObj = walletState.unshielded?.address;
  let address = '';
  
  try {
    if (addressObj) {
      // Encode the UnshieldedAddress to Bech32m format
      address = MidnightBech32m.encode(config.networkId, addressObj).toString();
    }
  } catch (err) {
    logger.error(`Failed to encode address: ${err}`);
    address = 'Unable to encode address';
  }
  
  console.log('\n  ✓ Wallet Address: ' + address);

  // Step 3: Check Balance and Fund the Wallet - use correct token type
  const unshieldedBalances = walletState.unshielded.balances as Record<string, bigint> | undefined;
  const tokenKey = unshieldedToken().raw;
  const balance = unshieldedBalances?.[tokenKey] ?? 0n;
  const hasUnshieldedFunds = balance > 0n;
  const displayedBalance = balance / TNIGHT_SCALE;
  // Keep this as a warning-only heuristic, not a hard stop.
  const minimumDeployTnight = BigInt(process.env['MIN_DEPLOY_TNIGHT'] ?? '10');
  const minimumBalance = minimumDeployTnight * TNIGHT_SCALE;
  
  console.log('');
  console.log('  Wallet Addresses:');
  console.log(`    Shielded:    ${walletState.shielded?.coinPublicKey ? MidnightBech32m.encode(config.networkId, new ShieldedAddress(ShieldedCoinPublicKey.fromHexString(walletState.shielded.coinPublicKey.toHexString()), ShieldedEncryptionPublicKey.fromHexString(walletState.shielded.encryptionPublicKey.toHexString()))).toString() : 'Unable to encode address'}`);
  console.log(`    Unshielded:  ${address}  <- send tNight here`);
  console.log(`    Dust:        ${MidnightBech32m.encode(config.networkId, walletState.dust.address).toString()}`);
  console.log('');
  console.log(`  Faucet: ${config.faucet}`);
  console.log('');
  console.log(`  Balance: ${displayedBalance.toString()} tNight\n`);
  console.log('  Scenarios:');
  console.log('    1. No tNight yet');
  console.log('    2. Has tNight but no DUST yet');
  console.log('    3. Already has DUST');

  if (!hasUnshieldedFunds) {
    // For local networks, we'll proceed without faucet funding
    // For preprod, direct to faucet
    if (config.networkId === 'preprod') {
    console.log('  Scenario 1: wallet has no tNight yet.');
    console.log('  Visit: https://faucet.preprod.midnight.network/');
      console.log(`  Address: ${address}\n`);
      console.log('  Waiting for funds (this may take a few minutes)...');

      // Wait for funds to arrive with timeout
      const tokenKey = unshieldedToken().raw;
      await Rx.firstValueFrom(
        wallet!.wallet.state().pipe(
          Rx.tap((s: any) => {
            if (s.isSynced && s.unshielded?.balances) {
              const balance = s.unshielded.balances[tokenKey] ?? 0n;
              logger.info(`Checking balance: ${balance} tNight`);
            }
          }),
          Rx.filter((s: any) => {
            if (s.isSynced && s.unshielded?.balances) {
              const balance = s.unshielded.balances[tokenKey] ?? 0n;
              return balance > 0n;
            }
            return false;
          }),
          Rx.timeout({
            each: 600_000, // 10 minutes
            with: () => Rx.throwError(() => new Error('Timeout waiting for funds. Please ensure you funded the wallet.'))
          }),
          Rx.take(1)
        )
      );
      
      console.log('  ✓ Funds received!\n');
    } else {
      // Local network - skip faucet, proceed with deployment
      logger.info('Local network detected - skipping faucet funding, proceeding with deployment');
      console.log('  ⚠️  Running on local network - deployment will attempt to proceed\n');
    }
  } else {
    console.log('  ✓ Wallet funded!\n');
  }

  if (config.networkId === 'preprod' && balance < minimumBalance) {
    console.warn('  ⚠️  Wallet balance may be low for deployment');
    console.warn(`  Current balance: ${displayedBalance.toString()} tNight`);
    console.warn(`  Recommended minimum: ${minimumDeployTnight.toString()} tNight`);
    console.warn('  Fund this wallet further at: https://faucet.preprod.midnight.network/\n');
  }

  // Step 4: Wait for DUST Registration (Automatic)
  console.log('  Scenario 3: already has DUST, or registering NIGHT for DUST generation now.');
  await withStatus('Registering NIGHT UTXOs for DUST generation', async () => {
    await registerDustGeneration(wallet!.wallet, seed, logger);
  });
  await withStatus('Waiting for DUST to be generated', async () => {
    await waitForDustAvailable(wallet!.wallet, logger, 240_000);
  });
  console.log('  ✓ DUST available!\n');

  const providers = buildProviders(wallet, zkConfigPath, config);
  logger.info('Providers initialized. Ready to deploy!');

  // Create deployment witnesses
  const witnesses = createTestWitnesses('deployer');
  logger.info('Created deployment witnesses');
  logger.info(`Deployer secrets: ${JSON.stringify(witnesses.displaySecrets())}`);

  // Create compiled contract with witnesses embedded
  const witnessProvider = witnesses.getWitnesses();
  const compiledContractWithWitnesses = createCompiledContractWithWitnesses(witnessProvider);
  logger.info('Compiled contract created with embedded witnesses');

  // Check balance before deployment
  const preDeploymentState = walletState;
  const preDeploymentBalance = preDeploymentState.unshielded.balances?.[unshieldedToken().raw] ?? 0n;

  if (preDeploymentBalance < minimumBalance) {
    console.log('  ⚠️  WARNING: Wallet balance may be too low for deployment');
    console.log(`  Balance: ${(preDeploymentBalance / TNIGHT_SCALE).toString()} tNight`);
    console.log(`  Recommended: ≥${minimumDeployTnight.toString()} tNight`);
    console.log('  Consider funding the wallet further at: https://faucet.preprod.midnight.network/\n');
  }

  // Deploy contract
  logger.info('Deploying Zera Asset Registry contract...');
  const deployed = await deployContract(providers, {
    compiledContract: compiledContractWithWitnesses,
    privateStateId,
    initialPrivateState: {},
  } as any);

  const contractAddress = (deployed as any).deployTxData.public.contractAddress;
  logger.info(`Contract deployed at: ${contractAddress}`);

  // Verify deployment by querying contract state
  console.log('\n  Verifying deployment on blockchain...');
  try {
    // Give the indexer a moment to index the new contract
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const publicData = await providers.publicDataProvider.queryContractState(contractAddress);
    if (publicData) {
      console.log('  ✓ Contract verified on blockchain!\n');
      logger.info(`Contract state verified: ${JSON.stringify(publicData.data)}`);
    } else {
      console.log('  ⚠️  Contract found but state not yet indexed\n');
      logger.warn('Contract state not yet available in indexer');
    }
  } catch (verifyErr) {
    console.log('  ⚠️  Verification query failed (contract may still be indexing)\n');
    logger.warn(`Verification query error: ${verifyErr}`);
  }

  // Save to deployment.json
  const fs = await import('fs');
  const deploymentData = {
    contractAddress,
    network: config.networkId,
    deployedAt: new Date().toISOString(),
    walletAddress: address,
    status: 'deployed'
  };
  (fs as any).writeFileSync('../deployment.json', JSON.stringify(deploymentData, null, 2));

  // Display deployment summary
  console.log('╔════════════════════════════════════════╗');
  console.log('║  ✓ DEPLOYMENT SUCCESSFUL               ║');
  console.log('╚════════════════════════════════════════╝\n');
  console.log('  Contract Address:');
  console.log(`    ${contractAddress}\n`);
  console.log('  Deployment Details:');
  console.log(`    Network:  ${config.networkId}`);
  console.log(`    Wallet:   ${address}`);
  console.log(`    Time:     ${new Date().toISOString()}\n`);
  console.log('  Next Steps:');
  console.log('    1. Contract address saved to deployment.json');
  console.log('    2. You can now interact with the contract');
  console.log('    3. Use the contract address to submit transactions\n');

  logger.info('Deployment complete. Stopping wallet...');
  await wallet.stop();
  process.exit(0);
  } catch (error) {
    logger.error(`Deployment failed: ${error}`);
    
    // Provide helpful guidance for common deployment errors
    if (error instanceof Error) {
      if (error.message.includes('InsufficientFunds') || error.message.includes('could not balance dust')) {
        console.error('\n❌ Deployment Failed: Insufficient Funds for DUST');
        console.error('   This error occurs when the wallet doesn\'t have enough balance to cover deployment fees.');
        console.error('   Solutions:');
        console.error('   1. Request more funds from faucet: https://faucet.preprod.midnight.network/');
        console.error('   2. Wait longer for DUST to be generated (may take 30-60 seconds)');
        console.error('   3. Try again in a few moments\n');
      }
    }
    
    if (wallet) {
      await wallet.stop();
    }
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
