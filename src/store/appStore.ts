import { create } from 'zustand';
import { type Asset } from '../services/assets';
import { type Collection } from '../services/collections';

interface AppState {
  // Wallet state
  walletAddress: string | null;
  walletBalance: string;
  isConnected: boolean;
  
  // Assets state
  uploadedAssets: Asset[];
  ownedAssets: Asset[];
  
  // Collections state
  collections: Collection[];
  
  // Loading states
  isLoadingAssets: boolean;
  isLoadingCollections: boolean;
  isUploading: boolean;
  
  // Actions
  setWalletAddress: (address: string | null) => void;
  setWalletBalance: (balance: string) => void;
  setIsConnected: (connected: boolean) => void;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  
  setUploadedAssets: (assets: Asset[]) => void;
  addUploadedAsset: (asset: Asset) => void;
  setOwnedAssets: (assets: Asset[]) => void;
  
  setCollections: (collections: Collection[]) => void;
  addCollection: (collection: Collection) => void;
  
  setIsLoadingAssets: (loading: boolean) => void;
  setIsLoadingCollections: (loading: boolean) => void;
  setIsUploading: (uploading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  walletAddress: null,
  walletBalance: "0 tDUST",
  isConnected: false,
  uploadedAssets: [],
  ownedAssets: [],
  collections: [],
  isLoadingAssets: false,
  isLoadingCollections: false,
  isUploading: false,
  
  // Wallet actions
  setWalletAddress: (address) => set({ walletAddress: address }),
  setWalletBalance: (walletBalance) => set({ walletBalance }),
  setIsConnected: (connected) => set({ isConnected: connected }),
  
  connectWallet: async () => {
    throw new Error("Use the Midnight Lace connector flow from useWallet() instead of the store stub.");
  },
  
  disconnectWallet: () => {
    set({
      walletAddress: null,
      isConnected: false,
      ownedAssets: [],
    });
    
    // Clear from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('wallet_address');
    }
  },
  
  // Asset actions
  setUploadedAssets: (assets) => set({ uploadedAssets: assets }),
  addUploadedAsset: (asset) => set((state) => ({
    uploadedAssets: [...state.uploadedAssets, asset],
  })),
  setOwnedAssets: (assets) => set({ ownedAssets: assets }),
  
  // Collection actions
  setCollections: (collections) => set({ collections }),
  addCollection: (collection) => set((state) => ({
    collections: [...state.collections, collection],
  })),
  
  // Loading actions
  setIsLoadingAssets: (loading) => set({ isLoadingAssets: loading }),
  setIsLoadingCollections: (loading) => set({ isLoadingCollections: loading }),
  setIsUploading: (uploading) => set({ isUploading: uploading }),
}));
