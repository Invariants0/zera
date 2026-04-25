"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Heart, CheckCircle2, ArrowRightLeft, ExternalLink, Shield, Lock } from "lucide-react";
import { useWallet } from "../../../hooks/useWallet";
import { Loading } from "../../../components/ui/Loading";
import { EmptyState } from "../../../components/ui/EmptyState";
import toast from "react-hot-toast";
import Link from "next/link";

type Asset = {
  id: string; title: string; description?: string; creator: string; owner: string;
  price: string; imageUrl: string; metadataUri: string; badges: string[];
  verified: boolean; private: boolean; createdAt: string; updatedAt: string;
};

export default function AssetDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { walletAddress, isConnected } = useWallet();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const [watchlisted, setWatchlisted] = useState(false);

  useEffect(() => {
    fetch(`/api/assets/${id}`)
      .then((r) => r.json())
      .then(setAsset)
      .catch(() => setAsset(null))
      .finally(() => setLoading(false));
  }, [id]);

  const toggleWatchlist = async () => {
    if (!walletAddress) { toast.error('Connect wallet first'); return; }
    if (watchlisted) {
      await fetch(`/api/watchlist?userId=${encodeURIComponent(walletAddress)}&assetId=${id}`, { method: 'DELETE' });
      setWatchlisted(false);
      toast.success('Removed from watchlist');
    } else {
      const res = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: walletAddress, assetId: id }),
      });
      if (res.ok) { setWatchlisted(true); toast.success('Added to watchlist'); }
      else { toast.error('Already in watchlist or error'); }
    }
  };

  const verifyOwnership = async () => {
    if (!walletAddress) { toast.error('Connect wallet first'); return; }
    const tid = toast.loading('Verifying ownership on Midnight...');
    try {
      const res = await fetch('/api/proofs/ownership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assetId: id, owner: walletAddress }),
      });
      const data = await res.json();
      if (data.success && data.data?.verified) {
        toast.success(`Ownership verified! Proof ID: ${data.data.proofId}`, { id: tid });
      } else {
        toast.error('Ownership could not be verified', { id: tid });
      }
    } catch { toast.error('Verification failed', { id: tid }); }
  };

  if (loading) return <div className="p-10"><Loading text="Loading asset..." /></div>;
  if (!asset) return <div className="p-10"><EmptyState icon={Shield} title="Asset Not Found" description="This asset does not exist in the registry." /></div>;

  const isOwner = walletAddress && asset.owner === walletAddress;

  return (
    <div className="w-full max-w-[1200px] mx-auto p-6 md:p-10 pb-32">
      <div className="mb-8">
        <Link href="/explore" className="font-mono text-xs text-text-muted hover:text-lime transition-colors">← Back to Explore</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left — Image */}
        <div>
          <div className="rounded-2xl overflow-hidden border border-white/10 aspect-square relative bg-black">
            <img src={asset.imageUrl} alt={asset.title} className="w-full h-full object-cover" />
            <div className="absolute top-4 left-4 flex gap-2">
              {asset.verified && <Badge variant="verified" showDot className="backdrop-blur-xl bg-black/60 border-white/10 px-2 py-1 text-[10px]">VERIFIED</Badge>}
              {asset.private && <Badge variant="private" showDot className="backdrop-blur-xl bg-black/60 border-white/10 px-2 py-1 text-[10px]">PRIVATE</Badge>}
            </div>
          </div>
        </div>

        {/* Right — Info */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-grotesk font-bold uppercase tracking-tight">{asset.title}</h1>
            {asset.description && <p className="font-mono text-sm text-text-secondary mt-3">{asset.description}</p>}
          </div>

          <Card className="bg-obsidian border-white/10 p-5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-mono text-[10px] text-text-muted uppercase">Asset ID</span>
              <span className="font-mono text-xs text-text-primary">{asset.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-mono text-[10px] text-text-muted uppercase">Creator</span>
              <span className="font-mono text-xs text-lime">{asset.creator.slice(0, 20)}...</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-mono text-[10px] text-text-muted uppercase">Owner</span>
              <span className="font-mono text-xs text-text-primary">{asset.owner.slice(0, 20)}...</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-mono text-[10px] text-text-muted uppercase">Price</span>
              <span className="font-mono text-sm font-bold text-lime">{asset.price}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-mono text-[10px] text-text-muted uppercase">Metadata (IPFS)</span>
              <a href={asset.metadataUri.replace('ipfs://', 'http://localhost:8080/fetch/')}
                target="_blank" rel="noopener noreferrer"
                className="font-mono text-xs text-lime hover:underline flex items-center gap-1">
                View <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-mono text-[10px] text-text-muted uppercase">Created</span>
              <span className="font-mono text-xs text-text-secondary">{new Date(asset.createdAt).toLocaleDateString()}</span>
            </div>
          </Card>

          <div className="flex flex-col gap-3">
            <Button variant="primary" className="h-12 gap-2" onClick={verifyOwnership}>
              <Shield className="w-4 h-4" /> Verify Ownership (ZK Proof)
            </Button>

            {isOwner && (
              <Link href={`/transfers?assetId=${asset.id}`}>
                <Button variant="secondary" className="h-12 gap-2 w-full border-white/10">
                  <ArrowRightLeft className="w-4 h-4" /> Transfer Ownership
                </Button>
              </Link>
            )}

            <Button variant="secondary" className={`h-12 gap-2 border-white/10 ${watchlisted ? 'border-red-500/40 text-red-400' : ''}`} onClick={toggleWatchlist}>
              <Heart className={`w-4 h-4 ${watchlisted ? 'fill-red-500 text-red-500' : ''}`} />
              {watchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
