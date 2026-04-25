import apiClient from './api';

export interface Asset {
  id: string;
  title: string;
  description?: string;
  creator: string;
  owner: string;
  price: string;
  imageUrl: string;
  metadataUri?: string;
  badges: string[];
  verified: boolean;
  private: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AssetFilters {
  category?: string;
  verified?: boolean;
  private?: boolean;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

// Get all assets with optional filters
export const getAssets = async (filters?: AssetFilters): Promise<Asset[]> => {
  const response = await apiClient.get('/assets', { params: filters });
  return response.data;
};

// Get single asset by ID
export const getAssetById = async (id: string): Promise<Asset> => {
  const response = await apiClient.get(`/assets/${id}`);
  return response.data;
};

// Get assets by owner
export const getAssetsByOwner = async (ownerAddress: string): Promise<Asset[]> => {
  const response = await apiClient.get(`/assets/owner/${ownerAddress}`);
  return response.data;
};

// Verify asset ownership
export const verifyAssetOwnership = async (assetId: string, ownerAddress: string): Promise<{ verified: boolean; proof?: string }> => {
  const response = await apiClient.post('/verify', {
    assetId,
    ownerAddress,
  });
  return response.data;
};
