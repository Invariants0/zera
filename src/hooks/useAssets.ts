import { useState, useEffect } from 'react';
import { getAssets, getAssetById, getAssetsByOwner, Asset, AssetFilters } from '../services/assets';
import { useAppStore } from '../store/appStore';

export const useAssets = (filters?: AssetFilters) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAssets(filters);
        setAssets(data);
      } catch (err) {
        setError('Failed to load assets');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, [JSON.stringify(filters)]);

  return { assets, loading, error };
};

export const useAsset = (id: string) => {
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAssetById(id);
        setAsset(data);
      } catch (err) {
        setError('Failed to load asset');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAsset();
    }
  }, [id]);

  return { asset, loading, error };
};

export const useOwnerAssets = () => {
  const walletAddress = useAppStore((state) => state.walletAddress);
  const ownedAssets = useAppStore((state) => state.ownedAssets);
  const setOwnedAssets = useAppStore((state) => state.setOwnedAssets);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOwnerAssets = async () => {
    if (!walletAddress) {
      setError('No wallet connected');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getAssetsByOwner(walletAddress);
      setOwnedAssets(data);
    } catch (err) {
      setError('Failed to load owned assets');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      fetchOwnerAssets();
    }
  }, [walletAddress]);

  return { ownedAssets, loading, error, refetch: fetchOwnerAssets };
};
