"use client";

import { Wallet } from "lucide-react";
import { Button } from "./ui/Button";
import { useWallet } from "../hooks/useWallet";
import toast from "react-hot-toast";

export function WalletButton() {
  const { walletAddress, walletBalance, walletError, isWalletAvailable, isConnected, connectWallet, disconnectWallet } = useWallet();

  const handleConnect = async () => {
    try {
      await connectWallet();
      toast.success("Wallet connected successfully");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to connect wallet";
      toast.error(message);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    toast.success("Wallet disconnected");
  };

  const formatAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

  if (isConnected && walletAddress) {
    return (
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-lime/10 border border-lime/30">
          <Wallet className="w-4 h-4 text-lime" />
          <span className="font-mono text-xs text-lime">{formatAddress(walletAddress)}</span>
          <span className="font-mono text-[10px] text-text-muted ml-2">{walletBalance}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDisconnect}
          className="hidden md:inline-flex text-xs hover:bg-red-500/10 hover:text-red-600 border border-transparent hover:border-red-500/20 transition-colors"
        >
          Disconnect
        </Button>
        {walletError ? (
          <span className="hidden md:block max-w-[220px] text-[10px] font-mono text-red-400 truncate">
            {walletError}
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        variant="primary"
        size="sm"
        onClick={handleConnect}
        className="gap-2"
      >
        <Wallet className="w-4 h-4" />
        <span className="hidden sm:inline">Connect Wallet</span>
      </Button>
      {walletError ? (
        <span className="hidden md:block max-w-[240px] text-[10px] font-mono text-red-400 text-right">
          {walletError}
        </span>
      ) : null}
      {!isWalletAvailable ? (
        <span className="hidden md:block max-w-[240px] text-[10px] font-mono text-amber-300 text-right">
          Midnight Lace extension not detected
        </span>
      ) : null}
    </div>
  );
}
