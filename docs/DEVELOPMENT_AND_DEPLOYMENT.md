# Development and Deployment Guide

## 1. Overview
ZERA is a monorepo leveraging Bun Workspaces to manage the Next.js web application, the Rust storage node, and the Midnight Network smart contract compilation simultaneously. This document outlines the rigorous protocols required to contribute to the codebase and push updates into the production environment.

## 2. Infrastructure Deployment Protocols

### 2.1 The Rust Storage Node (AWS / Render)
The Rust storage API (`/storage`) handles intensive IPFS streaming and must be deployed to a dedicated container environment, isolated from the Next.js server.
1. **Compilation**: Execute `cargo build --release` to generate the highly optimized Linux binary.
2. **Containerization**: The binary is packaged into an Alpine Linux Docker image to minimize surface area and boot times.
3. **Environment Setup**: The container strictly requires the `PINATA_JWT` API token and the `RUST_LOG=info` directive.
4. **Networking**: The service runs on port `8080`. It is highly recommended to place an Nginx reverse proxy or an AWS Application Load Balancer (ALB) in front of the container to handle SSL/TLS termination and provide an additional layer of DDoS protection.

### 2.2 The Next.js Frontend and API (Vercel)
Vercel provides the optimal edge-network hosting for the Next.js 14 App Router.
1. **Database Provisioning**: Provision a production-grade PostgreSQL instance (e.g., Supabase or Neon). Obtain the connection pooling URI.
2. **Vercel Configuration**: Connect the GitHub repository to a new Vercel project. Set the Root Directory to `web/`.
3. **Environment Variables**: Inject `DATABASE_URL`, `CONTRACT_ADDRESS` (obtained from the Midnight deployment), and `STORAGE_API_URL` (pointing to the deployed Rust node).
4. **Build Lifecycle**: During the Vercel build phase, `bun install` executes automatically, followed by `npx prisma generate` to construct the type-safe database client, and finally `next build`.

### 2.3 Smart Contract Deployment (Midnight Preprod)
Moving the `main.compact` contract from the local Docker environment to the live Midnight Preprod network requires careful execution.
1. Verify the `MIDNIGHT_NETWORK` environment variable is strictly set to `preprod`.
2. Generate a fresh deployment wallet using the testkit. Record the wallet address.
3. Navigate to the public [Midnight Faucet](https://faucet.preprod.midnight.network/) and request `tNight` testnet tokens. Wait for the transaction to finalize and for `DUST` to generate.
4. Execute the deployment script via Bun Workspaces:
   ```bash
   bun run deploy
   ```
5. The compiler will generate the necessary zero-knowledge proving keys and submit the bytecode to the network. Capture the resulting transaction hash and the finalized `CONTRACT_ADDRESS`.
6. Update the Vercel environment variables with the new address and trigger a redeployment of the web layer.

## 3. Contribution Guidelines

To ensure institutional-grade software quality, all engineers must strictly adhere to the following workflows.

### 3.1 Branching Strategy
Direct pushes to `main` or `dev` are strictly blocked at the repository level.
- `main`: The pristine, production-ready branch. Code only enters `main` via heavily audited release PRs from `dev`.
- `dev`: The active integration branch.
- `feature/<name>`: Used for building new capabilities (e.g., `feature/kyc-oracle-integration`).
- `bugfix/<name>`: Used exclusively for patching existing issues (e.g., `bugfix/wallet-disconnect-state`).

### 3.2 Commit Conventions
The repository relies on automated changelog generation and semantic versioning. All commits must follow the Conventional Commits specification:
- `feat:` Introduces a new feature to the codebase (correlates with MINOR releases).
- `fix:` Patches a bug in the codebase (correlates with PATCH releases).
- `docs:` Changes that exclusively affect documentation.
- `refactor:` Code changes that neither fix a bug nor add a feature, but improve internal architecture.
- `test:` Adding missing tests or correcting existing test suites.

*Example*: `feat(contracts): implement zero-knowledge kyc eligibility circuit`

### 3.3 Code Quality and Pull Requests
Before opening a Pull Request targeting the `dev` branch, engineers must ensure:
1. **TypeScript Strictness**: `tsc --noEmit` must pass globally. `any` types are explicitly banned and will cause CI pipeline failures.
2. **Rust Safety**: `cargo clippy -- -D warnings` must execute without errors. Code must be formatted using `cargo fmt`.
3. **Test Coverage**: The local Midnight testing suite (`bun run test`) must pass with 100% circuit coverage.
4. **Peer Review**: At least one designated Code Owner must approve the architecture and security implications of the PR before it can be merged.
