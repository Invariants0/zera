import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';

export type NetworkConfig = {
  networkId: string;
  indexer: string;
  indexerWS: string;
  node: string;
  nodeWS: string;
  proofServer: string;
  faucet: string;
};

export const LOCAL_CONFIG: NetworkConfig = {
  networkId: 'undeployed',
  indexer: 'http://127.0.0.1:8088/api/v4/graphql',
  indexerWS: 'ws://127.0.0.1:8088/api/v4/graphql/ws',
  node: 'http://127.0.0.1:9944',
  nodeWS: 'ws://127.0.0.1:9944',
  proofServer: 'http://127.0.0.1:6300',
  faucet: '',
};

export const PREPROD_CONFIG: NetworkConfig = {
  networkId: 'preprod',
  indexer: 'https://indexer.preprod.midnight.network/api/v4/graphql',
  indexerWS: 'wss://indexer.preprod.midnight.network/api/v4/graphql/ws',
  node: 'https://rpc.preprod.midnight.network',
  nodeWS: 'wss://rpc.preprod.midnight.network',
  proofServer: 'https://lace-proof-pub.preprod.midnight.network',
  faucet: '',
};

export function getConfig(): NetworkConfig {
  let network = process.env['MIDNIGHT_NETWORK'];

  // Check if we should force local mode
  const localOnly = process.env['ZERA_LOCAL_ONLY']?.replace(/['"]/g, '').trim();
  if (localOnly === 'true' || localOnly === 'local') {
    network = 'local';
  }

  // Final fallback
  network = network?.replace(/['"]/g, '').trim() ?? 'local';

  if (network === 'local') {
    setNetworkId('undeployed');
    return LOCAL_CONFIG;
  } else if (network === 'preprod') {
    setNetworkId('preprod');
    return PREPROD_CONFIG;
  } else {
    throw new Error(
      `Unknown network: ${network}. Supported networks: 'local', 'preprod'.`,
    );
  }
}
