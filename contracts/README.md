# Zera Asset Registry - Smart Contracts

Midnight Network smart contracts for the Zera Asset Registry, written in Compact - Midnight's dedicated smart contract language for privacy-preserving DApps.

## 📋 Table of Contents

- [Overview](#overview)
- [Contract Architecture](#contract-architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contract API](#contract-api)
- [Troubleshooting](#troubleshooting)

---

## Overview

The Zera Asset Registry is a privacy-preserving smart contract that enables:

- **Asset Registration**: Register digital assets with cryptographic verification
- **Ownership Management**: Assign and transfer asset ownership with zero-knowledge proofs
- **Asset Verification**: Verify asset authenticity and ownership without revealing sensitive data
- **Duplicate Prevention**: Prevent duplicate asset registration using commitments

### Key Features

- ✅ **Privacy-First**: Uses zero-knowledge proofs for sensitive operations
- ✅ **Cryptographic Security**: All operations use persistent hashing and commitments
- ✅ **Ownership Tracking**: Secure ownership assignment and transfer
- ✅ **Asset Verification**: Verify assets without exposing private data
- ✅ **Duplicate Prevention**: Commitment-based duplicate detection

---

## Contract Architecture

### Ledger State

The contract maintains the following on-chain state:

```compact
// Asset Registry
export ledger assetCount: Counter;
export ledger assets: Map<Uint<64>, Asset>;
export ledger commitments: Map<Bytes<32>, Boolean>;

// Ownership
export ledger ownershipCommitments: Map<Uint<64>, Bytes<32>>;
```

**State Variables:**
- `assetCount`: Counter tracking total registered assets
- `assets`: Map of asset ID → Asset data
- `commitments`: Map of asset commitments for duplicate prevention
- `ownershipCommitments`: Map of asset ID → ownership commitment

### Asset Structure

```compact
export struct Asset {
  creatorPublicKey: Bytes<32>;  // Creator's public key
  assetHash:        Bytes<32>;  // Unique asset identifier
  metadataHash:     Bytes<32>;  // IPFS/metadata hash
  timestamp:        Uint<64>;   // Registration timestamp
}
```

### Witnesses (Private Inputs)

```compact
witness creatorSecretKey(): Bytes<32>;  // Creator's private key
witness ownerSecretKey(): Bytes<32>;    // Owner's private key
```

Witnesses are private inputs provided during circuit execution that are never revealed on-chain.

---

## Project Structure

```
contracts/
├── src/
│   ├── main.compact          # Smart contract source code
│   ├── index.ts              # Contract exports and factory functions
│   ├── config.ts             # Network configuration (local/preprod)
│   ├── deploy.ts             # Deployment script
│   ├── providers.ts          # Provider setup (indexer, proof server, etc.)
│   ├── wallet.ts             # Wallet management
│   ├── witness.ts            # Witness generation utilities
│   └── managed/              # Generated contract artifacts (after compilation)
│       └── zera/
│           ├── contract/     # TypeScript contract bindings
│           └── keys/         # ZK proof keys
├── dist/                     # Built TypeScript output
├── test/
│   └── hw.test.ts           # Contract integration tests
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── .env.example             # Environment variables template
```

---

## Prerequisites

Before working with the contracts, ensure you have:

- ✅ **Node.js** >= 22.0.0
- ✅ **Bun** package manager
- ✅ **Compact Compiler** installed and in PATH
- ✅ **Docker** (for local network testing)
- ✅ **WSL** (Windows only)

See the main [SETUP.md](../docs/SETUP.md) for detailed installation instructions.

---

## Installation

### 1. Install Dependencies

```bash
# From project root
bun install

# Or from contracts directory
cd contracts
bun install
```

### 2. Verify Compact Installation

```bash
compact --version
compact compile --version
```

### 3. Setup Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
```

**Environment Variables:**

```env
# Network: 'local' or 'preprod'
MIDNIGHT_NETWORK=local

# Local network endpoints (default)
MIDNIGHT_INDEXER_URL=http://localhost:8088
MIDNIGHT_PROOF_SERVER_URL=http://localhost:6300

# Wallet seed (generated during deployment)
seed=
```

---

## Development

### Compile Contract

Compile the Compact smart contract to generate TypeScript bindings and ZK proof keys:

```bash
# From project root
bun run compact:compile

# Or from contracts directory
bun run compact:compile
```

**What this does:**
1. Compiles `src/main.compact` using the Compact compiler
2. Generates TypeScript contract bindings in `src/managed/zera/contract/`
3. Generates zero-knowledge proof keys in `src/managed/zera/keys/`

**Output:**
```
src/managed/zera/
├── contract/
│   ├── index.d.ts
│   ├── index.js
│   └── ...
└── keys/
    ├── proving.key
    ├── verification.key
    └── ...
```

### Build TypeScript

Build the TypeScript contract package:

```bash
bun run build
```

This compiles TypeScript and copies artifacts to `dist/`.

### Type Checking

```bash
bun run typecheck
```

### Clean Build Artifacts

```bash
bun run clean
```

Removes `dist/` and `src/managed/` directories.

---

## Testing

### Local Network Testing

**1. Start Local Midnight Network:**

```bash
# From project root
bun run services:up
```

This starts:
- Midnight Node (port 9944)
- Indexer (port 8088)
- Proof Server (port 6300)

**2. Run Tests:**

```bash
# From project root
bun run test

# Or from contracts directory
bun run test
```

**3. Stop Local Network:**

```bash
bun run services:down
```

### Test Suite

The test suite (`test/hw.test.ts`) covers:

- ✅ Contract deployment
- ✅ Asset registration
- ✅ Asset retrieval
- ✅ Asset existence checks
- ✅ Ownership assignment
- ✅ Ownership transfer
- ✅ Asset verification
- ✅ Ownership verification
- ✅ Error handling (non-existent assets, invalid owners)

**Example Test Output:**

```
✓ Deploys the contract (5234ms)
✓ Registers a new asset (3421ms)
✓ Retrieves registered asset (2156ms)
✓ Checks asset existence (1987ms)
✓ Assigns ownership to asset (3102ms)
✓ Registers second asset (3298ms)
✓ Verifies asset authenticity (2543ms)
✓ Transfers ownership to new owner (3187ms)
✓ Verifies new ownership (2234ms)
✓ Fails when trying to assign ownership to non-existent asset (1876ms)
✓ Fails when trying to get non-existent asset (1654ms)
✓ Verifies that invalid owner cannot claim ownership (2109ms)

Test Files  1 passed (1)
Tests  12 passed (12)
```

---

## Deployment

### Deploy to Local Network

**1. Start Local Services:**

```bash
bun run services:up
```

**2. Deploy Contract:**

```bash
bun run deploy
```

**What happens:**
1. Creates or restores wallet (uses pre-funded testkit wallet for local)
2. Waits for wallet sync
3. Registers NIGHT UTXOs for DUST generation
4. Waits for DUST availability
5. Deploys contract to blockchain
6. Saves deployment info to `../deployment.json`

**Deployment Output:**

```
╔════════════════════════════════════════╗
║  MIDNIGHT WALLET SETUP                 ║
╚════════════════════════════════════════╝

  ✓ Local network detected - using testkit pre-funded wallet
  ✓ Wallet Address: tmn1...
  ✓ Wallet funded!
  ✓ DUST available!

╔════════════════════════════════════════╗
║  ✓ DEPLOYMENT SUCCESSFUL               ║
╚════════════════════════════════════════╝

  Contract Address:
    0x1234567890abcdef...

  Deployment Details:
    Network:  undeployed
    Wallet:   tmn1...
    Time:     2024-01-15T10:30:00.000Z
```

### Deploy to Preprod Network

**1. Configure Environment:**

```bash
# Edit .env
MIDNIGHT_NETWORK=preprod
```

**2. Deploy:**

```bash
bun run deploy
```

**3. Fund Wallet:**

When prompted, fund your wallet at: https://faucet.preprod.midnight.network/

**4. Wait for Deployment:**

The script will:
- Wait for funds to arrive
- Register NIGHT for DUST generation
- Wait for DUST availability
- Deploy contract

---

## Contract API

### Circuits (Public Functions)

#### Asset Registry

**`registerAsset(assetHash, metadataHash, timestamp)`**

Register a new asset on the blockchain.

```typescript
await submitCallTx(providers, {
  compiledContract,
  contractAddress,
  privateStateId,
  circuitId: 'registerAsset',
  args: [
    assetHash,      // Bytes<32>: Unique asset identifier
    metadataHash,   // Bytes<32>: IPFS/metadata hash
    timestamp       // Uint<64>: Registration timestamp
  ]
});
```

**`verifyAsset(assetHash, creatorPublicKey)`**

Verify asset authenticity.

```typescript
await submitCallTx(providers, {
  compiledContract,
  contractAddress,
  privateStateId,
  circuitId: 'verifyAsset',
  args: [
    assetHash,          // Bytes<32>: Asset hash to verify
    creatorPublicKey    // Bytes<32>: Creator's public key
  ]
});
```

**`assetExists(id)`**

Check if an asset exists.

```typescript
await submitCallTx(providers, {
  compiledContract,
  contractAddress,
  privateStateId,
  circuitId: 'assetExists',
  args: [id]  // Uint<64>: Asset ID
});
```

**`getAsset(id)`**

Retrieve asset data.

```typescript
await submitCallTx(providers, {
  compiledContract,
  contractAddress,
  privateStateId,
  circuitId: 'getAsset',
  args: [id]  // Uint<64>: Asset ID
});
```

#### Ownership Management

**`assignOwnership(assetId)`**

Assign ownership to an asset.

```typescript
await submitCallTx(providers, {
  compiledContract,
  contractAddress,
  privateStateId,
  circuitId: 'assignOwnership',
  args: [assetId]  // Uint<64>: Asset ID
});
```

**`transferOwnership(assetId, newOwnerPublicKey)`**

Transfer asset ownership.

```typescript
await submitCallTx(providers, {
  compiledContract,
  contractAddress,
  privateStateId,
  circuitId: 'transferOwnership',
  args: [
    assetId,            // Uint<64>: Asset ID
    newOwnerPublicKey   // Bytes<32>: New owner's public key
  ]
});
```

**`verifyOwnership(assetId, publicKey)`**

Verify asset ownership.

```typescript
await submitCallTx(providers, {
  compiledContract,
  contractAddress,
  privateStateId,
  circuitId: 'verifyOwnership',
  args: [
    assetId,    // Uint<64>: Asset ID
    publicKey   // Bytes<32>: Owner's public key
  ]
});
```

### Helper Circuits (Internal)

These circuits are used internally by the contract:

- `deriveCreatorPublicKey(sk)`: Derive creator public key from secret key
- `deriveOwnerPublicKey(sk)`: Derive owner public key from secret key
- `computeCommitment(assetHash, creatorPublicKey)`: Compute asset commitment
- `computeOwnershipCommitment(pk)`: Compute ownership commitment

---

## Troubleshooting

### Issue: "compact: command not found"

**Solution:**

```bash
# Reload shell configuration
source ~/.bashrc  # or ~/.zshrc

# Verify installation
which compact
compact --version
```

### Issue: Compilation fails

**Solution:**

```bash
# Clean and recompile
bun run clean
bun run compact:compile

# Check Compact version
compact --version
```

### Issue: "Cannot find module '../managed/zera/contract'"

**Solution:**

```bash
# Compile contract first
bun run compact:compile

# Then build TypeScript
bun run build
```

### Issue: Tests fail with "Contract not found"

**Solution:**

```bash
# Ensure local network is running
bun run services:up

# Check services are healthy
docker compose ps

# Run tests
bun run test
```

### Issue: Deployment fails with "Insufficient funds"

**Solution:**

**For local network:**
- Local network uses pre-funded testkit wallets
- Should work out of the box

**For preprod:**
- Fund wallet at: https://faucet.preprod.midnight.network/
- Wait for funds to arrive (may take a few minutes)
- Retry deployment

### Issue: "DUST generation timeout"

**Solution:**

```bash
# Wait longer for DUST generation (can take 30-60 seconds)
# Or increase timeout in deploy.ts:

const DUST_TIMEOUT = 240_000; // 4 minutes
```

### Issue: WSL compilation error on Windows

**Solution:**

```bash
# Ensure you're in WSL, not PowerShell
wsl

# Verify Compact is installed in WSL
which compact

# If not found, install in WSL
curl --proto '=https' --tlsv1.2 -LsSf https://github.com/midnightntwrk/compact/releases/latest/download/compact-installer.sh | sh
source ~/.bashrc
```

---

## Additional Resources

- [Midnight Network Documentation](https://docs.midnight.network/)
- [Compact Language Guide](https://docs.midnight.network/develop/compact/)
- [Midnight JS SDK](https://docs.midnight.network/develop/midnight-js/)
- [Zero-Knowledge Proofs](https://docs.midnight.network/learn/zero-knowledge-proofs/)

---

## Support

For issues and questions:
- Check the [main SETUP.md](../docs/SETUP.md)
- Review contract tests in `test/hw.test.ts`
- Check Docker service logs: `docker compose logs`
- Verify Compact installation: `compact --version`

---

## License

See the main project LICENSE file.
