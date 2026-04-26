# Protocol and Privacy Architecture

## 1. Executive Summary
ZERA fundamentally shifts digital asset mechanics from "visibility-first" to "verification-first". By leveraging the zero-knowledge cryptography inherently provided by the Midnight Network, ZERA allows users to prove asset provenance, transfer ownership, and satisfy stringent regulatory compliance (KYC/AML) without ever publishing their plaintext wallet addresses, transaction histories, or sensitive Personally Identifiable Information (PII) to a public ledger.

## 2. Zero-Knowledge Cryptography in ZERA
The bedrock of ZERA's privacy model is the concept of a **Zero-Knowledge Commitment**.

### 2.1 Ownership Commitments vs. Plaintext Addresses
In traditional EVM systems (like Ethereum), ownership is mapped via a simple hash table: `mapping(uint256 => address) ownerOf`. This explicitly ties an asset to a pseudonymous identity, which can be easily deanonymized via chain heuristics.

In ZERA, the ledger stores a **commitment**:
```typescript
commitment = persistentHash([domain_separator, publicKey])
```
- **Domain Separator**: A strictly defined string (e.g., `zera:ownership:commitment`) ensuring that this hash cannot be reverse-engineered or subjected to replay attacks in other smart contract contexts.
- **Public Key**: The true owner's identity.
The resulting hash is written to the ledger state. Observers only see a 32-byte cryptographic hash update, completely blinding the true participants of a transaction.

### 2.2 Witness Generation and Consumption
To manipulate an asset (e.g., to transfer it), the contract requires proof that the caller actually owns it. This is done via **Witnesses**.
Witnesses are private, client-side inputs that are fed into the zero-knowledge prover but are strictly omitted from the broadcasted transaction payload.

There are two primary witnesses in ZERA:
1. `creatorSecretKey`: Utilized during the `registerAsset` circuit. The prover derives the creator's public key from this secret key locally, proves that this public key matches the creator signature on the asset, and the contract accepts the state change without the secret key ever leaving the client.
2. `ownerSecretKey`: Utilized during the `transferOwnership` circuit. The prover calculates the persistent hash of the derived public key and mathematically proves to the network that this hash equals the commitment currently stored on the ledger. 

## 3. Data Models: State Separation
ZERA splits its data architecture across three highly specialized environments to balance privacy, scalability, and performance.

### 3.1 The Relational Database (PostgreSQL / Prisma)
The blockchain is inherently slow and difficult to query. ZERA utilizes a PostgreSQL database running alongside the Next.js backend to serve as a high-speed, off-chain cache.

**Prisma Schema Architecture**:
- **Asset Model**: Contains the `id`, `contractAssetId` (mapping directly to the Midnight ledger), `creator`, `owner`, `metadataUri`, and boolean flags like `isPrivate` and `verified`. 
- **Activity Model**: Tracks historical interactions for analytical and dashboard purposes. Includes the enum `type` (MINT, TRANSFER, SALE, LIST, BURN), the `txHash`, and pricing data.
- **ProofLog Model**: Dedicated to auditing. It stores instances where a wallet requested a mathematical verification check (e.g., proving compliance).

### 3.2 The On-Chain Ledger State (Midnight / Compact)
The on-chain state is aggressively minimized. It stores only what is absolutely necessary to enforce cryptographic constraints.
- `assetCount`: An incremental counter acting as a global nonce for assets.
- `assets`: A map storing minimal public data (creator public keys, hashes, and timestamps).
- `commitments`: A map storing `assetHash` values to rigorously prevent duplicate minting or counterfeit generation.
- `ownershipCommitments`: The mapping of the asset ID to the zero-knowledge ownership hash described in Section 2.1.

### 3.3 The Decentralized Storage Layer (IPFS / Pinata)
Raw asset files (images, audio, PDFs) and extended JSON metadata are pinned to IPFS via Pinata.

**Strict JSON Metadata Schema**:
All metadata must strictly conform to the ZERA standard before the Content Identifier (CID) is generated. This ensures indexers and frontends parse the data deterministically.
```json
{
  "title": "String - The definitive name of the asset",
  "description": "String - A comprehensive description",
  "image_url": "String - The IPFS URI resolving to the primary media",
  "properties": {
    "collection": "String - Optional grouping identifier",
    "tier": "String - Categorization or rarity"
  }
}
```

## 4. Compliance and Zero-Knowledge KYC
To attract institutional capital, ZERA implements a "Proof of Eligibility" system.

### 4.1 The Mechanism
1. A regulated, trusted third-party auditor (e.g., a licensed KYC provider) verifies the user's identity off-chain.
2. Upon passing, the auditor issues a cryptographic credential to the user's localized Lace wallet.
3. When the user attempts to interact with restricted assets (e.g., tokenized real estate or securities), the ZERA contract demands a zero-knowledge proof generated against this specific credential.
4. The proof mathematically guarantees that the user holds a valid, non-expired, non-revoked credential from the exact trusted auditor.

### 4.2 Regulatory Impact
The public blockchain ledger records only that a valid proof was submitted and accepted by the circuit. It absolutely does not record the user's name, passport data, jurisdiction, or nationality. The trading counterparty receives mathematical certainty of compliance, while the user retains absolute privacy, fundamentally solving the paradox of public ledger regulations.
