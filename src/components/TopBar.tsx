"use client";

import { Search, Bell, Menu, Wallet } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/Button";
import { useWallet } from "../hooks/useWallet";
import toast from "react-hot-toast";

export function TopBar() {
  const { walletAddress, isConnected, connectWallet, disconnectWallet } = useWallet();

  const handleConnect = async () => {
    try {
      await connectWallet();
      toast.success('Wallet connected successfully');
    } catch (error) {
      toast.error('Failed to connect wallet');
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    toast.success('Wallet disconnected');
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="sticky top-0 z-30 h-20 bg-obsidian/80 backdrop-blur-xl border-b border-white/5 px-8 flex items-center justify-between lg:justify-end">
      
      {/* Mobile Menu Button */}
      <button className="lg:hidden p-2 -ml-2 text-text-secondary hover:text-text-primary">
        <Menu className="w-6 h-6" />
      </button>

      {/* Global Search (Hidden on Mobile) */}
      <div className="hidden lg:flex flex-1 max-w-xl relative mr-auto ml-8">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-text-muted" />
        </div>
        <input 
          type="text" 
          placeholder="Search items, collections, users..." 
          className="w-full bg-white/5 border border-white/5 rounded-full py-2.5 pl-12 pr-12 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-lime focus:border-lime transition-all font-mono"
        />
        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
           <div className="px-1.5 py-0.5 rounded bg-white/10 text-text-secondary text-[10px] font-mono">⌘K</div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 shrink-0">
        <button className="relative p-2.5 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-text-secondary hover:text-text-primary">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-lime border-2 border-obsidian"></span>
        </button>
        
        {/* Wallet Connection */}
        {isConnected && walletAddress ? (
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-lime/10 border border-lime/30">
              <Wallet className="w-4 h-4 text-lime" />
              <span className="font-mono text-xs text-lime">{formatAddress(walletAddress)}</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleDisconnect}
              className="hidden md:inline-flex text-xs"
            >
              Disconnect
            </Button>
          </div>
        ) : (
          <Button 
            variant="primary" 
            size="sm"
            onClick={handleConnect}
            className="gap-2"
          >
            <Wallet className="w-4 h-4" />
            <span className="hidden sm:inline">Connect Wallet</span>
          </Button>
        )}
        
        <Link href="/mint">
          <Button variant="primary" className="hidden lg:inline-flex h-10 px-6 text-xs rounded-full">
            Start Tokenizing
          </Button>
        </Link>
        <Link href="/explore">
          <Button variant="secondary" className="hidden lg:inline-flex h-10 px-6 text-xs rounded-full bg-white/5 border-white/10">
            Explore
          </Button>
        </Link>

        {/* User Dropdown Trigger */}
        <button className="w-10 h-10 rounded-full bg-gradient-to-br from-lime/20 to-emerald-glow/20 border border-white/10 overflow-hidden ml-2 hover:border-lime/50 transition-colors">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" className="w-full h-full object-cover mix-blend-overlay" alt="User Avatar" />
        </button>
      </div>
    </header>
  );
}
