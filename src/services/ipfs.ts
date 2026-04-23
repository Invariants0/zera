import apiClient from './api';

const IPFS_API_URL = process.env.NEXT_PUBLIC_IPFS_API_URL || 'http://localhost:8080';

export interface UploadResponse {
  cid: string;
  url: string;
  size: number;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

// Upload file to IPFS via backend
export const uploadToIPFS = async (
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post(`${IPFS_API_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress({
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percentage,
          });
        }
      },
    });

    return response.data;
  } catch (error) {
    console.error('Failed to upload to IPFS:', error);
    throw error;
  }
};

// Upload JSON metadata to IPFS
export const uploadMetadataToIPFS = async (metadata: object): Promise<UploadResponse> => {
  try {
    const blob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
    const file = new File([blob], 'metadata.json', { type: 'application/json' });
    
    return await uploadToIPFS(file);
  } catch (error) {
    console.error('Failed to upload metadata to IPFS:', error);
    throw error;
  }
};

// Get file from IPFS
export const getFromIPFS = async (cid: string): Promise<Blob> => {
  try {
    const response = await apiClient.get(`${IPFS_API_URL}/ipfs/${cid}`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch from IPFS:', error);
    throw error;
  }
};

// Validate file before upload
export const validateFile = (file: File): { valid: boolean; error?: string } => {
  const MAX_SIZE = 50 * 1024 * 1024; // 50MB
  const ALLOWED_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/webm',
  ];

  if (file.size > MAX_SIZE) {
    return { valid: false, error: 'File size exceeds 50MB limit' };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'File type not supported' };
  }

  return { valid: true };
};
