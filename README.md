# Zera Asset Registry - Midnight Network Smart Contract

An asset registry and ownership management smart contract for the Midnight Network that enables cryptographically-verified asset registration, verification, and ownership transfer on the blockchain.

<img width="1983" height="793" alt="zerabanner" src="https://github.com/user-attachments/assets/944005ae-5f06-4c8e-8303-9191dc2ce71f" />

## Prerequisites

- Node.js >= 22.0.0
- Yarn 1.22.22
- Compact compiler (for contract compilation)

## Installation

```bash
yarn install
```

## Compile the Contract

Before deploying or testing, compile the Compact smart contract:

```bash
cd contracts && compact compile main.compact managed/zera
```

This generates the contract artifacts in `managed/zera/`.

## Deploy to Preprod Network

Deploy the contract to Midnight's preprod network:

```bash
yarn deploy
```

This will:
1. Prompt you to create a new wallet or restore from an existing seed
2. Display your wallet address for funding
3. Wait for you to fund the wallet via the [Midnight Faucet](https://faucet.preprod.midnight.network/)
4. Wait for DUST to be generated
5. Deploy the contract
6. Save deployment info to `deployment.json`

**Note:** The preprod deployment uses the public proof server at `https://lace-proof-pub.preprod.midnight.network`, so you don't need to run Docker.

## Local Development & Testing

For local testing, you'll need to run the local Midnight network infrastructure:

```bash
# Start local network (indexer, node, proof server)
yarn env:up

# Run tests against local network
yarn test:local

# Stop local network
yarn env:down

# Or run everything together
yarn validate
```

## Network Configuration

The project supports two networks:

- **Local**: Uses Docker Compose services (requires `yarn env:up`)
- **Preprod**: Uses public Midnight preprod endpoints (no Docker needed)

Set the network via the `MIDNIGHT_NETWORK` environment variable:
- `local` - Local development network
- `preprod` - Midnight preprod testnet (default for deploy)

## Project Structure

```
.
├── contracts/
│   ├── main.compact          # Smart contract source
│   └── index.js              # Contract exports
├── managed/zera/             # Compiled contract artifacts (generated)
│   ├── contract/             # Contract JavaScript/TypeScript
│   └── keys/                 # ZK proof keys
├── src/
│   ├── config.ts             # Network configurations
│   ├── deploy.ts             # Deployment script
│   ├── providers.ts          # Provider setup
│   ├── wallet.ts             # Wallet management
│   └── test/
│       └── hw.test.ts        # Contract tests
└── compose.yml               # Docker services for local dev
```

## Smart Contract

The contract (`contracts/main.compact`) provides an Asset Registry with the following features:

### Ledger State
- **assetCount**: Counter tracking total registered assets
- **assets**: Map of registered assets indexed by ID
- **commitments**: Map of asset commitments for duplicate prevention
- **ownershipCommitments**: Map tracking asset ownership relationships

### Circuits (Functions)
- **registerAsset**(assetHash, metadataHash, timestamp) - Register a new asset
- **verifyAsset**(assetHash, creatorPublicKey) - Verify asset authenticity
- **assetExists**(id) - Check if an asset exists
- **getAsset**(id) - Retrieve asset data
- **assignOwnership**(assetId) - Assign ownership to an asset
- **transferOwnership**(assetId, newOwnerPublicKey) - Transfer asset ownership
- **verifyOwnership**(assetId, publicKey) - Verify asset ownership

## Available Scripts

- `yarn compile` - Compile the Compact smart contract
- `yarn deploy` - Deploy to preprod network
- `yarn test` - Run tests
- `yarn test:local` - Run tests on local network
- `yarn env:up` - Start local Docker environment
- `yarn env:down` - Stop local Docker environment
- `yarn validate` - Full local test cycle (start env, test, stop env)

## Troubleshooting

### Native Module Build Warnings

You may see warnings about `cpu-features` or other native modules during installation. These are non-fatal and don't affect functionality.

### Contract Not Found

If you see "Cannot find module '../contracts/index.js'", run:

```bash
yarn compile
```

### Local Network Issues

If local tests fail, ensure Docker is running and services are healthy:

```bash
yarn env:up
docker compose ps
```
