import { WebSocket } from 'ws';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import {
  deployContract,
} from '@midnight-ntwrk/midnight-js-contracts';
import { MidnightBech32m } from '@midnight-ntwrk/wallet-sdk-address-format';
import { unshieldedToken } from '@midnight-ntwrk/ledger-v8';
import pino from 'pino';
import { createInterface } from 'readline';
import { randomBytes } from 'crypto';
import * as Rx from 'rxjs';

import { getConfig } from './config.js';
import { MidnightWalletProvider } from './wallet.js';
import { buildProviders } from './providers.js';
import {
  CompiledHelloWorldContract,
  zkConfigPath,
} from '../contracts/index.js';

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

async function waitForUnshieldedSync(logger: any, walletFacade: any, timeout = 300_000): Promise<any> {
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

async function waitForDustAvailable(walletFacade: any, logger: any) {
  logger.info('Waiting for DUST to be generated...');
  
  await Rx.firstValueFrom(
    walletFacade.state().pipe(
      Rx.tap((s: any) => {
        const dustSynced = isProgressStrictlyComplete(s.dust?.state?.progress);
        const dustBalances = s?.dust?.state?.balances;
        const hasDust = dustBalances && Object.values(dustBalances).some((b: unknown) => (b as bigint) > 0n);
        logger.info(`DUST check: synced=${dustSynced}, hasDust=${hasDust}`);
      }),
      Rx.filter((s: any) => {
        if (s.isSynced) {
          const dustBalances = s?.dust?.state?.balances;
          return dustBalances && Object.values(dustBalances).some((b: unknown) => (b as bigint) > 0n);
        }
        return false;
      }),
      Rx.timeout({
        each: 300_000, // 5 minutes
        with: () => Rx.throwError(() => new Error('Timeout waiting for DUST. Please try again.'))
      }),
      Rx.take(1)
    )
  );
  
  logger.info('DUST is now available!');
}

async function main() {
  const config = getConfig();
  setNetworkId(config.networkId);

  let wallet: MidnightWalletProvider | null = null;

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

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (prompt: string): Promise<string> => {
    return new Promise((resolve) => {
      rl.question(prompt, resolve);
    });
  };

  let seed: string;
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
  }

  rl.close();

  const privateStateId = process.env['PRIVATE_STATE_ID'] || 'HelloWorldPrivateState';

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
  
  console.log(`  Balance: ${balance} tNight\n`);

  if (!hasUnshieldedFunds) {
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
  }

  // Step 4: Wait for DUST Registration (Automatic)
  console.log('  Waiting for DUST to be generated...');
  await waitForDustAvailable(wallet.wallet, logger);
  console.log('  ✓ DUST available!\n');

  const providers = buildProviders(wallet, zkConfigPath, config);
  logger.info('Providers initialized. Ready to deploy!');

  logger.info('Deploying contract...');
  const deployed: any = await (deployContract as any)(providers, {
    compiledContract: CompiledHelloWorldContract,
    privateStateId,
    initialPrivateState: {},
    args: [],
  });

  const contractAddress = deployed.deployTxData.public.contractAddress;
  logger.info(`Contract deployed at: ${contractAddress}`);

  // Save to deployment.json
  const fs = await import('fs');
  fs.writeFileSync('deployment.json', JSON.stringify({
    contractAddress,
    network: config.networkId,
    deployedAt: new Date().toISOString(),
  }, null, 2));

  logger.info('Deployment complete. Stopping wallet...');
  await wallet.stop();
  process.exit(0);
  } catch (error) {
    logger.error(`Deployment failed: ${error}`);
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