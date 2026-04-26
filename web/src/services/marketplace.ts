import apiClient from './api';

export interface MarketplaceStats {
  totalVolume: string;
  totalSales: number;
  activeListings: number;
  uniqueOwners: number;
}

export interface Activity {
  id: string;
  type: 'mint' | 'transfer' | 'sale' | 'list';
  assetId: string;
  assetTitle: string;
  from: string;
  to: string;
  price?: string;
  timestamp: string;
}

export interface RegistryEntry {
  id: string;
  creator: string;
  verification: 'Verified' | 'Pending' | 'Rejected';
  ownership: 'Provable' | 'Private';
  compliance: string;
  updated: string;
}

// Get marketplace statistics
export const getMarketplaceStats = async (): Promise<MarketplaceStats> => {
  try {
    const response = await apiClient.get('/marketplace/stats');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch marketplace stats:', error);
    throw error;
  }
};

// Get recent activity
export const getActivity = async (limit: number = 50): Promise<Activity[]> => {
  const response = await apiClient.get('/marketplace/activity', {
    params: { limit },
  });
  return response.data;
};

// Get registry entries
export const getRegistryEntries = async (): Promise<RegistryEntry[]> => {
  const response = await apiClient.get('/registry');
  return response.data;
};

// Get trending collections
export const getTrendingCollections = async (limit: number = 10): Promise<any[]> => {
  try {
    const response = await apiClient.get('/marketplace/trending', {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch trending collections:', error);
    throw error;
  }
};
