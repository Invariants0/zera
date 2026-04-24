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
  proofServer: 'http://localhost:6300', // Local proof server via Docker
  faucet: 'https://faucet.preprod.midnight.network',
};

export function getConfig(): NetworkConfig {
  const network = process.env['MIDNIGHT_NETWORK'] ?? 'local';
  const config = network === 'local' ? LOCAL_CONFIG : 
                 network === 'preprod' ? PREPROD_CONFIG :
                 (() => { throw new Error(`Unknown network: ${network}. Supported networks: 'local', 'preprod'.`); })();
  
  // Set network ID after determining config
  setNetworkId(config.networkId);
  
  return config;
}
