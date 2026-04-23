import { useEffect } from 'react';
import { useAppStore } from '../store/appStore';

/**
 * WALLET HOOK (STUBBED)
 * 
 * This hook provides wallet connection functionality.
 * Currently stubbed - no actual wallet integration.
 * 
 * When ready to integrate:
 * - Replace with Midnight Network wallet SDK
 * - Add proper signature handling
 * - Implement transaction signing
 */

export const useWallet = () => {
  const walletAddress = useAppStore((state) => state.walletAddress);
  const isConnected = useAppStore((state) => state.isConnected);
  const connectWallet = useAppStore((state) => state.connectWallet);
  const disconnectWallet = useAppStore((state) => state.disconnectWallet);

  // Auto-connect if wallet was previously connected
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAddress = localStorage.getItem('wallet_address');
      if (savedAddress && !isConnected) {
        useAppStore.getState().setWalletAddress(savedAddress);
        useAppStore.getState().setIsConnected(true);
      }
    }
  }, []);

  return {
    walletAddress,
    isConnected,
    connectWallet,
    disconnectWallet,
  };
};
