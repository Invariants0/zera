import { create } from 'zustand';
import { Asset } from '../services/assets';
import { Collection } from '../services/collections';

interface AppState {
  // Wallet state
  walletAddress: string | null;
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
  isConnected: false,
  uploadedAssets: [],
  ownedAssets: [],
  collections: [],
  isLoadingAssets: false,
  isLoadingCollections: false,
  isUploading: false,
  
  // Wallet actions
  setWalletAddress: (address) => set({ walletAddress: address }),
  setIsConnected: (connected) => set({ isConnected: connected }),
  
  connectWallet: async () => {
    // STUB: Simulate wallet connection
    console.log('[WALLET STUB] Connecting wallet...');
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate mock wallet address
    const mockAddress = `0x${Math.random().toString(16).substr(2, 40)}`;
    
    set({
      walletAddress: mockAddress,
      isConnected: true,
    });
    
    // Store in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('wallet_address', mockAddress);
    }
    
    console.log('[WALLET STUB] Connected:', mockAddress);
  },
  
  disconnectWallet: () => {
    console.log('[WALLET STUB] Disconnecting wallet...');
    
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
