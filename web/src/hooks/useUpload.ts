import { useState } from 'react';
import { uploadToIPFS, uploadMetadataToIPFS, validateFile } from '../services/ipfs';
import type { UploadProgress } from '../services/ipfs';
import { useAppStore } from '../store/appStore';

export const useUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const setIsUploading = useAppStore((state) => state.setIsUploading);

  const uploadFile = async (file: File) => {
    // Validate file first
    const validation = validateFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return null;
    }

    try {
      setUploading(true);
      setIsUploading(true);
      setError(null);
      setProgress(null);

      const result = await uploadToIPFS(file, (prog) => {
        setProgress(prog);
      });

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      console.error('Upload error:', err);
      return null;
    } finally {
      setUploading(false);
      setIsUploading(false);
      setProgress(null);
    }
  };

  const uploadMetadata = async (metadata: object) => {
    try {
      setUploading(true);
      setIsUploading(true);
      setError(null);

      const result = await uploadMetadataToIPFS(metadata);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Metadata upload failed';
      setError(errorMessage);
      console.error('Metadata upload error:', err);
      return null;
    } finally {
      setUploading(false);
      setIsUploading(false);
    }
  };

  return {
    uploadFile,
    uploadMetadata,
    uploading,
    progress,
    error,
  };
};
