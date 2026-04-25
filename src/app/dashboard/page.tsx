"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardTitle } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import {
  TrendingUp, Wallet, ShieldCheck, Clock,
  ArrowUpRight, Activity, Plus, FileKey, RefreshCw, ArrowRightLeft,
} from "lucide-react";
import { useWallet } from "../../hooks/useWallet";
import Link from "next/link";

type DashboardData = {
  totalAssets: number;
  verifiedAssets: number;
  pendingAssets: number;
  activeListings: number;
  portfolioValue: string;
  ownedCount: number;
  recentActivity: {
    id: string; type: string; asset: string; from: string; to: string;
    price?: string; txHash?: string; time: string;
  }[];
};

const activityIcon: Record<string, typeof TrendingUp> = {
  LIST: TrendingUp, MINT: Plus, SALE: Wallet, TRANSFER: ArrowRightLeft,
};

export default function Dashboard() {
  const { walletAddress } = useWallet();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const url = walletAddress
        ? `/api/dashboard?owner=${encodeURIComponent(walletAddress)}`
        : '/api/dashboard';
      const res = await fetch(url);
      setData(await res.json());
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [walletAddress]);

  return (
    <div className="w-full max-w-[1400px] mx-auto p-6 md:p-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-grotesk font-bold uppercase tracking-tight text-text-primary">
            Dashboard
          </h1>
          <p className="font-mono text-sm text-text-secondary mt-1">Manage your verified assets and proofs.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="gap-2 h-10 px-4 text-xs" onClick={fetchData}>
            <RefreshCw className="w-4 h-4" /> Refresh
          </Button>
          <Link href="/proof-logs">
            <Button variant="secondary" className="gap-2 h-10 px-4 text-xs">
              <FileKey className="w-4 h-4" /> PROOF_LOGS
            </Button>
          </Link>
          <Link href="/create-asset">
            <Button variant="primary" className="gap-2 h-10 px-4 text-xs rounded-full">
              <Plus className="w-4 h-4" /> MINT_ASSET
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        <Card className="bg-obsidian border-white/5 p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-text-secondary text-[10px] tracking-widest uppercase">Portfolio_Value</span>
            <div className="p-1.5 bg-white/5 rounded-md border border-white/5">
              <Wallet className="w-3.5 h-3.5 text-lime" />
            </div>
          </div>
          <p className="text-2xl font-grotesk font-bold">{loading ? '—' : (data?.portfolioValue ?? '0.00 ZERA')}</p>
          <div className="flex items-center gap-1.5 mt-3 text-emerald-glow text-xs font-mono">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Sum of owned asset values</span>
          </div>
        </Card>

        <Card className="bg-obsidian border-white/5 p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-text-secondary text-[10px] tracking-widest uppercase">Assets_Owned</span>
            <div className="p-1.5 bg-white/5 rounded-md border border-white/5">
              <ShieldCheck className="w-3.5 h-3.5 text-lime" />
            </div>
          </div>
          <p className="text-2xl font-grotesk font-bold">{loading ? '—' : (data?.ownedCount ?? 0)}</p>
          <div className="flex items-center gap-2 mt-3 text-text-secondary text-xs font-mono">
            <span className="text-lime">{loading ? '—' : data?.verifiedAssets} Verified</span>
            <span>· {loading ? '—' : data?.pendingAssets} Pending</span>
          </div>
        </Card>

        <Card className="bg-obsidian border-white/5 p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-text-secondary text-[10px] tracking-widest uppercase">Active_Listings</span>
            <div className="p-1.5 bg-white/5 rounded-md border border-white/5">
              <Clock className="w-3.5 h-3.5 text-lime" />
            </div>
          </div>
          <p className="text-2xl font-grotesk font-bold">{loading ? '—' : (data?.activeListings ?? 0)}</p>
          <div className="flex items-center gap-2 mt-3 text-text-secondary text-xs font-mono">
            <span>Live on marketplace</span>
          </div>
        </Card>

        <Card className="bg-lime border-lime !text-black flex flex-col justify-between group cursor-pointer relative overflow-hidden p-5">
          <div className="flex justify-between items-start z-10">
            <Badge className="bg-black/10 text-black border-black/20 px-2 py-0.5 text-[10px]" showDot>TOTAL_ON_CHAIN</Badge>
            <Activity className="w-4 h-4 text-black" />
          </div>
          <div className="z-10 mt-4">
            <p className="text-3xl font-grotesk font-bold text-black">{loading ? '—' : data?.totalAssets ?? 0}</p>
            <p className="font-mono text-[10px] uppercase mt-1 text-black/70">Total Assets Registered</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Links */}
        <Card className="lg:col-span-2 bg-obsidian border-white/5 p-6">
          <h3 className="text-lg font-bold uppercase font-grotesk mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Explore Assets', href: '/explore', desc: 'Browse the full marketplace' },
              { label: 'My Assets', href: '/my-assets', desc: 'View your digital collection' },
              { label: 'Proof Logs', href: '/proof-logs', desc: 'Audit your ZK proof history' },
              { label: 'Transfer History', href: '/transfers', desc: 'All on-chain transfers' },
              { label: 'Verified Registry', href: '/registry', desc: 'Public verified asset list' },
              { label: 'Watchlist', href: '/watchlist', desc: 'Assets you are tracking' },
            ].map(({ label, href, desc }) => (
              <Link key={href} href={href}>
                <div className="p-4 rounded-xl border border-white/5 bg-black hover:border-lime/30 hover:bg-white/5 transition-all group cursor-pointer">
                  <p className="font-grotesk font-bold text-sm group-hover:text-lime transition-colors">{label}</p>
                  <p className="font-mono text-[10px] text-text-muted mt-1">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-obsidian border-white/5 p-6 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold uppercase font-grotesk">Recent Activity</h3>
            <Link href="/transfers">
              <Button variant="ghost" size="sm" className="font-mono text-[10px]">VIEW_ALL</Button>
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2 no-scrollbar">
            {loading ? (
              <p className="font-mono text-[10px] text-text-muted">Loading...</p>
            ) : !data?.recentActivity?.length ? (
              <p className="font-mono text-[10px] text-text-muted">No activity yet. Create your first asset!</p>
            ) : (
              data.recentActivity.map((activity) => {
                const Icon = activityIcon[activity.type] ?? Activity;
                return (
                  <div key={activity.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="w-8 h-8 rounded-md bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
                      <Icon className="w-3.5 h-3.5 text-text-secondary group-hover:text-lime transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-[10px] text-text-secondary uppercase">{activity.type}</p>
                      <p className="font-grotesk font-semibold text-sm truncate">{activity.asset}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-mono text-xs text-lime">{activity.price ?? '—'}</p>
                      <p className="font-mono text-[9px] text-text-muted">
                        {new Date(activity.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
