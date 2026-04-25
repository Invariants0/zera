/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: [
    // Native binary — the direct cause
    'ssh2',
    'ssh-remote-port-forward',

    // testcontainers pulls in ssh2
    'testcontainers',

    // Midnight testkit pulls in testcontainers
    '@midnight-ntwrk/testkit-js',

    // Core Midnight runtime packages — ship WASM + native modules, must not
    // be bundled otherwise WASM instance identity breaks (ZswapSecretKeys error)
    '@midnight-ntwrk/wallet-sdk-facade',
    '@midnight-ntwrk/wallet-sdk-shielded',
    '@midnight-ntwrk/wallet-sdk-dust-wallet',
    '@midnight-ntwrk/wallet-sdk-unshielded-wallet',
    '@midnight-ntwrk/wallet-sdk-address-format',
    '@midnight-ntwrk/ledger-v8',
    '@midnight-ntwrk/compact-runtime',
    '@midnight-ntwrk/compact-js',
    '@midnight-ntwrk/midnight-js-contracts',
    '@midnight-ntwrk/midnight-js-indexer-public-data-provider',
    '@midnight-ntwrk/midnight-js-http-client-proof-provider',
    '@midnight-ntwrk/midnight-js-level-private-state-provider',
    '@midnight-ntwrk/midnight-js-node-zk-config-provider',
    '@midnight-ntwrk/midnight-js-network-id',
    '@midnight-ntwrk/midnight-js-types',
    '@midnight-ntwrk/midnight-js-utils',

    // Logging — pino uses native bindings optionally
    'pino',
    'pino-pretty',

    // LevelDB — used by private state provider
    'level',
    'classic-level',
  ],
};

export default nextConfig;
