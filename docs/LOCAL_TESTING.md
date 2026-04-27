# Local Testing Guide

Complete guide for testing the ZERA platform locally, including smart contracts, web application, and storage services.

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Testing Smart Contracts](#testing-smart-contracts)
- [Testing Web Application](#testing-web-application)
- [Testing Storage Service](#testing-storage-service)
- [Integration Testing](#integration-testing)
- [Troubleshooting](#troubleshooting)

---

## Overview

ZERA's local testing environment consists of three main components:

1. **Smart Contracts** - Midnight Network contracts with ZK circuits
2. **Web Application** - Next.js frontend with Prisma database
3. **Storage Service** - Rust-based IPFS API

This guide covers how to test each component individually and as an integrated system.

---

## Prerequisites

Before running local tests, ensure you have:

- ✅ **Node.js** >= 22.0.0
- ✅ **Bun** package manager
- ✅ **Docker** and Docker Compose
- ✅ **Compact Compiler** installed and in PATH
- ✅ **Cargo/Rust** >= 1.75.0 (for storage service)
- ✅ **PostgreSQL** (via Docker or local installation)
- ✅ **Pinata JWT Token** (for IPFS testing)

### Verify Prerequisites

```bash
# Check Node.js version
node --version  # Should be >= 22.0.0

# Check Bun
bun --version

# Check Docker
docker --version
docker compose version

# Check Compact compiler
compact --version

# Check Rust/Cargo
cargo --version  # Should be >= 1.75.0
```

---

## Quick Start

### 1. Install Dependencies

```bash
# From project root
bun install
```

### 2. Setup Local Environment

```bash
# Start Docker services (Midnight node, indexer, proof server, PostgreSQL)
bun run services:up

# Compile contracts and setup database
bun run project:prepare
```

### 3. Run All Tests

```bash
# Run smart contract tests
bun run test
```

---

## Testing Smart Contracts

### Setup

**1. Start Local Midnight Network:**

```bash
# From project root
bun run services:up
```

This starts:
- **Midnight Node** (port 9944) - Local blockchain
- **Indexer** (port 8088) - Blockchain data indexer
- **Proof Server** (port 6300) - ZK proof generation
- **PostgreSQL** (port 5432) - Database for web app

**2. Verify Services are Running:**

```bash
# Check Docker containers
docker compose ps

# Expected output:
# NAME                IMAGE                                    STATUS
# zera-indexer-1      midnightntwrk/indexer-standalone:4.0.0  Up (healthy)
# zera-node-1         midnightntwrk/midnight-node:0.22.3       Up (healthy)
# zera-proof-server-1 midnightntwrk/proof-server:8.0.3         Up
# zera-db             postgres:16                              Up
```

**3. Compile Smart Contracts:**

```bash
# Compile Compact contracts
bun run compact:compile

# Build TypeScript bindings
bun --filter @zera/contracts build
```

### Running Contract Tests

**Run Full Test Suite:**

```bash
# From project root
bun run test

# Or from contracts directory
cd contracts
bun run test
```

**Test Coverage:**

The test suite (`contracts/test/hw.test.ts`) includes:

- ✅ Contract deployment
- ✅ Asset registration
- ✅ Asset retrieval
- ✅ Asset existence checks
- ✅ Ownership assignment
- ✅ Ownership transfer
- ✅ Asset verification
- ✅ Ownership verification
- ✅ Error handling (non-existent assets, invalid owners)
- ✅ Duplicate prevention

**Expected Output:**

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
Duration: ~35s
```

### Manual Contract Testing

**1. Deploy Contract Locally:**

```bash
# From project root
bun run deploy
```

**2. Interact with Deployed Contract:**

```typescript
// Example: Register an asset
import { submitCallTx } from '@zera/contracts';
import { providers, compiledContract, contractAddress } from './setup';

const assetHash = new Uint8Array(32).fill(1);
const metadataHash = new Uint8Array(32).fill(2);
const timestamp = BigInt(Date.now());

await submitCallTx(providers, {
  compiledContract,
  contractAddress,
  privateStateId,
  circuitId: 'registerAsset',
  args: [assetHash, metadataHash, timestamp]
});
```

### Debugging Contract Tests

**Enable Verbose Logging:**

```bash
# Set log level
export RUST_LOG=debug

# Run tests with detailed output
bun run test
```

**Check Service Logs:**

```bash
# View all service logs
docker compose logs

# View specific service
docker compose logs node
docker compose logs indexer
docker compose logs proof-server
```

### Cleanup

```bash
# Stop all services
bun run services:down

# Clean build artifacts
bun run clean
```

---

## Testing Web Application

### Setup

**1. Ensure Services are Running:**

```bash
# Start Docker services
bun run services:up
```

**2. Setup Database:**

```bash
# Generate Prisma client and push schema
bun run db:setup
```

**3. Copy Contract Artifacts:**

```bash
# Copy compiled contract artifacts to web/public
bun run copy-artifacts
```

**4. Configure Environment:**

```bash
# Copy environment template
cd web
cp .env.example .env

# Edit .env with your configuration
```

**Required Environment Variables:**

```env
# Database
DATABASE_URL="postgresql://postgres:zera@localhost:5432/zera"

# Midnight Network (local)
NEXT_PUBLIC_INDEXER_URL="http://localhost:8088"
NEXT_PUBLIC_PROOF_SERVER_URL="http://localhost:6300"
NEXT_PUBLIC_NODE_URL="ws://localhost:9944"

# IPFS Storage Service
NEXT_PUBLIC_IPFS_API_URL="http://localhost:8080"

# API
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### Running Web Application

**Start Development Server:**

```bash
# From project root
bun run dev:web

# Or from web directory
cd web
bun run dev
```

**Access Application:**

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Manual Testing Workflows

#### 1. Asset Registration Flow

**Steps:**

1. Navigate to `/create-asset`
2. Fill in asset details:
   - Asset name
   - Description
   - Upload image/file
3. Click "Register Asset"
4. Wait for transaction confirmation
5. Verify asset appears in dashboard

**Expected Behavior:**

- File uploads to IPFS via storage service
- Asset registers on Midnight blockchain
- Asset appears in database
- Asset visible in dashboard

#### 2. Asset Verification Flow

**Steps:**

1. Navigate to `/assets/[id]`
2. Click "Verify Asset"
3. Check verification status

**Expected Behavior:**

- ZK proof generated
- Verification circuit executes
- Verification status displayed

#### 3. Ownership Transfer Flow

**Steps:**

1. Navigate to owned asset
2. Click "Transfer Ownership"
3. Enter new owner's public key
4. Confirm transfer
5. Wait for transaction

**Expected Behavior:**

- Ownership transfers on-chain
- New owner can verify ownership
- Previous owner loses access

### Testing Database Operations

**Access Prisma Studio:**

```bash
# From web directory
npx prisma studio
```

This opens a GUI at [http://localhost:5555](http://localhost:5555) for:
- Viewing database records
- Manually editing data
- Testing queries

**Reset Database:**

```bash
# From web directory
bun run prisma:db-push --force-reset
```

### Testing API Endpoints

**Health Check:**

```bash
curl http://localhost:3000/api/health
```

**Get All Assets:**

```bash
curl http://localhost:3000/api/assets
```

**Get Asset by ID:**

```bash
curl http://localhost:3000/api/assets/1
```

**Get Assets by Owner:**

```bash
curl http://localhost:3000/api/assets/owner/[ownerAddress]
```

**Verify Asset:**

```bash
curl -X POST http://localhost:3000/api/assets/[id]/verify \
  -H "Content-Type: application/json" \
  -d '{"publicKey": "0x..."}'
```

**Transfer Asset:**

```bash
curl -X POST http://localhost:3000/api/assets/[id]/transfer \
  -H "Content-Type: application/json" \
  -d '{"newOwnerPublicKey": "0x..."}'
```

---

## Testing Storage Service

### Setup

**1. Navigate to Storage Directory:**

```bash
cd storage
```

**2. Configure Environment:**

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your Pinata JWT
```

**Required Environment Variables:**

```env
# Pinata API JWT Token (required)
PINATA_JWT=your_jwt_token_here

# Server Configuration (optional)
PORT=8080
HOST=0.0.0.0
RUST_LOG=info
```

**Get Pinata JWT Token:**

1. Sign up at [Pinata Cloud](https://www.pinata.cloud/)
2. Navigate to API Keys section
3. Create new API key with pinning permissions
4. Copy JWT token to `.env`

**3. Build Service:**

```bash
# Build in release mode
cargo build --release
```

### Running Storage Service

**Start Service:**

```bash
# From storage directory
cargo run --release

# Or from project root
bun run storage:dev
```

**Expected Output:**

```
🚀 ZERA IPFS API Server
📡 Listening on: http://0.0.0.0:8080
🔗 Endpoints:
   GET  /health
   POST /upload
   GET  /fetch/:cid
   GET  /verify/:cid
```

### Testing Storage Endpoints

#### 1. Health Check

```bash
curl http://localhost:8080/health

# Expected response:
# {"status":"healthy","version":"2.0.0"}
```

#### 2. Upload File

```bash
# Upload public file
curl -X POST http://localhost:8080/upload \
  -F "file=@test-image.png"

# Expected response:
# {
#   "success": true,
#   "cid": "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
#   "gateway": "https://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi.ipfs.w3s.link",
#   "is_private": false
# }
```

```bash
# Upload private file
curl -X POST http://localhost:8080/upload?private=true \
  -F "file=@document.pdf"
```

#### 3. Verify CID

```bash
curl http://localhost:8080/verify/bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi

# Expected response:
# {"success": true, "reachable": true}
```

#### 4. Fetch File

```bash
curl http://localhost:8080/fetch/bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi

# Expected response:
# {"success": true, "path": "downloads/bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi"}

# File saved to: storage/downloads/{cid}
```

### Testing with JavaScript

```javascript
// Upload file
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('http://localhost:8080/upload', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log('CID:', result.cid);
console.log('Gateway:', result.gateway);

// Verify CID
const verifyResponse = await fetch(
  `http://localhost:8080/verify/${result.cid}`
);
const verifyResult = await verifyResponse.json();
console.log('Reachable:', verifyResult.reachable);
```

### Running Storage Tests

```bash
# From storage directory
cargo test

# Run with output
cargo test -- --nocapture

# Run specific test
cargo test test_name
```

---

## Integration Testing

### Full System Test

Test the complete flow from asset creation to ownership transfer:

**1. Start All Services:**

```bash
# From project root
bun run start:all
```

This command:
- Starts Docker services (Midnight network + PostgreSQL)
- Compiles smart contracts
- Deploys contracts locally
- Starts web application (port 3000)
- Starts storage service (port 8080)

**2. Test Complete Asset Lifecycle:**

**Step 1: Upload File to IPFS**

```bash
curl -X POST http://localhost:8080/upload \
  -F "file=@test-asset.png"

# Save the returned CID
```

**Step 2: Register Asset on Blockchain**

```bash
curl -X POST http://localhost:3000/api/assets \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Asset",
    "description": "Integration test asset",
    "metadataCID": "bafybeig...",
    "assetHash": "0x1234..."
  }'

# Save the returned asset ID
```

**Step 3: Verify Asset**

```bash
curl -X POST http://localhost:3000/api/assets/1/verify \
  -H "Content-Type: application/json" \
  -d '{"publicKey": "0x..."}'
```

**Step 4: Assign Ownership**

```bash
curl -X POST http://localhost:3000/api/assets/1/claim \
  -H "Content-Type: application/json" \
  -d '{"ownerPublicKey": "0x..."}'
```

**Step 5: Transfer Ownership**

```bash
curl -X POST http://localhost:3000/api/assets/1/transfer \
  -H "Content-Type: application/json" \
  -d '{"newOwnerPublicKey": "0x..."}'
```

**Step 6: Verify New Ownership**

```bash
curl -X POST http://localhost:3000/api/assets/1/verify \
  -H "Content-Type: application/json" \
  -d '{"publicKey": "0x...(new owner)"}'
```

### Browser Testing

**1. Open Application:**

Navigate to [http://localhost:3000](http://localhost:3000)

**2. Test User Flows:**

- Create new asset
- View asset details
- Verify asset authenticity
- Transfer ownership
- View activity logs
- Check dashboard statistics

**3. Test Error Handling:**

- Try to verify non-existent asset
- Try to transfer asset you don't own
- Upload invalid file formats
- Submit invalid CIDs

---

## Troubleshooting

### Contract Tests Failing

**Issue: "Contract not found"**

```bash
# Ensure services are running
docker compose ps

# Restart services
bun run services:down
bun run services:up

# Recompile and redeploy
bun run compact:compile
bun run deploy
```

**Issue: "DUST generation timeout"**

```bash
# Wait longer (DUST generation can take 30-60 seconds)
# Or check node logs
docker compose logs node
```

**Issue: "Cannot find module '../managed/zera/contract'"**

```bash
# Compile contracts first
bun run compact:compile
bun --filter @zera/contracts build
```

### Web Application Issues

**Issue: "Cannot connect to database"**

```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Verify DATABASE_URL in .env
cat web/.env | grep DATABASE_URL

# Reset database
cd web
bun run prisma:db-push --force-reset
```

**Issue: "Contract artifacts not found"**

```bash
# Copy artifacts to web/public
bun run copy-artifacts

# Verify files exist
ls -la web/public/managed/zera/
```

**Issue: "Wallet sync failed"**

```bash
# Check Midnight services are running
curl http://localhost:8088/health  # Indexer
curl http://localhost:6300/version # Proof server

# Clear wallet state
rm -rf web/midnight-level-db
```

### Storage Service Issues

**Issue: "PINATA_JWT not found"**

```bash
# Check .env file exists
ls -la storage/.env

# Verify JWT is set
cat storage/.env | grep PINATA_JWT

# If missing, add your JWT token
echo "PINATA_JWT=your_token_here" > storage/.env
```

**Issue: "Upload failed with status 401"**

```bash
# Invalid Pinata JWT token
# Generate new token at: https://app.pinata.cloud/keys
# Update storage/.env with new token
# Restart service
```

**Issue: "Port 8080 already in use"**

```bash
# Find process using port
lsof -i :8080  # macOS/Linux
netstat -ano | findstr :8080  # Windows

# Kill process or change port
export PORT=8081
cargo run --release
```

### Docker Issues

**Issue: Services won't start**

```bash
# Check Docker is running
docker ps

# View service logs
docker compose logs

# Restart Docker daemon
# macOS: Restart Docker Desktop
# Linux: sudo systemctl restart docker

# Clean and restart
docker compose down -v
docker compose up -d --wait
```

**Issue: "Unhealthy" service status**

```bash
# Check specific service logs
docker compose logs indexer
docker compose logs node

# Wait longer for services to initialize
# Indexer can take 30-60 seconds to become healthy

# Restart specific service
docker compose restart indexer
```

### General Issues

**Issue: Tests are slow**

```bash
# ZK proof generation is computationally intensive
# Expected test duration: 30-60 seconds
# Use release builds for better performance
cargo build --release
```

**Issue: Out of memory**

```bash
# Increase Node.js memory limit
export NODE_OPTIONS='--max-old-space-size=4096'

# Or run with increased memory
NODE_OPTIONS='--max-old-space-size=4096' bun run test
```

**Issue: Clean slate needed**

```bash
# Complete cleanup and restart
bun run services:down
bun run clean
docker system prune -a
bun install
bun run project:prepare
bun run test
```

---

## Testing Checklist

Before considering local testing complete, verify:

### Smart Contracts
- [ ] All contract tests pass
- [ ] Contract deploys successfully
- [ ] Asset registration works
- [ ] Ownership assignment works
- [ ] Ownership transfer works
- [ ] Asset verification works
- [ ] Error handling works correctly

### Web Application
- [ ] Application starts without errors
- [ ] Database connection works
- [ ] Contract artifacts loaded
- [ ] Asset creation flow works
- [ ] Asset listing works
- [ ] Asset details page works
- [ ] Verification flow works
- [ ] Transfer flow works

### Storage Service
- [ ] Service starts successfully
- [ ] Health check responds
- [ ] File upload works
- [ ] CID verification works
- [ ] File fetch works
- [ ] Error handling works

### Integration
- [ ] End-to-end asset lifecycle works
- [ ] All services communicate correctly
- [ ] Database updates reflect blockchain state
- [ ] IPFS files are accessible
- [ ] ZK proofs generate and verify

---

## Additional Resources

- [Contracts README](../contracts/README.md) - Smart contract documentation
- [Web README](../web/README.md) - Web application documentation
- [Storage README](../storage/README.md) - Storage service documentation
- [Midnight Documentation](https://docs.midnight.network/) - Midnight Network docs
- [Vitest Documentation](https://vitest.dev/) - Testing framework docs

---

## Support

For testing issues:
- Check service logs: `docker compose logs`
- Verify all prerequisites are installed
- Ensure environment variables are set correctly
- Review error messages carefully
- Try clean restart: `bun run services:down && bun run project:prepare`
