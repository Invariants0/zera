# Zera Asset Registry - Setup Guide

Complete setup guide for the Zera Asset Registry project on Midnight Network.

## Platform Support

This project supports the following operating systems:
- ✅ **macOS** (Intel & Apple Silicon)
- ✅ **Linux** (Ubuntu 20.04+, Debian, Fedora, Arch)
- ✅ **Windows 10/11** (via WSL 2)

## Table of Contents

- [Platform Support](#platform-support)
- [OS-Specific Quick Start](#os-specific-quick-start)
- [Prerequisites](#prerequisites)
- [Installation Steps](#installation-steps)
- [Environment Configuration](#environment-configuration)
- [Running the Project](#running-the-project)
- [Troubleshooting](#troubleshooting)

---

## OS-Specific Quick Start

### macOS Users

```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install prerequisites
brew install nvm docker
nvm install 22.13.0
curl -fsSL https://bun.sh/install | bash
curl --proto '=https' --tlsv1.2 -LsSf https://github.com/midnightntwrk/compact/releases/latest/download/compact-installer.sh | sh

# Restart terminal, then proceed to Installation Steps
```

### Linux Users (Ubuntu/Debian)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install prerequisites
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 22.13.0

# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker

# Install Bun and Compact
curl -fsSL https://bun.sh/install | bash
curl --proto '=https' --tlsv1.2 -LsSf https://github.com/midnightntwrk/compact/releases/latest/download/compact-installer.sh | sh

# Restart terminal, then proceed to Installation Steps
```

### Windows Users

```powershell
# Run PowerShell as Administrator

# Install WSL 2
wsl --install
# Restart computer after installation

# After restart, open WSL terminal and run:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 22.13.0
curl -fsSL https://bun.sh/install | bash
curl --proto '=https' --tlsv1.2 -LsSf https://github.com/midnightntwrk/compact/releases/latest/download/compact-installer.sh | sh

# Install Docker Desktop for Windows from:
# https://docs.docker.com/desktop/install/windows-install/

# Proceed to Installation Steps in WSL terminal
```

---

## Platform Compatibility Matrix

| Component | macOS | Linux | Windows |
|-----------|-------|-------|---------|
| Node.js 22+ | ✅ Native | ✅ Native | ✅ Native / WSL |
| Bun | ✅ Native | ✅ Native | ✅ Native / WSL |
| Docker | ✅ Docker Desktop | ✅ Docker Engine | ✅ Docker Desktop + WSL 2 |
| Compact Compiler | ✅ Native | ✅ Native | ⚠️ WSL Required |
| Rust/Cargo | ✅ Native | ✅ Native | ✅ Native / WSL |
| PostgreSQL | ✅ Docker | ✅ Docker | ✅ Docker |

**Legend:**
- ✅ Fully supported
- ⚠️ Requires additional setup (WSL)

---

## Prerequisites

Before running this project, ensure you have the following installed:

### 1. Node.js (v22.13.0 or higher)

**Required Version:** >= 22.0.0 (Recommended: 22.13.0)

**Installation:**

**macOS/Linux:**
```bash
# Using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc  # or ~/.zshrc for zsh

# Install and use Node.js 22.13.0
nvm install 22.13.0
nvm use 22.13.0
nvm alias default 22.13.0
```

**Windows:**
```powershell
# Option 1: Using nvm-windows (recommended)
# Download and install from: https://github.com/coreybutler/nvm-windows/releases
# Then in PowerShell or CMD:
nvm install 22.13.0
nvm use 22.13.0

# Option 2: Direct installer
# Download from: https://nodejs.org/en/download/
```

**Verify installation (all platforms):**
```bash
node --version  # Should show v22.13.0 or higher
npm --version
```

### 2. Bun Package Manager

**Required for:** Running scripts and managing dependencies

**Installation:**

**macOS/Linux:**
```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Reload shell configuration
source ~/.bashrc  # or ~/.zshrc for zsh
```

**Windows:**
```powershell
# Install Bun using PowerShell
powershell -c "irm bun.sh/install.ps1 | iex"

# Or install via npm (if Node.js is already installed)
npm install -g bun

# Restart your terminal
```

**Verify installation (all platforms):**
```bash
bun --version
```

### 3. Docker & Docker Compose

**Required for:** Local Midnight network services (indexer, node, proof server) and PostgreSQL database

**Installation:**

- **macOS:** [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/)
- **Linux:** [Docker Engine](https://docs.docker.com/engine/install/) + [Docker Compose](https://docs.docker.com/compose/install/)
- **Windows:** See [Windows-specific setup](#windows-specific-setup) below

**Verify installation:**

```bash
docker --version
docker compose version
```

### 4. WSL (Windows Subsystem for Linux) - Windows Only

**Required for:** Running Compact compiler on Windows

**Installation:**

```bash
# Open PowerShell as Administrator and run:
wsl --install

# Restart your computer
# After restart, set up your Linux username and password

# Verify installation
wsl --version
```

**Configure WSL for the project:**

```bash
# Inside WSL, install required tools
sudo apt update
sudo apt install curl build-essential
```

### 5. Compact Compiler

**What is Compact?**  
Compact is Midnight's dedicated smart contract language for creating DApps with configurable data protection.

**Installation:**

**macOS/Linux:**
```bash
# Install Compact using the official installer
curl --proto '=https' --tlsv1.2 -LsSf https://github.com/midnightntwrk/compact/releases/latest/download/compact-installer.sh | sh
```

**Windows:**
```bash
# Install inside WSL (required for Windows)
# Open WSL terminal first
wsl

# Then run the installer
curl --proto '=https' --tlsv1.2 -LsSf https://github.com/midnightntwrk/compact/releases/latest/download/compact-installer.sh | sh
```

**Update your shell PATH:**

The installer automatically adds Compact to your PATH. Restart your terminal or reload your shell:

**macOS/Linux:**
```bash
# For zsh users
source ~/.zshrc

# For bash users
source ~/.bashrc
```

**Windows (WSL):**
```bash
# Inside WSL terminal
source ~/.bashrc
```

**Manual PATH configuration (if needed):**

If Compact is not found after restarting, manually add it:

```bash
export PATH="$HOME/.compact/bin:$PATH"

# Add to your shell config file to make it permanent
echo 'export PATH="$HOME/.compact/bin:$PATH"' >> ~/.zshrc  # or ~/.bashrc
source ~/.zshrc  # or ~/.bashrc
```

**Update to latest version:**

```bash
compact update
```

**Verify installation:**

```bash
compact --version           # Print Compact version
compact compile --version   # Print compiler version
which compact              # Print installation path (use 'where compact' on Windows CMD)
```

### 6. Rust & Cargo (Optional - for Storage Service)

**Required for:** Running the IPFS storage service locally

**Installation:**

**macOS/Linux:**
```bash
# Install Rust using rustup
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Reload shell configuration
source ~/.cargo/env
```

**Windows:**
```powershell
# Option 1: Install via rustup-init.exe
# Download from: https://rustup.rs/
# Run the installer and follow prompts

# Option 2: Install in WSL (recommended if using WSL)
# Inside WSL terminal:
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env
```

**Verify installation (all platforms):**
```bash
rustc --version
cargo --version
```

### 7. PostgreSQL Client (Optional)

**Required for:** Database management and debugging

**macOS:**
```bash
brew install postgresql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql-client
```

**Windows:**
```powershell
# Option 1: Install via Chocolatey
choco install postgresql

# Option 2: Download installer from
# https://www.postgresql.org/download/windows/

# Option 3: Use in WSL
# Inside WSL:
sudo apt update
sudo apt install postgresql-client
```

**Verify installation (all platforms):**
```bash
psql --version
```

---

## Installation Steps

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd zera
```

### Step 2: Install Dependencies

```bash
# Install all workspace dependencies
bun install
```

This will install dependencies for:
- Root workspace
- `web/` (Next.js frontend)
- `contracts/` (Midnight smart contracts)

### Step 3: Start Docker Services

Start the local Midnight network and PostgreSQL database:

```bash
bun run services:up
```

This starts:
- **Midnight Node** (port 9944)
- **Indexer** (port 8088)
- **Proof Server** (port 6300)
- **PostgreSQL Database** (port 5432)

**Wait for services to be healthy:**

```bash
docker compose ps
```

All services should show "healthy" status.

### Step 4: Compile Smart Contract

Compile the Compact smart contract:

```bash
bun run compact:compile
```

This generates contract artifacts in `contracts/src/managed/zera/`.

**Note for Windows users:** This command uses WSL to run the Compact compiler.

### Step 5: Build Contract Package

Build the TypeScript contract package:

```bash
bun --filter @zera/contracts build
```

### Step 6: Copy ZK Artifacts

Copy zero-knowledge proof configurations to the web app:

```bash
bun run copy-artifacts
```

### Step 7: Setup Database

Initialize the PostgreSQL database schema:

```bash
bun run db:setup
```

This runs:
- Prisma schema generation
- Database migrations

### Step 8: Deploy Contract (Optional)

Deploy to local network:

```bash
bun run deploy
```

Or use the all-in-one setup command:

```bash
bun run project:prepare
```

---

## Environment Configuration

### Contracts Environment Variables

Create `contracts/.env`:

```bash
cp contracts/.env.example contracts/.env
```

Edit `contracts/.env`:

```env
# For local development
MIDNIGHT_NETWORK=local
ZERA_LOCAL_ONLY=local
MIDNIGHT_INDEXER_URL=http://localhost:8088
MIDNIGHT_PROOF_SERVER_URL=http://localhost:6300

# Wallet seed (generated during deployment)
seed=
```

### Web Environment Variables

Create `web/.env.local`:

```bash
cp web/.env.example web/.env.local
```

Edit `web/.env.local`:

```env
# Environment
NODE_ENV=development
ZERA_LOCAL_ONLY=local

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_IPFS_API_URL=http://localhost:8080
IPFS_SERVICE_URL=http://localhost:8080

# Midnight Network
NEXT_PUBLIC_MIDNIGHT_NETWORK_ID=undeployed

# Database (PostgreSQL)
DATABASE_URL=postgresql://postgres:zera@localhost:5432/zera
```

### Storage Service Environment Variables (Optional)

Create `storage/.env`:

```bash
cp storage/.env.example storage/.env
```

Edit `storage/.env`:

```env
# Pinata JWT token for IPFS uploads
PINATA_JWT=your_pinata_jwt_token_here

# Port (default: 10000)
PORT=8080
```

Get a Pinata JWT token from [Pinata Cloud](https://www.pinata.cloud/).

---

## Running the Project

### Option 1: Run Everything Together

```bash
bun run start:all
```

This will:
1. Start Docker services
2. Compile contracts
3. Setup database
4. Deploy contracts
5. Start web app and storage service in parallel

### Option 2: Run Services Individually

**Start Docker services:**

```bash
bun run services:up
```

**Start web application:**

```bash
bun run dev:web
# Access at http://localhost:3000
```

**Start storage service (optional):**

```bash
bun run storage:dev
# Access at http://localhost:8080
```

### Option 3: Run Tests

```bash
# Run contract tests
bun run test
```

---

## Troubleshooting

### Issue: "compact: command not found"

**macOS/Linux:**
```bash
# Reload shell configuration
source ~/.zshrc  # or ~/.bashrc

# Or manually add to PATH
export PATH="$HOME/.compact/bin:$PATH"

# Verify
which compact
```

**Windows:**
```bash
# Inside WSL terminal
source ~/.bashrc
export PATH="$HOME/.compact/bin:$PATH"

# Verify
which compact
```

### Issue: Docker services not starting

**All platforms:**
```bash
# Check Docker is running
docker ps

# View service logs
docker compose logs

# Restart services
bun run services:down
bun run services:up
```

**macOS:**
```bash
# Ensure Docker Desktop is running
open -a Docker

# Check Docker Desktop settings > Resources
# Ensure sufficient memory (at least 4GB) is allocated
```

**Linux:**
```bash
# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Check Docker status
sudo systemctl status docker

# Add user to docker group (if not already)
sudo usermod -aG docker $USER
newgrp docker
```

**Windows:**
```powershell
# Ensure Docker Desktop is running
# Check Docker Desktop settings:
# - WSL 2 backend is enabled
# - WSL integration is enabled for your distro

# In WSL terminal:
docker ps
```

### Issue: "Cannot find module '../contracts/index.js'"

**All platforms:**
```bash
# Compile and build contracts
bun run compact:compile
bun --filter @zera/contracts build
```

### Issue: Port already in use

**macOS/Linux:**
```bash
# Find process using port (e.g., 3000)
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or change port in .env
```

**Windows:**
```powershell
# In PowerShell
netstat -ano | findstr :3000

# Kill the process
taskkill /PID <PID> /F

# Or in WSL
lsof -i :3000
kill -9 <PID>
```

### Issue: WSL not working on Windows

**Solution:**
```powershell
# Run in PowerShell as Administrator

# Update WSL
wsl --update

# Set default WSL version
wsl --set-default-version 2

# List installed distributions
wsl --list --verbose

# Restart WSL
wsl --shutdown
wsl

# If issues persist, reinstall WSL
wsl --unregister Ubuntu
wsl --install
```

### Issue: Database connection failed

**All platforms:**
```bash
# Check PostgreSQL container
docker ps | grep postgres

# Restart database
bun run db:down
bun run db:up

# Verify connection
docker exec -it zera-db psql -U postgres -d zera

# Check logs
docker logs zera-db
```

### Issue: Native module build warnings

**Note:** Warnings about `cpu-features` or other native modules during `bun install` are non-fatal and don't affect functionality.

### Issue: Permission denied errors (Linux)

**Solution:**
```bash
# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Fix file permissions
sudo chown -R $USER:$USER .

# Restart Docker
sudo systemctl restart docker
```

### Issue: Bun not found after installation (Windows)

**Solution:**
```powershell
# Restart PowerShell/Terminal completely

# Or add to PATH manually
$env:Path += ";$env:USERPROFILE\.bun\bin"

# Make permanent via System Environment Variables
# System Properties > Environment Variables > Path
```

### Issue: Compact compilation fails on Windows

**Solution:**
```bash
# Ensure you're running in WSL, not PowerShell/CMD
wsl

# Verify Compact is installed in WSL
which compact

# If not found, install in WSL:
curl --proto '=https' --tlsv1.2 -LsSf https://github.com/midnightntwrk/compact/releases/latest/download/compact-installer.sh | sh
source ~/.bashrc
```

### Issue: Docker Desktop not starting (macOS)

**Solution:**
```bash
# Reset Docker Desktop
# Docker Desktop > Troubleshoot > Reset to factory defaults

# Or reinstall Docker Desktop
brew uninstall --cask docker
brew install --cask docker
```

### Issue: Out of memory errors

**Solution:**

**macOS/Windows (Docker Desktop):**
- Open Docker Desktop Settings
- Go to Resources > Advanced
- Increase Memory to at least 4GB (8GB recommended)
- Increase Swap to at least 2GB
- Click "Apply & Restart"

**Linux:**
```bash
# Check available memory
free -h

# If low, close other applications or increase system RAM
```

### Issue: Network timeout during installation

**Solution:**
```bash
# Use a different npm/bun registry
npm config set registry https://registry.npmjs.org/

# Or use a mirror (China users)
npm config set registry https://registry.npmmirror.com/

# Retry installation
bun install
```

---

## macOS-Specific Notes

### Apple Silicon (M1/M2/M3) Considerations

**Docker Performance:**
- Docker Desktop for Apple Silicon is fully supported
- Some images may need Rosetta 2 for x86 compatibility
- Install Rosetta if prompted: `softwareupdate --install-rosetta`

**Homebrew Installation:**
```bash
# Homebrew installs to different locations:
# Intel Macs: /usr/local/bin
# Apple Silicon: /opt/homebrew/bin

# Ensure Homebrew is in PATH (usually automatic)
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

**Node.js Native Modules:**
- Most packages work natively on Apple Silicon
- If you encounter issues, try using Rosetta:
```bash
arch -x86_64 bun install
```

### macOS Permissions

**Docker Desktop:**
- Grant necessary permissions when prompted
- System Settings > Privacy & Security > Full Disk Access
- Add Docker Desktop if needed

**Terminal Access:**
- Grant terminal full disk access if you encounter permission errors
- System Settings > Privacy & Security > Full Disk Access

### Recommended Tools for macOS

```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Useful tools
brew install git
brew install --cask visual-studio-code
brew install --cask docker
brew install postgresql  # Optional, for psql client
```

---

## Linux-Specific Notes

### Distribution-Specific Commands

**Ubuntu/Debian:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install -y curl git build-essential

# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker
```

**Fedora:**
```bash
# Update system
sudo dnf update -y

# Install dependencies
sudo dnf install -y curl git gcc make

# Install Docker
sudo dnf install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
newgrp docker
```

**Arch Linux:**
```bash
# Update system
sudo pacman -Syu

# Install dependencies
sudo pacman -S curl git base-devel

# Install Docker
sudo pacman -S docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
newgrp docker
```

### Docker Permissions

After installing Docker, you need to add your user to the docker group:

```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Apply group changes without logout
newgrp docker

# Verify
docker ps
```

If you still get permission errors:

```bash
# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Check Docker status
sudo systemctl status docker
```

### Firewall Configuration

If you have firewall issues:

```bash
# Ubuntu/Debian (UFW)
sudo ufw allow 3000/tcp  # Web app
sudo ufw allow 8080/tcp  # Storage service
sudo ufw allow 5432/tcp  # PostgreSQL (if exposing)

# Fedora/RHEL (firewalld)
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --permanent --add-port=8080/tcp
sudo firewall-cmd --reload
```

### SELinux Considerations (Fedora/RHEL/CentOS)

If you encounter SELinux issues:

```bash
# Check SELinux status
getenforce

# Temporarily set to permissive (for testing)
sudo setenforce 0

# Or configure SELinux policies for Docker
sudo setsebool -P container_manage_cgroup on
```

---

## Windows-Specific Setup

### Prerequisites for Windows

**System Requirements:**
- Windows 10 version 2004+ (Build 19041+) or Windows 11
- Virtualization enabled in BIOS
- At least 8GB RAM (16GB recommended)
- At least 20GB free disk space

### Step-by-Step Windows Setup

#### 1. Install WSL 2

```powershell
# Open PowerShell as Administrator (Right-click > Run as Administrator)

# Install WSL with Ubuntu (default)
wsl --install

# Or install specific distribution
wsl --install -d Ubuntu-22.04

# Restart your computer when prompted
```

After restart, Ubuntu will open automatically. Create a username and password.

#### 2. Verify WSL Installation

```powershell
# Check WSL version
wsl --version

# List installed distributions
wsl --list --verbose

# Ensure version is 2
# If not, convert:
wsl --set-version Ubuntu 2
wsl --set-default-version 2
```

#### 3. Install Docker Desktop

1. Download [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
2. Run the installer
3. During installation, ensure "Use WSL 2 instead of Hyper-V" is selected
4. Restart computer if prompted

**Configure Docker Desktop:**
1. Open Docker Desktop
2. Go to Settings > General
3. Enable "Use the WSL 2 based engine"
4. Go to Settings > Resources > WSL Integration
5. Enable integration with your Ubuntu distribution
6. Click "Apply & Restart"

#### 4. Install Tools in WSL

Open WSL terminal (search "Ubuntu" in Start menu):

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install build essentials
sudo apt install -y curl build-essential git

# Install Node.js via nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 22.13.0
nvm use 22.13.0
nvm alias default 22.13.0

# Verify Node.js
node --version
npm --version

# Install Bun
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc

# Verify Bun
bun --version

# Install Compact compiler
curl --proto '=https' --tlsv1.2 -LsSf https://github.com/midnightntwrk/compact/releases/latest/download/compact-installer.sh | sh
source ~/.bashrc

# Verify Compact
compact --version

# Optional: Install Rust for storage service
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env
```

### Accessing Windows Files from WSL

Your Windows drives are mounted in WSL:

```bash
# Navigate to Windows C: drive
cd /mnt/c/

# Navigate to your project (example)
cd /mnt/c/Users/YourUsername/Projects/zera

# Or clone directly in WSL home (recommended for better performance)
cd ~
git clone <repository-url>
cd zera
```

**Performance Tip:** For better performance, keep your project files in the WSL filesystem (`~/projects/`) rather than Windows filesystem (`/mnt/c/`).

### Running on Windows

**Recommended Approach: Full WSL Workflow**

```bash
# Open WSL terminal (Ubuntu from Start menu)
cd ~/zera  # or /mnt/c/path/to/zera

# Run all commands in WSL
bun install
bun run start:all
```

**Alternative: Hybrid Approach**

You can run most commands from Windows PowerShell/CMD, but Compact compilation will automatically use WSL:

```powershell
# In Windows PowerShell/CMD
cd C:\path\to\zera

# These work from Windows
bun install
bun run services:up
bun run dev:web

# This automatically uses WSL (configured in package.json)
bun run compact:compile
```

### Windows-Specific Tips

1. **Use Windows Terminal** (recommended):
   - Install from Microsoft Store
   - Better performance and features than CMD
   - Supports multiple tabs and WSL integration

2. **VS Code Integration**:
   ```bash
   # Install VS Code in Windows
   # Then in WSL terminal:
   code .
   # This opens VS Code with WSL integration
   ```

3. **File Permissions**:
   - If you get permission errors, ensure files are owned by your WSL user:
   ```bash
   sudo chown -R $USER:$USER ~/zera
   ```

4. **Network Access**:
   - WSL services are accessible from Windows via `localhost`
   - Web app at `http://localhost:3000` works from Windows browser

5. **Docker Access**:
   - Docker commands work in both WSL and Windows PowerShell
   - Docker Desktop manages containers for both environments

### Troubleshooting Windows-Specific Issues

**Issue: WSL installation fails**
```powershell
# Enable required Windows features
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# Restart computer
# Then install WSL kernel update from:
# https://aka.ms/wsl2kernel
```

**Issue: Docker Desktop won't start**
- Ensure Hyper-V or WSL 2 is enabled in Windows Features
- Check BIOS virtualization is enabled (VT-x/AMD-V)
- Try "Reset to factory defaults" in Docker Desktop Troubleshoot menu

**Issue: Slow performance in WSL**
- Keep project files in WSL filesystem (`~/`) not Windows (`/mnt/c/`)
- Disable Windows Defender real-time scanning for WSL directories
- Allocate more resources in Docker Desktop settings

**Issue: "Cannot connect to Docker daemon"**
```bash
# In WSL, ensure Docker Desktop is running in Windows
# Check Docker Desktop > Settings > Resources > WSL Integration
# Enable integration for your distribution
```

---

## Quick Start Checklist

### Prerequisites Checklist

**All Platforms:**
- [ ] Node.js >= 22.0.0 installed and verified (`node --version`)
- [ ] Bun installed and verified (`bun --version`)
- [ ] Docker & Docker Compose installed and running (`docker --version`)
- [ ] Git installed (`git --version`)

**Windows Only:**
- [ ] WSL 2 installed and configured (`wsl --version`)
- [ ] Docker Desktop with WSL 2 backend enabled
- [ ] Ubuntu or preferred Linux distribution installed in WSL

**macOS Only:**
- [ ] Docker Desktop installed and running
- [ ] Xcode Command Line Tools installed (`xcode-select --install`)

**Linux Only:**
- [ ] Docker service running (`sudo systemctl status docker`)
- [ ] User added to docker group (`groups | grep docker`)

**Compact Compiler (All Platforms):**
- [ ] Compact installed (`compact --version`)
- [ ] Compact in PATH (`which compact` or `where compact`)
- [ ] Compiler version verified (`compact compile --version`)

**Optional (for Storage Service):**
- [ ] Rust & Cargo installed (`cargo --version`)
- [ ] Pinata account created and JWT token obtained

### Installation Checklist

- [ ] Repository cloned (`git clone <url>`)
- [ ] Navigate to project directory (`cd zera`)
- [ ] Dependencies installed (`bun install`)
- [ ] Docker services started (`bun run services:up`)
- [ ] Services are healthy (`docker compose ps`)
- [ ] Contract compiled (`bun run compact:compile`)
- [ ] Contract built (`bun --filter @zera/contracts build`)
- [ ] ZK artifacts copied (`bun run copy-artifacts`)
- [ ] Database setup completed (`bun run db:setup`)
- [ ] Environment files created (`.env`, `.env.local`)

### Verification Checklist

**Docker Services:**
```bash
docker compose ps
# All services should show "healthy" or "running"
```

**Expected Services:**
- [ ] midnight-node (port 9944)
- [ ] indexer (port 8088)
- [ ] proof-server (port 6300)
- [ ] zera-db (port 5432)

**Contract Artifacts:**
- [ ] `contracts/src/managed/zera/` directory exists
- [ ] `contracts/dist/` directory exists
- [ ] `web/public/managed/` directory exists

**Environment Variables:**
- [ ] `contracts/.env` configured
- [ ] `web/.env.local` configured
- [ ] `storage/.env` configured (if using storage service)

### Ready to Launch

Once all checkboxes are complete:

```bash
# Start everything
bun run start:all

# Or start individually
bun run dev:web          # Web app at http://localhost:3000
bun run storage:dev      # Storage at http://localhost:8080
```

**Access Points:**
- 🌐 Web Application: http://localhost:3000
- 📦 Storage API: http://localhost:8080
- 🔗 Midnight Node: ws://localhost:9944
- 📊 Indexer: http://localhost:8088
- 🔐 Proof Server: http://localhost:6300
- 🗄️ PostgreSQL: postgresql://postgres:zera@localhost:5432/zera

---

## Platform-Specific Command Reference

### File Operations

| Operation | macOS/Linux | Windows (PowerShell) | Windows (WSL) |
|-----------|-------------|---------------------|---------------|
| List files | `ls -la` | `Get-ChildItem` or `dir` | `ls -la` |
| Copy file | `cp src dest` | `Copy-Item src dest` | `cp src dest` |
| Remove file | `rm file` | `Remove-Item file` | `rm file` |
| Find text | `grep "text" file` | `Select-String "text" file` | `grep "text" file` |
| View file | `cat file` | `Get-Content file` | `cat file` |

### Process Management

| Operation | macOS/Linux | Windows (PowerShell) | Windows (WSL) |
|-----------|-------------|---------------------|---------------|
| Find port | `lsof -i :3000` | `netstat -ano \| findstr :3000` | `lsof -i :3000` |
| Kill process | `kill -9 PID` | `taskkill /PID PID /F` | `kill -9 PID` |
| List processes | `ps aux` | `Get-Process` | `ps aux` |

### Environment Variables

| Operation | macOS/Linux | Windows (PowerShell) | Windows (WSL) |
|-----------|-------------|---------------------|---------------|
| Set variable | `export VAR=value` | `$env:VAR="value"` | `export VAR=value` |
| View variable | `echo $VAR` | `echo $env:VAR` | `echo $VAR` |
| List all | `printenv` | `Get-ChildItem Env:` | `printenv` |

---

## Quick Start Checklist

- [ ] Node.js >= 22.0.0 installed
- [ ] Bun installed
- [ ] Docker & Docker Compose installed
- [ ] WSL installed (Windows only)
- [ ] Compact compiler installed and in PATH
- [ ] Rust & Cargo installed (optional, for storage service)
- [ ] Repository cloned
- [ ] Dependencies installed (`bun install`)
- [ ] Docker services started (`bun run services:up`)
- [ ] Contract compiled (`bun run compact:compile`)
- [ ] Database setup (`bun run db:setup`)
- [ ] Environment variables configured

**Ready to go!** Run `bun run start:all` to start the full application.

---

## Common Workflows

### Development Workflow

```bash
# 1. Start services
bun run services:up

# 2. Make changes to contract
# Edit contracts/src/main.compact

# 3. Recompile and rebuild
bun run compact:compile
bun --filter @zera/contracts build
bun run copy-artifacts

# 4. Restart web app
bun run dev:web
```

### Testing Workflow

```bash
# Run all tests
bun run test

# Run specific test file
bun --filter @zera/contracts test hw.test.ts

# Run with verbose output
bun --filter @zera/contracts test --reporter=verbose
```

### Deployment Workflow

```bash
# Deploy to local network
bun run deploy

# Deploy to preprod (configure .env first)
cd contracts
MIDNIGHT_NETWORK=preprod bun run deploy
```

### Clean and Rebuild

```bash
# Clean all build artifacts
bun run clean

# Full rebuild
bun run clean
bun install
bun run project:prepare
```

### Database Management

```bash
# Reset database
bun run db:down
bun run db:up
bun run db:setup

# Access database directly
docker exec -it zera-db psql -U postgres -d zera

# Backup database
docker exec zera-db pg_dump -U postgres zera > backup.sql

# Restore database
docker exec -i zera-db psql -U postgres zera < backup.sql
```

---

## Additional Resources

- [Midnight Network Documentation](https://docs.midnight.network/)
- [Compact Language Guide](https://docs.midnight.network/develop/compact/)
- [Docker Documentation](https://docs.docker.com/)
- [Bun Documentation](https://bun.sh/docs)
- [Next.js Documentation](https://nextjs.org/docs)

---

## Support

For issues and questions:
- Check the [Troubleshooting](#troubleshooting) section
- Review project README.md
- Check Docker service logs: `docker compose logs`
- Verify all prerequisites are correctly installed
