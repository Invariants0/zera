# Zera IPFS Storage Service

High-performance Rust-based IPFS storage API for the Zera Asset Registry. Provides seamless integration with Pinata for uploading, fetching, and verifying IPFS content with automatic retry logic and multiple gateway fallbacks.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Service](#running-the-service)
- [API Documentation](#api-documentation)
- [Docker Deployment](#docker-deployment)
- [Development](#development)
- [Troubleshooting](#troubleshooting)

---

## Overview

The Zera IPFS Storage Service is a lightweight, production-ready REST API that handles all IPFS operations for the Zera platform. Built with Rust for maximum performance and reliability, it provides:

- **File Upload**: Upload files to IPFS via Pinata with automatic pinning
- **Content Retrieval**: Fetch files from IPFS with multi-gateway fallback
- **CID Verification**: Verify content availability across IPFS gateways
- **Health Monitoring**: Built-in health checks for service monitoring

### Why Rust?

- ⚡ **Performance**: Blazing fast file processing and network operations
- 🛡️ **Safety**: Memory-safe with zero-cost abstractions
- 🔄 **Concurrency**: Async/await with Tokio for handling multiple requests
- 📦 **Small Footprint**: Minimal resource usage and fast startup times

---

## Features

### Core Functionality

- ✅ **Multipart File Upload**: Upload files via HTTP multipart form data
- ✅ **Private/Public Files**: Support for both private and public IPFS uploads
- ✅ **Automatic Retry**: Built-in retry logic for failed operations
- ✅ **Multi-Gateway Fallback**: Tries multiple IPFS gateways for reliability
- ✅ **CID Validation**: Validates IPFS CID format before operations
- ✅ **CORS Enabled**: Cross-origin requests supported for web integration
- ✅ **Health Checks**: Endpoint for monitoring service status

### Technical Features

- 🚀 **Async/Await**: Non-blocking I/O with Tokio runtime
- 🔒 **Type Safety**: Strongly-typed API with Serde serialization
- ⏱️ **Configurable Timeouts**: Request timeout configuration
- 📊 **Structured Logging**: JSON responses with detailed error messages
- 🐳 **Docker Ready**: Optimized multi-stage Docker builds
- 🔧 **Environment Config**: Flexible configuration via environment variables

---

## Architecture

### Technology Stack

- **Framework**: [Axum](https://github.com/tokio-rs/axum) - Ergonomic web framework
- **Runtime**: [Tokio](https://tokio.rs/) - Async runtime for Rust
- **HTTP Client**: [Reqwest](https://github.com/seanmonstar/reqwest) - HTTP client with retry support
- **Serialization**: [Serde](https://serde.rs/) - JSON serialization/deserialization
- **CORS**: [Tower-HTTP](https://github.com/tower-rs/tower-http) - CORS middleware

### Project Structure

```
storage/
├── src/
│   ├── main.rs          # Application entry point & routing
│   ├── handlers.rs      # HTTP request handlers
│   ├── ipfs.rs          # IPFS client with retry logic
│   └── models.rs        # Data models & API responses
├── Cargo.toml           # Rust dependencies
├── Cargo.lock           # Dependency lock file
├── Dockerfile           # Multi-stage Docker build
├── docker-compose.yml   # Docker Compose configuration
├── .env.example         # Environment variables template
└── README.md            # This file
```

### IPFS Gateways

The service uses multiple IPFS gateways for redundancy:

1. **Primary**: `https://{cid}.ipfs.w3s.link` (Web3.Storage)
2. **Fallback**: `https://ipfs.io/ipfs/{cid}` (IPFS.io)
3. **Private**: `https://gateway.pinata.cloud/ipfs/{cid}` (Pinata - requires auth)

---

## Prerequisites

### Required

- ✅ **Rust** >= 1.75.0 (with Cargo)
- ✅ **Pinata Account** (free tier available)
- ✅ **Pinata JWT Token** (API key)

### Optional

- 🐳 **Docker** (for containerized deployment)
- 🐳 **Docker Compose** (for orchestration)

### Installation Guides

**Install Rust:**

```bash
# macOS/Linux
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

# Windows
# Download from: https://rustup.rs/
```

**Verify Installation:**

```bash
rustc --version
cargo --version
```

**Get Pinata JWT Token:**

1. Sign up at [Pinata Cloud](https://www.pinata.cloud/)
2. Navigate to API Keys section
3. Create a new API key with pinning permissions
4. Copy the JWT token

---

## Installation

### 1. Navigate to Storage Directory

```bash
cd storage
```

### 2. Install Dependencies

```bash
# Download and compile dependencies
cargo build --release
```

This will:
- Download all Rust dependencies
- Compile the project in release mode (optimized)
- Generate binary at `target/release/zera-ipfs`

### 3. Setup Environment

```bash
# Copy environment template
cp .env.example .env

# Edit with your Pinata JWT
nano .env  # or vim, code, etc.
```

---

## Configuration

### Environment Variables

Create a `.env` file in the `storage/` directory:

```env
# Required: Pinata API JWT Token
PINATA_JWT=your_jwt_token_here

# Optional: Server Configuration
PORT=8080                    # Default: 8080
HOST=0.0.0.0                # Default: 0.0.0.0 (all interfaces)

# Optional: Logging
RUST_LOG=info               # Options: error, warn, info, debug, trace
```

### Configuration Options

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PINATA_JWT` | ✅ Yes | - | Pinata API JWT token for authentication |
| `PORT` | ❌ No | `8080` | Port number for the HTTP server |
| `HOST` | ❌ No | `0.0.0.0` | Host address to bind to |
| `RUST_LOG` | ❌ No | `info` | Logging level |

---

## Running the Service

### Development Mode

```bash
# Run with cargo (includes compilation)
cargo run

# Or run with release optimizations
cargo run --release
```

### Production Mode

```bash
# Build optimized binary
cargo build --release

# Run the binary directly
./target/release/zera-ipfs
```

### Expected Output

```
🚀 ZERA IPFS API Server
📡 Listening on: http://0.0.0.0:8080
🔗 Endpoints:
   GET  /health
   POST /upload
   GET  /fetch/:cid
   GET  /verify/:cid
```

### Verify Service is Running

```bash
# Check health endpoint
curl http://localhost:8080/health

# Expected response:
# {"status":"healthy","version":"2.0.0"}
```

---

## API Documentation

### Base URL

```
http://localhost:8080
```

### Endpoints

#### 1. Health Check

**GET** `/health`

Check if the service is running and healthy.

**Response:**

```json
{
  "status": "healthy",
  "version": "2.0.0"
}
```

**Example:**

```bash
curl http://localhost:8080/health
```

---

#### 2. Upload File

**POST** `/upload`

Upload a file to IPFS via Pinata.

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `private` | boolean | No | `false` | Whether to mark file as private |

**Request:**

- **Content-Type**: `multipart/form-data`
- **Body**: File in form field (any field name)

**Response:**

```json
{
  "success": true,
  "cid": "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
  "gateway": "https://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi.ipfs.w3s.link",
  "is_private": false
}
```

**Error Response:**

```json
{
  "success": false,
  "error": "No file provided"
}
```

**Examples:**

```bash
# Upload public file
curl -X POST http://localhost:8080/upload \
  -F "file=@image.png"

# Upload private file
curl -X POST http://localhost:8080/upload?private=true \
  -F "file=@document.pdf"

# Using JavaScript/Fetch
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('http://localhost:8080/upload', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log('CID:', result.cid);
```

---

#### 3. Fetch File

**GET** `/fetch/:cid`

Download a file from IPFS and save it locally.

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `cid` | string | Yes | IPFS Content Identifier |

**Response:**

```json
{
  "success": true,
  "path": "downloads/bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi"
}
```

**Error Response:**

```json
{
  "success": false,
  "error": "All gateways failed. Last error: Gateway timeout"
}
```

**Examples:**

```bash
# Fetch file by CID
curl http://localhost:8080/fetch/bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi

# File will be saved to: downloads/{cid}
```

**Notes:**
- Files are saved to `downloads/` directory
- Directory is created automatically if it doesn't exist
- Tries multiple gateways with automatic fallback

---

#### 4. Verify CID

**GET** `/verify/:cid`

Check if a CID is reachable on IPFS gateways.

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `cid` | string | Yes | IPFS Content Identifier |

**Response:**

```json
{
  "success": true,
  "reachable": true
}
```

**Error Response:**

```json
{
  "success": false,
  "error": "Invalid CID format: invalid_cid"
}
```

**Examples:**

```bash
# Verify CID exists
curl http://localhost:8080/verify/bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi

# Using JavaScript
const response = await fetch(
  `http://localhost:8080/verify/${cid}`
);
const result = await response.json();
console.log('Reachable:', result.reachable);
```

---

## Docker Deployment

### Build Docker Image

```bash
# Build image
docker build -t zera-ipfs:latest .

# Or using docker-compose
docker-compose build
```

### Run with Docker

```bash
# Run container
docker run -d \
  --name zera-ipfs \
  -p 8080:8080 \
  -e PINATA_JWT=your_jwt_token_here \
  zera-ipfs:latest

# Check logs
docker logs zera-ipfs

# Stop container
docker stop zera-ipfs
```

### Run with Docker Compose

```bash
# Start service
docker-compose up -d

# View logs
docker-compose logs -f

# Stop service
docker-compose down
```

**docker-compose.yml:**

```yaml
version: '3.8'

services:
  zera-ipfs:
    build: .
    ports:
      - "8080:8080"
    environment:
      - PINATA_JWT=${PINATA_JWT}
      - PORT=8080
      - RUST_LOG=info
    volumes:
      - ./downloads:/app/downloads
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 3s
      retries: 3
```

### Docker Image Details

- **Base Image**: `rust:1.75-slim` (builder), `debian:bookworm-slim` (runtime)
- **Size**: ~50MB (optimized multi-stage build)
- **Exposed Port**: 8080
- **Health Check**: Built-in health endpoint monitoring

---

## Development

### Project Commands

```bash
# Build (debug mode)
cargo build

# Build (release mode - optimized)
cargo build --release

# Run (debug mode)
cargo run

# Run (release mode)
cargo run --release

# Run tests
cargo test

# Check code without building
cargo check

# Format code
cargo fmt

# Lint code
cargo clippy

# Clean build artifacts
cargo clean
```

### Code Structure

**main.rs** - Application entry point
```rust
// Defines routes and starts the server
Router::new()
    .route("/health", get(handlers::health))
    .route("/upload", post(handlers::upload))
    .route("/fetch/:cid", get(handlers::fetch))
    .route("/verify/:cid", get(handlers::verify))
```

**handlers.rs** - HTTP request handlers
```rust
// Handles incoming HTTP requests
pub async fn upload(multipart: Multipart) -> (StatusCode, Json<UploadOutput>)
pub async fn fetch(Path(cid): Path<String>) -> (StatusCode, Json<FetchOutput>)
pub async fn verify(Path(cid): Path<String>) -> (StatusCode, Json<VerifyOutput>)
```

**ipfs.rs** - IPFS client implementation
```rust
// Core IPFS operations with retry logic
impl IpfsClient {
    pub async fn upload_bytes_with_retry(...) -> Result<String, String>
    pub async fn fetch_file_with_retry(...) -> Result<PathBuf, String>
    pub async fn verify_cid(...) -> Result<bool, String>
}
```

**models.rs** - Data structures
```rust
// API request/response models
pub struct UploadOutput { ... }
pub struct FetchOutput { ... }
pub struct VerifyOutput { ... }
```

### Adding New Features

1. **Add new endpoint**: Update `main.rs` routing
2. **Create handler**: Add function in `handlers.rs`
3. **Add model**: Define structs in `models.rs`
4. **Implement logic**: Add methods in `ipfs.rs`

---

## Troubleshooting

### Issue: "PINATA_JWT not found in environment"

**Solution:**

```bash
# Ensure .env file exists
ls -la .env

# Check .env content
cat .env

# Verify PINATA_JWT is set
echo $PINATA_JWT

# If missing, create .env
cp .env.example .env
# Edit and add your JWT token
```

### Issue: "Failed to bind to address"

**Solution:**

```bash
# Port already in use - find process
lsof -i :8080  # macOS/Linux
netstat -ano | findstr :8080  # Windows

# Kill process or change port
export PORT=8081
cargo run
```

### Issue: "Upload failed with status 401"

**Solution:**

```bash
# Invalid or expired Pinata JWT token
# 1. Check token is correct in .env
# 2. Generate new token at: https://app.pinata.cloud/keys
# 3. Update .env with new token
# 4. Restart service
```

### Issue: "All gateways failed"

**Solution:**

```bash
# Network connectivity issue or invalid CID
# 1. Check internet connection
# 2. Verify CID format (starts with 'bafy' or 'Qm')
# 3. Try verifying CID first: /verify/:cid
# 4. Check if content exists on IPFS
```

### Issue: Compilation errors

**Solution:**

```bash
# Update Rust toolchain
rustup update

# Clean and rebuild
cargo clean
cargo build --release

# Check Rust version
rustc --version  # Should be >= 1.75.0
```

### Issue: Docker build fails

**Solution:**

```bash
# Ensure Docker is running
docker ps

# Clean Docker cache
docker system prune -a

# Rebuild image
docker build --no-cache -t zera-ipfs:latest .
```

### Issue: High memory usage

**Solution:**

```bash
# Reduce concurrent requests
# Or increase system resources

# Monitor memory
docker stats zera-ipfs

# Restart service
docker restart zera-ipfs
```

---

## Performance Optimization

### Release Build

Always use release builds for production:

```bash
cargo build --release
```

**Optimizations in Cargo.toml:**

```toml
[profile.release]
opt-level = 3        # Maximum optimization
lto = true          # Link-time optimization
codegen-units = 1   # Better optimization
strip = true        # Strip debug symbols
```

### Benchmarks

Typical performance on modern hardware:

- **Upload**: ~100-500ms (depends on file size and network)
- **Fetch**: ~200-800ms (depends on gateway response)
- **Verify**: ~50-200ms (HEAD request only)
- **Health**: <1ms (instant response)

---

## Integration Examples

### JavaScript/TypeScript

```typescript
// Upload file
async function uploadToIPFS(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('http://localhost:8080/upload', {
    method: 'POST',
    body: formData
  });
  
  const result = await response.json();
  return result.cid;
}

// Verify CID
async function verifyCID(cid: string): Promise<boolean> {
  const response = await fetch(`http://localhost:8080/verify/${cid}`);
  const result = await response.json();
  return result.reachable;
}
```

### Python

```python
import requests

# Upload file
def upload_to_ipfs(file_path):
    with open(file_path, 'rb') as f:
        files = {'file': f}
        response = requests.post('http://localhost:8080/upload', files=files)
        return response.json()['cid']

# Verify CID
def verify_cid(cid):
    response = requests.get(f'http://localhost:8080/verify/{cid}')
    return response.json()['reachable']
```

### cURL

```bash
# Upload
curl -X POST http://localhost:8080/upload -F "file=@image.png"

# Fetch
curl http://localhost:8080/fetch/bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi

# Verify
curl http://localhost:8080/verify/bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi
```

---

## Additional Resources

- [Rust Documentation](https://doc.rust-lang.org/)
- [Axum Framework](https://docs.rs/axum/)
- [Tokio Runtime](https://tokio.rs/)
- [Pinata Documentation](https://docs.pinata.cloud/)
- [IPFS Documentation](https://docs.ipfs.tech/)

---

## License

See the main project LICENSE file.

---

## Support

For issues and questions:
- Check the [main SETUP.md](../docs/SETUP.md)
- Review Pinata API documentation
- Verify environment variables are set correctly
- Check service logs for detailed error messages