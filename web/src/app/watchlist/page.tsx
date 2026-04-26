"use client";

import { useEffect, useState } from "react";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Search, Heart, LayoutGrid, List, Filter } from "lucide-react";
import { useWallet } from "../../hooks/useWallet";
import { EmptyState } from "../../components/ui/EmptyState";
import { Loading } from "../../components/ui/Loading";
import Link from "next/link";
import toast from "react-hot-toast";

type WatchlistAsset = {
  watchlistId: string; id: string; title: string; imageUrl: string;
  price: string; verified: boolean; isPrivate: boolean; badges: string[];
};

export default function Watchlist() {
  const { walletAddress, isConnected, connectWallet } = useWallet();
  const [assets, setAssets] = useState<WatchlistAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchWatchlist = async () => {
    if (!walletAddress) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/watchlist?userId=${encodeURIComponent(walletAddress)}`);
      setAssets(await res.json());
    } catch { setAssets([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchWatchlist(); }, [walletAddress]);

  const removeFromWatchlist = async (assetId: string) => {
    if (!walletAddress) return;
    try {
      await fetch(`/api/watchlist?userId=${encodeURIComponent(walletAddress)}&assetId=${assetId}`, { method: 'DELETE' });
      setAssets((prev) => prev.filter((a) => a.id !== assetId));
      toast.success('Removed from watchlist');
    } catch { toast.error('Failed to remove'); }
  };

  if (!isConnected) {
    return (
      <div className="w-full max-w-[1600px] mx-auto p-6 md:p-10 pb-32">
        <EmptyState icon={Heart} title="Connect Your Wallet" description="Connect your wallet to view your watchlist"
          actionLabel="Connect Wallet" onAction={connectWallet} />
      </div>
    );
  }

  const filtered = assets.filter((a) =>
    (a.title ?? '').toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="w-full max-w-[1600px] mx-auto p-6 md:p-10 pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-grotesk font-bold uppercase tracking-tight text-text-primary">Watchlist</h1>
          <p className="font-mono text-sm text-text-secondary mt-2">Track your favorite digital assets and collections.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <Input placeholder="Search watchlist..." className="pl-10 h-10 bg-obsidian border-white/5"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Link href="/explore">
          <Button variant="secondary" className="gap-2 text-xs font-mono">
            Browse & Add Assets
          </Button>
        </Link>
      </div>

      {loading ? <Loading text="Loading watchlist..." /> :
        filtered.length === 0 ? (
          <EmptyState icon={Heart} title="Your Watchlist is Empty"
            description="Go to Explore and click the heart icon to add assets to your watchlist."
            actionLabel="Explore Assets" onAction={() => window.location.href = '/explore'} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {filtered.map((asset) => (
              <div key={asset.id} className="block group relative">
                <Card className="p-0 overflow-hidden bg-obsidian border-white/5 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(204,255,0,0.1)] hover:border-lime/30 transition-all duration-300">
                  <div className="h-48 relative bg-black">
                    <img src={asset.imageUrl} alt={asset.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      {asset.verified && <Badge variant="verified" showDot className="backdrop-blur-xl bg-black/60 border-white/10 px-2 py-0.5 text-[9px]">VERIFIED</Badge>}
                    </div>
                    <button
                      className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-red-500 hover:bg-white/20 transition-colors"
                      onClick={() => removeFromWatchlist(asset.id)}
                    >
                      <Heart className="w-4 h-4 fill-red-500" />
                    </button>
                  </div>
                  <Link href={`/assets/${asset.id}`}>
                    <div className="p-5">
                      <h3 className="font-grotesk font-bold text-lg leading-tight group-hover:text-lime transition-colors truncate">{asset.title}</h3>
                      <div className="mt-4 pt-4 border-t border-white/5 flex items-end justify-between font-mono">
                        <div>
                          <p className="text-[10px] text-text-muted uppercase tracking-widest mb-1">Price</p>
                          <p className="text-sm font-bold text-lime">{asset.price ?? '—'}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </Card>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
