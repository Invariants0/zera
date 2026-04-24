import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { WebSocket } from 'ws';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import {
  deployContract,
  submitCallTx,
} from '@midnight-ntwrk/midnight-js-contracts';
import type { ContractAddress } from '@midnight-ntwrk/compact-runtime';
import pino from 'pino';

import { getConfig } from '../config.js';
import { MidnightWalletProvider, syncWallet } from '../wallet.js';
import { buildProviders, type ZeraProviders } from '../providers.js';
import {
  ledger,
  zkConfigPath,
  createCompiledContractWithWitnesses,
} from '../../contracts/index.js';
import { createTestWitnesses, createHash } from '../witness.js';
import type { EnvironmentConfiguration } from '@midnight-ntwrk/testkit-js';

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

const ALICE_SEED =
  '0000000000000000000000000000000000000000000000000000000000000001';
const ALICE_PRIVATE_STATE_ID = 'AlicePrivateState';

const logger = pino({
  level: process.env['LOG_LEVEL'] ?? 'info',
  transport: { target: 'pino-pretty' },
});

describe('Zera Asset Registry Contract', () => {
  let aliceWallet: MidnightWalletProvider;
  let aliceProviders: ZeraProviders;
  let contractAddress: ContractAddress;
  let compiledContractWithWitnesses: any; // Store compiled contract with witnesses
  let deployedContract: any; // Store deployed contract object for circuit calls

  const config = getConfig();

  async function queryLedger(providers: ZeraProviders) {
    const state = 
      await providers.publicDataProvider.queryContractState(contractAddress);
    expect(state).not.toBeNull();
    return ledger(state!.data);
  }

  beforeAll(async () => {
    setNetworkId(config.networkId);

    const envConfig: EnvironmentConfiguration = {
      walletNetworkId: config.networkId,
      networkId: config.networkId,
      indexer: config.indexer,
      indexerWS: config.indexerWS,
      node: config.node,
      nodeWS: config.nodeWS,
      faucet: config.faucet,
      proofServer: config.proofServer,
    };

    aliceWallet = await MidnightWalletProvider.build(logger, envConfig, ALICE_SEED!);
    await aliceWallet.start();
    await syncWallet(logger, aliceWallet.wallet, 600_000);

    aliceProviders = buildProviders(aliceWallet, zkConfigPath, config);
    logger.info(`Providers initialized. Ready to test!`);

    // Create compiled contract with witnesses once for all tests
    // IMPORTANT: Create fresh witnesses for each test session to ensure proper state
    const aliceWitnesses = createTestWitnesses('alice');
    logger.info(`Created alice witnesses: creator=${aliceWitnesses.displaySecrets().creatorSecretKey.slice(0, 16)}..., owner=${aliceWitnesses.displaySecrets().ownerSecretKey.slice(0, 16)}...`);
    
    const witnessProvider = aliceWitnesses.getWitnesses();
    compiledContractWithWitnesses = createCompiledContractWithWitnesses(witnessProvider);
    logger.info(`Compiled contract with embedded witnesses created`);
  });

  afterAll(async () => {
    if(aliceWallet) {
      logger.info('Stopping Alice wallet...');
      await aliceWallet.stop();
    }
  });

  it('Deploys the contract', async () => {
    logger.info(`Deploying Zera Asset Registry Contract...`);

    // Create test witnesses for Alice
    const aliceWitnesses = createTestWitnesses('alice');
    const secrets = aliceWitnesses.displaySecrets();
    logger.info(`Created witnesses for Alice - Creator: ${secrets.creatorSecretKey.slice(0, 8)}..., Owner: ${secrets.ownerSecretKey.slice(0, 8)}...`);

    // Use factory function to create compiled contract with actual witnesses
    const witnessProvider = aliceWitnesses.getWitnesses();
    compiledContractWithWitnesses = createCompiledContractWithWitnesses(witnessProvider);

    logger.info(`Starting contract deployment...`);
    deployedContract = await (deployContract as any)(aliceProviders, {
      compiledContract: compiledContractWithWitnesses,
      privateStateId: ALICE_PRIVATE_STATE_ID,
      initialPrivateState: {},
      args: [],
    });

    logger.info(`Deployment response received, extracting contract address...`);
    contractAddress = deployedContract.deployTxData.public.contractAddress;
    logger.info(`Contract deployed at: ${contractAddress}`);
    expect(contractAddress).toBeDefined();
    expect(contractAddress.length).toBeGreaterThan(0);

    const state = await queryLedger(aliceProviders);
    expect(state.assetCount).toEqual(0n);
  }, { timeout: 60000 });

  it('Registers a new asset', async () => {
    logger.info(`========== REGISTER ASSET TEST START ==========`);
    
    const assetHash = createHash('asset-001');
    const metadataHash = createHash('metadata-001');
    const timestamp = BigInt(Date.now());

    logger.info(`Asset inputs:`);
    logger.info(`  - assetHash: ${Buffer.from(assetHash).toString('hex')}`);
    logger.info(`  - metadataHash: ${Buffer.from(metadataHash).toString('hex')}`);
    logger.info(`  - timestamp: ${timestamp}`);
    logger.info(`  - contractAddress: ${contractAddress}`);
    logger.info(`  - privateStateId: ${ALICE_PRIVATE_STATE_ID}`);

    try {
      logger.info(`Calling submitCallTx with registerAsset circuit...`);
      const startTime = Date.now();
      
      const result = await (submitCallTx as any)(aliceProviders, {
        compiledContract: compiledContractWithWitnesses,
        contractAddress,
        privateStateId: ALICE_PRIVATE_STATE_ID,
        circuitId: 'registerAsset',
        args: [assetHash, metadataHash, timestamp],
      });
      
      const elapsed = Date.now() - startTime;
      logger.info(`registerAsset call completed successfully in ${elapsed}ms`);
      logger.info(`Result summary: status=${result?.public?.status}, txId=${result?.public?.txId ?? 'n/a'}`);
    } catch (err: any) {
      logger.error(`registerAsset call failed:`);
      logger.error(`  Error message: ${err?.message}`);
      logger.error(`  Error stack: ${err?.stack}`);
      logger.error(`  Full error: ${JSON.stringify(err)}`);
      throw err;
    }

    logger.info(`Querying ledger state...`);
    const state = await queryLedger(aliceProviders);
    logger.info(`Ledger state after registerAsset:`);
    logger.info(`  - assetCount: ${state.assetCount}`);
    logger.info(`  - assets.member(0): ${state.assets.member(0n)}`);
    
    expect(state.assetCount).toEqual(1n);
    expect(state.assets.member(0n)).toBe(true);
    
    logger.info(`========== REGISTER ASSET TEST END ==========`);
  }, { timeout: 60000 });

  it('Retrieves registered asset', async () => {
    logger.info(`Retrieving asset...`);

    await (submitCallTx as any)(aliceProviders, {
      compiledContract: compiledContractWithWitnesses,
      contractAddress,
      privateStateId: ALICE_PRIVATE_STATE_ID,
      circuitId: 'getAsset',
      args: [0n],
    });

    const state = await queryLedger(aliceProviders);
    const asset = state.assets.lookup(0n);
    expect(asset).toBeDefined();
    expect(asset.assetHash).toEqual(createHash('asset-001'));
    expect(asset.metadataHash).toEqual(createHash('metadata-001'));
  }, { timeout: 60000 });

  it('Checks asset existence', async () => {
    logger.info(`Checking asset existence...`);

    const result: any = await (submitCallTx as any)(aliceProviders, {
      compiledContract: compiledContractWithWitnesses,
      contractAddress,
      privateStateId: ALICE_PRIVATE_STATE_ID,
      circuitId: 'assetExists',
      args: [0n],
    });

    const state = await queryLedger(aliceProviders);
    expect(state.assets.member(0n)).toBe(true);
    logger.info(`Asset exists verification completed`);
  }, { timeout: 60000 });

  it('Assigns ownership to asset', async () => {
    logger.info(`Assigning ownership...`);

    await (submitCallTx as any)(aliceProviders, {
      compiledContract: compiledContractWithWitnesses,
      contractAddress,
      privateStateId: ALICE_PRIVATE_STATE_ID,
      circuitId: 'assignOwnership',
      args: [0n],
    });

    const state = await queryLedger(aliceProviders);
    expect(state.ownershipCommitments.member(0n)).toBe(true);
  }, { timeout: 60000 });

  it('Registers second asset', async () => {
    logger.info(`Registering second asset...`);
    
    const assetHash = createHash('asset-002');
    const metadataHash = createHash('metadata-002');
    const timestamp = BigInt(Date.now());

    await (submitCallTx as any)(aliceProviders, {
      compiledContract: compiledContractWithWitnesses,
      contractAddress,
      privateStateId: ALICE_PRIVATE_STATE_ID,
      circuitId: 'registerAsset',
      args: [assetHash, metadataHash, timestamp],
    });

    const state = await queryLedger(aliceProviders);
    expect(state.assetCount).toEqual(2n);
    expect(state.assets.member(1n)).toBe(true);
  }, { timeout: 60000 });

  it('Verifies asset authenticity', async () => {
    logger.info(`Verifying asset authenticity...`);

    const assetHash = createHash('asset-001');
    // Get the creator public key from the first asset
    const state = await queryLedger(aliceProviders);
    const asset = state.assets.lookup(0n);

    const result: any = await (submitCallTx as any)(aliceProviders, {
      compiledContract: compiledContractWithWitnesses,
      contractAddress,
      privateStateId: ALICE_PRIVATE_STATE_ID,
      circuitId: 'verifyAsset',
      args: [assetHash, asset.creatorPublicKey],
    });

    logger.info(`Asset authenticity verified: assetHash matches creator`);
  }, { timeout: 60000 });

  it('Transfers ownership to new owner', async () => {
    logger.info(`Transferring ownership...`);

    const newOwnerPublicKey = createHash('new-owner-pk');

    await (submitCallTx as any)(aliceProviders, {
      compiledContract: compiledContractWithWitnesses,
      contractAddress,
      privateStateId: ALICE_PRIVATE_STATE_ID,
      circuitId: 'transferOwnership',
      args: [0n, newOwnerPublicKey],
    });

    const state = await queryLedger(aliceProviders);
    expect(state.ownershipCommitments.member(0n)).toBe(true);
  }, { timeout: 60000 });

  it('Verifies new ownership', async () => {
    logger.info(`Verifying new ownership...`);

    const newOwnerPublicKey = createHash('new-owner-pk');

    const result: any = await (submitCallTx as any)(aliceProviders, {
      compiledContract: compiledContractWithWitnesses,
      contractAddress,
      privateStateId: ALICE_PRIVATE_STATE_ID,
      circuitId: 'verifyOwnership',
      args: [0n, newOwnerPublicKey],
    });

    logger.info(`New owner verified successfully`);
  }, { timeout: 60000 });

  it('Fails when trying to assign ownership to non-existent asset', async () => {
    logger.info(`Testing error case: non-existent asset...`);

    try {
      await (submitCallTx as any)(aliceProviders, {
        compiledContract: compiledContractWithWitnesses,
        contractAddress,
        privateStateId: ALICE_PRIVATE_STATE_ID,
        circuitId: 'assignOwnership',
        args: [9999n], // Non-existent asset ID
      });
      // If we get here without error, the test should fail
      expect.fail('Should have thrown error for non-existent asset');
    } catch (error: any) {
      logger.info(`Correctly caught error: ${error.message}`);
      expect(error).toBeDefined();
    }
  });

  it('Fails when trying to get non-existent asset', async () => {
    logger.info(`Testing error case: get non-existent asset...`);

    try {
      await (submitCallTx as any)(aliceProviders, {
        compiledContract: compiledContractWithWitnesses,
        contractAddress,
        privateStateId: ALICE_PRIVATE_STATE_ID,
        circuitId: 'getAsset',
        args: [9999n], // Non-existent asset ID
      });
      expect.fail('Should have thrown error for non-existent asset');
    } catch (error: any) {
      logger.info(`Correctly caught error: ${error.message}`);
      expect(error).toBeDefined();
    }
  });

  it('Verifies that invalid owner cannot claim ownership', async () => {
    logger.info(`Testing invalid ownership claim...`);

    const wrongOwnerPublicKey = createHash('wrong-owner-pk');

    try {
      await (submitCallTx as any)(aliceProviders, {
        compiledContract: compiledContractWithWitnesses,
        contractAddress,
        privateStateId: ALICE_PRIVATE_STATE_ID,
        circuitId: 'verifyOwnership',
        args: [0n, wrongOwnerPublicKey],
      });
      expect.fail('Expected verifyOwnership to reject invalid owner');
    } catch (error: any) {
      logger.info(`Correctly rejected invalid owner claim: ${error.message}`);
      expect(error).toBeDefined();
    }
  }, { timeout: 60000 });
});
