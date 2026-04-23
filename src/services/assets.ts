import apiClient from './api';
import { mockAssets, simulateDelay } from '../lib/mockBackend';

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
  try {
    const response = await apiClient.get('/assets', { params: filters });
    return response.data;
  } catch (error) {
    console.warn('API unavailable, using mock data');
    await simulateDelay();
    // Return mock data as fallback
    return mockAssets;
  }
};

// Get single asset by ID
export const getAssetById = async (id: string): Promise<Asset> => {
  try {
    const response = await apiClient.get(`/assets/${id}`);
    return response.data;
  } catch (error) {
    console.warn('API unavailable, using mock data');
    await simulateDelay();
    const asset = mockAssets.find(a => a.id === id);
    if (!asset) throw new Error('Asset not found');
    return asset;
  }
};

// Get assets by owner
export const getAssetsByOwner = async (ownerAddress: string): Promise<Asset[]> => {
  try {
    const response = await apiClient.get(`/assets/owner/${ownerAddress}`);
    return response.data;
  } catch (error) {
    console.warn('API unavailable, using mock data');
    await simulateDelay();
    return mockAssets.filter(a => a.owner === ownerAddress);
  }
};

// Verify asset ownership
export const verifyAssetOwnership = async (assetId: string, ownerAddress: string): Promise<{ verified: boolean; proof?: string }> => {
  try {
    const response = await apiClient.post('/verify', {
      assetId,
      ownerAddress,
    });
    return response.data;
  } catch (error) {
    console.warn('API unavailable, using mock response');
    await simulateDelay();
    return {
      verified: true,
      proof: `proof_${Math.random().toString(36).substr(2, 9)}`,
    };
  }
};
