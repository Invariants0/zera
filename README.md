<div align="center">
  <h1>ZERA</h1>
  <p><strong>The Institutional-Grade Digital Asset Marketplace</strong></p>
</div>

<br />

## 🌐 Vision

> [!NOTE]  
> **NFTs were supposed to redefine ownership. Instead, they became synonymous with speculation.**
> 
> Ownership can be faked. Assets can be duplicated. Identity is either exposed or completely absent. Compliance doesn’t exist.
> So the market reacted accordingly: **NFTs are still seen as speculative toys, not serious assets.**

**ZERA changes that.**  
We are not building another marketplace. We are rebuilding the foundation of digital ownership.

**ZERA transforms digital assets into:**
- **Verified** — provably authentic  
- **Private** — ownership without exposure  
- **Compliant** — enforceable without revealing data  

**This represents a fundamental paradigm shift from:**
- ❌ Visibility → ✅ **Verifiability**  
- ❌ Hype → ✅ **Legitimacy**  
- ❌ Assumptions → ✅ **Cryptographic Proof**  

Most marketplaces optimize for hype, visibility, and speculation.  
**ZERA optimizes for legitimacy, trust, and enforceability.**

<br />

<p align="center">
  <img width="1983" height="793" alt="zerabanner" src="https://github.com/user-attachments/assets/944005ae-5f06-4c8e-8303-9191dc2ce71f" />
</p>

<br />

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active%20Development-0f172a?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Privacy-ZK%20Powered-22c55e?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Focus-Verified%20Assets-a3e635?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Built%20On-Midnight%20Network-84cc16?style=for-the-badge"/>
</p>

<br />

## 💼 Business Development & Viability

ZERA unlocks participation from markets that traditional NFT platforms cannot reach. By embedding privacy and compliance at the protocol level, it enables:

- **Institutional participation**
- **Regulated asset trading**
- **High-value asset tokenization**

This is where digital assets transition from speculative instruments to **financial infrastructure**.  
> [!IMPORTANT]  
> When trust becomes provable, markets expand.

---

## 🚀 Product

ZERA is a **verification-first, privacy-preserving** asset registry and marketplace. It replaces trust assumptions with cryptographic proof systems.

### 🔑 Core Features

#### Verified Asset Registry
- **Verification Mandatory:** Assets must be verified before listing.
- **Fraud Prevention:** Prevents duplication and fake ownership.
- **Marketplace Integrity:** Ensures complete ecosystem legitimacy.

#### Proof of Authenticity
- **Creator Signatures:** Backed by verifiable creator signatures.
- **Source Verification:** Strictly enforced at the contract level.
- **Cryptographic Legitimacy:** Every asset is guaranteed authentic.

#### Private Ownership
- **Identity Protection:** Prove ownership without revealing identity.
- **No Wallet Exposure:** Public addresses are kept private.
- **Provable, Not Visible:** Ownership is a cryptographic fact, not a public spectacle.

#### Proof of Eligibility
- **Zero-Knowledge KYC:** Verify compliance without exposing personal data.
- **Private Trading:** Trade eligibility proven without revealing identity.
- **Compliance via Math:** Achieved through cryptographic proofs, not surveillance.

#### Private Transactions
- **Secure Transfers:** Fully compliant and secure asset movement.
- **Private Execution:** Trades happen under complete privacy.
- **Step-by-step Verification:** Verified at every step of the transaction loop.

---

## 🔄 Product Flow

### 🏗️ Asset Creation
> **Upload → Sign → Verify → Register → Trade**

1. Creator **signs** the asset.
2. System **verifies** authenticity.
3. Asset is **registered** and becomes tradable.

### 💳 Buying an Asset
> **Generate Proof → Verify Compliance → Execute Transfer**

1. Buyer generates an **eligibility proof**.
2. System verifies **compliance**.
3. Ownership transfers **privately**.

### 🔍 Ownership Verification
> **Generate Proof → Verify → Confirm Ownership**

1. Ownership is verified **without revealing identity**.
2. **No wallet exposure** during the process.
3. Fully **trustless confirmation**.

---

## 🎯 Use Cases

- **High-value digital art** with verifiable, private provenance.
- **Tokenized Real-World Assets (RWAs)** requiring compliance.
- **Private ownership** of highly sensitive digital assets.
- **Institutional-grade** digital asset trading and clearing.

---

## 🔮 Future Scope

ZERA is designed as a foundational layer for digital ownership. Planned expansions include:

- **Multi-Asset Class Support:** Real estate, securities, and Intellectual Property (IP).
- **Regulatory Integrations:** Advanced compliance protocols tailored for global jurisdictions.
- **Institutional Custody Solutions:** Secure, scalable custody for large-scale players.
- **Cross-Chain Verification:** Agnostic proof verification across multiple networks.
- **Reputation Systems:** Advanced, privacy-preserving trust scores for network participants.

---

## 🛠️ Technology Stack

<p align="center">
  <img src="https://img.shields.io/badge/Midnight_Network-000000?style=flat-square&logo=polkadot&logoColor=white" alt="Midnight Network" />
  <img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Zero_Knowledge-512BD4?style=flat-square&logo=springsecurity&logoColor=white" alt="ZK Proofs" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Yarn-2C8EBB?style=flat-square&logo=yarn&logoColor=white" alt="Yarn" />
</p>

## Architecture

> [!NOTE]  
> For a more detailed breakdown of our system components, please refer to our full documentation.

```mermaid
graph TD
    Client[Client App Next.js] --> API[Backend API Routes]
    API --> Prisma[Prisma ORM]
    Prisma --> DB[(PostgreSQL Database)]
    API --> Contract[Midnight Smart Contract Compact]
    Contract --> Midnight[Midnight Network Proof Server]
    Client --> Wallet[User Wallet Integration]
    Wallet --> Midnight
```

<details>
<summary><b>Prerequisites</b></summary>
<br/>

> [!WARNING]  
> Ensure you have the exact Node and Bun versions specified to avoid compilation errors.

- Node.js >= 22.0.0
- Bun >= 1.0.0
- Docker (for local network and DB)
- Cargo/Rust (for storage service)
- Compact compiler (for contract compilation)

</details>

<details>
<summary><b>Installation & Compilation</b></summary>
<br/>

### Installation

```bash
bun install
```

### Setup the Entire Project

> [!IMPORTANT]  
> Before deploying or testing, run the preparation script to compile the smart contracts, set up the database, and configure services:

```bash
bun run project:prepare
```

This generates the contract artifacts, sets up Prisma, and starts the local Docker services.

</details>

<details>
<summary><b>Deploy to Preprod Network</b></summary>
<br/>

Deploy the contract to Midnight's preprod network:

```bash
bun run deploy
```

This will:
1. Prompt you to create a new wallet or restore from an existing seed
2. Display your wallet address for funding
3. Wait for you to fund the wallet via the [Midnight Faucet](https://faucet.preprod.midnight.network/)
4. Wait for DUST to be generated
5. Deploy the contract
6. Save deployment info to `deployment.json`

> [!NOTE]  
> The preprod deployment uses the public proof server at `https://lace-proof-pub.preprod.midnight.network`, so you don't need to run Docker.

</details>

<details>
<summary><b>Local Development & Testing</b></summary>
<br/>

> [!TIP]
> For local testing, you can use the built-in commands to manage services and run tests.

```bash
# Start local network and services (indexer, node, proof server, postgres)
bun run services:up

# Run tests against local network
bun run test

# Stop local network and services
bun run services:down

# Or start everything for local development (Next.js, Storage, Contract deploy)
bun run start:all
```

</details>

<details>
<summary><b>Network Configuration</b></summary>
<br/>

The project supports two networks:

- **Local**: Uses Docker Compose services (requires `bun run services:up`)
- **Preprod**: Uses public Midnight preprod endpoints (no Docker needed)

> [!CAUTION]
> Always verify the network configuration before executing deployment commands to avoid deploying sensitive data locally or test data to preprod.

Set the network via the `MIDNIGHT_NETWORK` environment variable:
- `local` - Local development network
- `preprod` - Midnight preprod testnet (default for deploy)

</details>

<details>
<summary><b>Project Structure</b></summary>
<br/>

```text
.
├── web/                      # Next.js Frontend App (Zustand, Tailwind, Prisma)
├── contracts/                # Midnight Network Smart Contracts (Compact)
├── storage/                  # Rust/Cargo Storage Service
├── scripts/                  # Utility scripts
├── package.json              # Bun Workspace configuration
└── compose.yml               # Docker services for Midnight + Postgres
```

</details>

<details>
<summary><b>Smart Contract</b></summary>
<br/>

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

</details>

<details>
<summary><b>Available Scripts</b></summary>
<br/>

- `bun install` - Install dependencies for all workspaces
- `bun run project:prepare` - Full project setup (compiles, copies artifacts, DB setup)
- `bun run services:up` - Start local Docker services
- `bun run services:down` - Stop local Docker services
- `bun run start:all` - Start web UI, storage API, and deploy locally
- `bun run test` - Run smart contract tests
- `bun run deploy` - Deploy contracts to the network

</details>

<details>
<summary><b>Troubleshooting</b></summary>
<br/>

### Native Module Build Warnings

> [!NOTE]  
> You may see warnings about `cpu-features` or other native modules during installation. These are non-fatal and don't affect functionality.

### Contract Not Found

> [!WARNING]  
> If you see "Cannot find module '../contracts/index.js'", run:

```bash
bun run compact:compile
```

### Local Network Issues

> [!CAUTION]
> If local tests fail, ensure Docker is running and services are healthy:

```bash
bun run services:up
docker compose ps
```

</details>

---

<p align="center">
  Built with ❤️ during Hilo Hack
</p>
