# Zera Asset Registry - Web Dashboard

The frontend application for the Zera Asset Registry, providing a modern, high-performance interface for managing digital assets with privacy-preserving features powered by the Midnight Network.

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Database Management](#database-management)
- [Troubleshooting](#troubleshooting)

---

## Overview

The Zera Web Dashboard is a comprehensive asset management platform that bridges the gap between traditional web interfaces and privacy-first blockchain technology. It enables users to register, track, and transfer assets while maintaining cryptographic privacy through zero-knowledge proofs.

### Key Features

- 💎 **Asset Management**: Full lifecycle management of digital assets
- 🔐 **Privacy-First**: Integration with Midnight's ZK-circuits for secure ownership verification
- 📁 **IPFS Integration**: Seamless metadata and file storage via the Zera IPFS Service
- 📊 **Real-time Tracking**: Dashboard for monitoring asset activities and proof logs
- 🧪 **Proof Verification**: Built-in tools for generating and verifying cryptographic proofs
- 🎨 **Modern UI**: Responsive design with sleek aesthetics and dark mode support

---

## Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Runtime**: [Bun](https://bun.sh/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [Prisma](https://www.prisma.io/) with PostgreSQL
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Blockchain SDK**: [Midnight JS SDK](https://docs.midnight.network/develop/midnight-js/)
- **API Client**: [Axios](https://axios-http.com/)

---

## Project Structure

```
web/
├── prisma/               # Database schema and migrations
├── public/               # Static assets
│   └── managed/          # Compiled ZK contract artifacts (copied via script)
├── src/
│   ├── app/              # Next.js App Router (pages and API routes)
│   │   ├── api/          # Backend API endpoints
│   │   ├── dashboard/    # User dashboard
│   │   ├── create-asset/ # Asset minting interface
│   │   └── ...           # Other application routes
│   ├── components/       # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and shared logic
│   ├── services/         # Midnight and IPFS API service abstractions
│   ├── store/            # Zustand state stores
│   └── types/            # TypeScript definitions
├── tailwind.config.ts    # Styling configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies and scripts
```

---

## Prerequisites

Before setting up the web dashboard, ensure you have:

- ✅ **Node.js** >= 22.0.0
- ✅ **Bun** package manager
- ✅ **PostgreSQL** database (running locally or via Docker)
- ✅ **Zera Contracts** compiled (see `contracts/README.md`)
- ✅ **Zera IPFS Service** running (see `storage/README.md`)

---

## Installation

### 1. Install Dependencies

```bash
# From the web directory
bun install
```

### 2. Setup Environment Variables

Copy the environment template and configure your variables:

```bash
cp .env.example .env
```

Edit `.env` with your specific configuration:
- `NEXT_PUBLIC_API_URL`: Your local web API URL
- `NEXT_PUBLIC_IPFS_API_URL`: URL of the running IPFS service
- `DATABASE_URL`: Your PostgreSQL connection string

---

## Development

### 1. Copy ZK Configurations

The web app requires the compiled contract artifacts (bindings and keys) to interact with the Midnight network. Run this after every contract change:

```bash
bun run copy-zk-configs
```

### 2. Database Setup

Initialize your database and generate the Prisma client:

```bash
bun run db:setup
```

### 3. Run Development Server

```bash
bun run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

---

## Database Management

We use Prisma for database orchestration. Key commands include:

- **Generate Client**: `bun run prisma:generate`
- **Push Schema**: `bun run prisma:db-push`
- **Studio (GUI)**: `npx prisma studio`

---

## Troubleshooting

### Issue: "Cannot find module '@/managed/zera/contract'"

**Solution**: This happens when the contract artifacts haven't been copied to the web project.
Run `bun run copy-zk-configs` to sync them.

### Issue: Prisma fails to connect to database

**Solution**: 
1. Ensure your PostgreSQL service is running.
2. Check that the `DATABASE_URL` in `.env` is correct.
3. Verify the database exists.

### Issue: Midnight SDK wallet sync issues

**Solution**:
1. Ensure the Midnight node, indexer, and proof server are running.
2. Check browser console for network errors.
3. Clear `midnight-level-db` directory if state becomes corrupted during development.

---

## License

See the main project LICENSE file.
