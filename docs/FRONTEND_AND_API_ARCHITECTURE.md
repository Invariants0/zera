# Frontend and API Architecture

## 1. Overview
The ZERA Application Stack is heavily decentralized, utilizing a hybrid rendering approach via Next.js 14, global state orchestration via Zustand, and high-throughput microservices in Rust for decentralized storage handling.

## 2. Next.js 14 App Router Framework
ZERA leverages the Next.js App Router (`/src/app`) to maximize Server-Side Rendering (SSR) capabilities, ensuring lightning-fast initial page loads and optimal SEO for listed assets.

### 2.1 Server Components vs. Client Components
- **Server Components**: Used extensively in the `/explore` and asset details pages. These components fetch data directly from the Prisma database securely on the server, ensuring zero database credentials leak to the client bundle.
- **Client Components**: Designated with the `"use client"` directive. These are strictly reserved for components requiring Lace Wallet interactivity, Zustand state subscriptions, and UI animations.

### 2.2 Global State Management (Zustand)
To prevent aggressive React Context re-renders, ZERA employs Zustand slices.
- `WalletStore`: Serves as the ultimate source of truth for the Lace Wallet extension. It maintains the connection status, the active network configuration, the raw UTXO data required for Midnight DUST estimation, and the user's public address.
- `UIStore`: Handles non-persistent ephemeral state, such as sliding sidebar menus, modal visibility (e.g., the "Confirm Transaction" overlay), and global toast notifications.
- `ProofStore`: Manages the heavy computational overhead of caching zero-knowledge witnesses generated during a session so the user does not need to repeatedly sign identical payloads.

## 3. The Backend REST API Layer
The `/api` folder in the Next.js router acts as an essential security proxy. The frontend never talks directly to the PostgreSQL database or the smart contract nodes.

### 3.1 Endpoints
- `GET /api/assets`: Executes highly optimized Prisma queries. It supports complex filtering algorithms, enabling the frontend to query for `?verifiedOnly=true` or sort by historical price data.
- `POST /api/assets`: Orchestrates the minting lifecycle. It accepts the IPFS CID and the cryptographic signature, dispatches the `registerAsset` circuit to the Midnight node, awaits transaction finality, and subsequently persists the rich metadata object to the PostgreSQL database.
- `POST /api/assets/[id]/transfer`: Executes the `transferOwnership` circuit. If the smart contract reverts the transaction (e.g., due to an invalid ZK proof), the API catches the exception and returns a formatted `400 Bad Request` to the client, preventing the PostgreSQL database from falling out of sync with the ledger.

## 4. The Rust / Axum Storage Node
To prevent the Next.js server from buckling under the heavy memory load of multi-megabyte image and PDF uploads, ZERA offloads all IPFS operations to a dedicated Rust microservice.

### 4.1 Why Rust and Axum?
Rust guarantees memory safety and predictable latency, while Axum provides ergonomic, asynchronous HTTP routing built directly on top of Tokio. This architecture easily handles hundreds of concurrent streaming multipart file uploads without locking the event loop.

### 4.2 Pinata Proxying and Security
The Rust node acts as a secure reverse proxy to the Pinata IPFS network.
1. The client streams the raw file to `POST /upload`.
2. The node buffers the stream, computing a SHA-256 hash on the fly to guarantee file integrity.
3. The node injects the highly sensitive `PINATA_JWT` server-side token into the headers and forwards the stream to Pinata's pinning service.
4. Pinata responds with the CID, which the Rust node relays back to the Next.js API.
5. **Rate Limiting**: The Rust node implements strict token-bucket rate limiting per IP address to prevent denial-of-service (DoS) attacks from saturating the Pinata API limits.

## 5. Design System: Obsidian & Lime
ZERA is designed to look like a premium, Bloomberg-terminal-grade financial application. The design system is aggressively dark, utilizing semantic styling constraints.

### 5.1 Color Semantics
- **Obsidian (`bg-obsidian`)**: The primary void background (`#0B0B0D`). Used to create infinite depth.
- **Surface (`bg-surface`)**: Elevated panels and cards (`#1A1A1E`). Used to delineate content zones.
- **Lime (`text-lime`)**: The singular brand accent (`#CCFF00`). It is highly radioactive and is used strictly for critical calls to action (CTAs), active navigation states, and cryptographic verification checkmarks.

### 5.2 Component Constraints
- **Borders**: Stark, low-opacity strokes (`border-white/10`) define boundaries. Shadows are explicitly discouraged to maintain a flat, technological aesthetic.
- **Typography**: The `Inter` font family is locked globally. Tracking is tightened (`tracking-tight`) to emulate high-density trading dashboards.
- **Glassmorphism**: Backdrop blurs (`backdrop-blur-md bg-obsidian/80`) are exclusively utilized for the sticky top navigation header and overlapping floating action buttons to maintain context while scrolling complex asset lists.
