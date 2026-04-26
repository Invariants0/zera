"use client";

import { useState, useEffect } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import {
  User, Shield, Bell, Eye, Settings as SettingsIcon,
  Wallet, Network, Database, Key, Copy, CheckCircle2,
  AlertTriangle, RefreshCw, LogOut, Terminal
} from "lucide-react";
import { useWallet } from "../../hooks/useWallet";
import toast from "react-hot-toast";

export default function Settings() {
  const { walletAddress, walletBalance: balance } = useWallet();
  const [activeTab, setActiveTab] = useState("profile");
  const [isCopied, setIsCopied] = useState(false);

  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setIsCopied(true);
      toast.success("Address copied to clipboard");
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "wallet", label: "Wallet & Identity", icon: Wallet },
    { id: "protocol", label: "Protocol Config", icon: SettingsIcon },
    { id: "security", label: "Security & ZK", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Eye },
    { id: "advanced", label: "Advanced / Debug", icon: Terminal },
  ];

  return (
    <div className="w-full max-w-[1400px] mx-auto p-6 md:p-10 pb-32">

      <div className="mb-12">
        <h1 className="text-4xl font-grotesk font-bold uppercase tracking-tight text-white">
          System <span className="text-lime">Settings</span>
        </h1>
        <p className="font-mono text-sm text-text-secondary mt-2 uppercase tracking-wider">
          Manage your sovereign identity and protocol parameters
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">

        {/* Settings Sidebar */}
        <div className="w-full lg:w-72 shrink-0 flex flex-col gap-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-mono text-xs uppercase tracking-widest transition-all ${activeTab === tab.id
                    ? 'bg-white/10 text-lime font-bold shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] border border-white/5'
                    : 'text-text-secondary hover:text-white hover:bg-white/5'
                  }`}
              >
                <Icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-lime' : 'text-text-muted'}`} />
                {tab.label}
              </button>
            );
          })}

          <div className="mt-8 pt-8 border-t border-white/5">
            <button className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-mono text-xs uppercase tracking-widest text-red-400 hover:bg-red-500/5 transition-all">
              <LogOut className="w-4 h-4" /> Disconnect
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">

          {activeTab === "profile" && (
            <Card className="bg-obsidian border-white/10 p-8 md:p-10">
              <h2 className="text-2xl font-grotesk font-bold mb-8 flex items-center gap-3">
                <User className="w-6 h-6 text-lime" /> Profile Details
              </h2>

              <div className="space-y-10">
                <div className="flex flex-col sm:flex-row items-center gap-8 pb-10 border-b border-white/5">
                  <div className="w-32 h-32 rounded-3xl bg-black border-2 border-white/10 overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" alt="Profile" />
                  </div>
                  <div className="text-center sm:text-left">
                    <Button variant="secondary" className="h-11 px-6 text-xs font-mono bg-white/5 border-white/10 hover:border-lime/30 mb-3 uppercase tracking-widest">Change Avatar</Button>
                    <p className="text-[10px] text-text-muted font-mono uppercase tracking-tighter">Recommended: 800x800px JPG or PNG</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="block font-mono text-[10px] uppercase text-text-muted tracking-widest ml-1">Display Name</label>
                    <Input defaultValue="Institutional Vault" className="h-12 bg-black/40 border-white/10 rounded-xl font-mono" />
                  </div>
                  <div className="space-y-2">
                    <label className="block font-mono text-[10px] uppercase text-text-muted tracking-widest ml-1">Email Address</label>
                    <Input defaultValue="admin@vault.institution" type="email" className="h-12 bg-black/40 border-white/10 rounded-xl font-mono" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="block font-mono text-[10px] uppercase text-text-muted tracking-widest ml-1">Identity Bio</label>
                    <textarea rows={4} defaultValue="Verified institutional custody solution specializing in high-value digital artifacts..." className="w-full rounded-2xl bg-black/40 border border-white/10 p-5 text-sm font-mono text-text-primary focus:outline-none focus:border-lime/50 resize-none transition-all"></textarea>
                  </div>
                </div>

                <div className="pt-6 flex justify-end">
                  <Button variant="primary" className="h-12 px-10 rounded-xl font-mono uppercase text-xs tracking-widest font-bold">Update Profile</Button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === "wallet" && (
            <div className="space-y-6">
              <Card className="bg-obsidian border-white/10 p-8">
                <h2 className="text-2xl font-grotesk font-bold mb-8 flex items-center gap-3">
                  <Wallet className="w-6 h-6 text-lime" /> Wallet & Identity
                </h2>

                <div className="space-y-8">
                  <div className="p-6 bg-black/40 border border-white/5 rounded-2xl">
                    <div className="flex justify-between items-start mb-4">
                      <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">Midnight Address (Bech32)</span>
                      <Badge variant="verified" showDot>Connected</Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <code className="flex-1 font-mono text-sm text-lime break-all bg-lime/5 p-4 rounded-xl border border-lime/10">
                        {walletAddress || "Not Connected"}
                      </code>
                      <button
                        onClick={copyAddress}
                        className="p-4 rounded-xl bg-white/5 border border-white/10 text-text-secondary hover:text-white hover:bg-white/10 transition-all"
                      >
                        {isCopied ? <CheckCircle2 className="w-5 h-5 text-lime" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-black/40 border border-white/5 rounded-2xl">
                      <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest block mb-2">Available Balance</span>
                      <div className="flex items-end gap-2">
                        <span className="text-3xl font-grotesk font-bold text-white">{balance || "0.00"}</span>
                        <span className="text-lime font-mono text-sm mb-1 uppercase">ZERA</span>
                      </div>
                    </div>
                    <div className="p-6 bg-black/40 border border-white/5 rounded-2xl">
                      <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest block mb-2">Network Status</span>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-lime animate-pulse shadow-[0_0_10px_rgba(204,255,0,0.5)]"></div>
                        <span className="text-xl font-grotesk font-bold text-white uppercase tracking-tight">Midnight Devnet</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-obsidian border-white/10 p-8">
                <h2 className="text-xl font-grotesk font-bold mb-6">Linked Sovereign Identities</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Asset Creator Key', status: 'Active', color: 'lime' },
                    { label: 'Ownership Secret Key', status: 'Active', color: 'lime' },
                    { label: 'Privacy Viewer Key', status: 'Inactive', color: 'muted' },
                  ].map((key, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <Key className="w-4 h-4 text-text-muted" />
                        <span className="font-mono text-sm">{key.label}</span>
                      </div>
                      <Badge variant={key.status === 'Active' ? 'verified' : 'default'} className="text-[10px]">
                        {key.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === "protocol" && (
            <Card className="bg-obsidian border-white/10 p-8">
              <h2 className="text-2xl font-grotesk font-bold mb-8 flex items-center gap-3">
                <SettingsIcon className="w-6 h-6 text-lime" /> Protocol Configuration
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block font-mono text-[10px] uppercase text-text-muted tracking-widest">Contract Address</label>
                    <div className="p-4 bg-black/40 border border-white/5 rounded-xl font-mono text-[11px] text-text-secondary truncate">
                      de049680c9a2bd74c46e76632bef66869a6278eae250cd033e657748fda484e7
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block font-mono text-[10px] uppercase text-text-muted tracking-widest">Private State ID</label>
                    <div className="p-4 bg-black/40 border border-white/5 rounded-xl font-mono text-[11px] text-text-secondary">
                      ZeraPrivateState
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex gap-5">
                  <div className="shrink-0 p-3 bg-amber-500/10 rounded-xl h-fit">
                    <AlertTriangle className="w-6 h-6 text-amber-500" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-grotesk font-bold text-amber-500">Infrastructure Sync Notice</h4>
                    <p className="text-sm text-text-secondary font-mono leading-relaxed">
                      Your client is currently using a hosted Midnight Node and Indexer. Local proof generation is performed in-browser via the Midnight Proof Server.
                    </p>
                    <button className="text-xs font-bold text-amber-500 uppercase tracking-widest flex items-center gap-2 mt-2 hover:underline">
                      <RefreshCw className="w-3 h-3" /> Re-sync Contract State
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === "advanced" && (
            <Card className="bg-obsidian border-white/10 p-8 border-red-500/20">
              <h2 className="text-2xl font-grotesk font-bold mb-8 flex items-center gap-3">
                <Terminal className="w-6 h-6 text-red-400" /> Advanced Operations
              </h2>

              <div className="space-y-6">
                <div className="p-6 border border-white/5 rounded-2xl flex items-center justify-between">
                  <div>
                    <h4 className="font-grotesk font-bold text-white mb-1">Local Database Index</h4>
                    <p className="text-xs text-text-muted font-mono uppercase tracking-widest">Total Cached Assets: 1 | Size: 124KB</p>
                  </div>
                  <Button variant="secondary" className="h-10 border-white/10 text-[10px] uppercase font-mono">
                    Clear Cache
                  </Button>
                </div>

                <div className="p-6 border border-red-500/10 bg-red-500/5 rounded-2xl">
                  <h4 className="font-grotesk font-bold text-red-400 mb-2">Danger Zone</h4>
                  <p className="text-sm text-text-secondary font-mono mb-6">
                    Resetting the protocol state will wipe all local ownership proofs and cached registry data. This action cannot be undone.
                  </p>
                  <Button variant="secondary" className="w-full h-12 border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all font-mono uppercase text-xs tracking-widest">
                    Full Protocol Reset
                  </Button>
                </div>
              </div>
            </Card>
          )}

        </div>

      </div>
    </div>
  );
}
