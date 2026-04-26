import apiClient from './api';

export interface Collection {
  id: string;
  name: string;
  description: string;
  creator: string;
  avatar: string;
  banner: string;
  verified: boolean;
  floor: string;
  volume: string;
  change: string;
  itemCount: number;
  createdAt: string;
}

export interface CreateCollectionData {
  name: string;
  description: string;
  avatar: File;
  banner: File;
  category?: string;
}

// Get all collections
export const getCollections = async (): Promise<Collection[]> => {
  try {
    const response = await apiClient.get('/collections');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch collections:', error);
    throw error;
  }
};

// Get single collection by ID
export const getCollectionById = async (id: string): Promise<Collection> => {
  try {
    const response = await apiClient.get(`/collections/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch collection ${id}:`, error);
    throw error;
  }
};

// Create new collection
export const createCollection = async (data: CreateCollectionData): Promise<Collection> => {
  try {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('avatar', data.avatar);
    formData.append('banner', data.banner);
    if (data.category) formData.append('category', data.category);

    const response = await apiClient.post('/collections', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to create collection:', error);
    throw error;
  }
};

// Get collection assets
export const getCollectionAssets = async (collectionId: string): Promise<any[]> => {
  try {
    const response = await apiClient.get(`/collections/${collectionId}/assets`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch collection assets:', error);
    throw error;
  }
};
