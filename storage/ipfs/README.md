# ZERA IPFS API

Small Rust service for uploading, fetching, and verifying IPFS content through Pinata-backed gateways.

## What it does

- `GET /health` returns service status
- `POST /upload` uploads a file from multipart form data
- `GET /fetch/:cid` downloads a CID to `downloads/`
- `GET /verify/:cid` checks whether a CID is reachable

## Setup

Create a `.env` file in this folder with:

```env
PINATA_JWT=your_jwt_token_here
```

The service listens on `PORT`, defaulting to `10000`.

## Run

```bash
cargo build --release
cargo run --release
```

## Docker

This folder also includes a `Dockerfile` and `docker-compose.yml` if you want to run it in a container.