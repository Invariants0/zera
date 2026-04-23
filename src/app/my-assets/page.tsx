"use client";

import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Package, Plus } from "lucide-react";
import { useOwnerAssets } from "../../hooks/useAssets";
import { useWallet } from "../../hooks/useWallet";
import { Loading, CardSkeleton } from "../../components/ui/Loading";
import { EmptyState } from "../../components/ui/EmptyState";
import Link from "next/link";

export default function MyAssets() {
  const { isConnected, connectWallet } = useWallet();
  const { ownedAssets, loading, error } = useOwnerAssets();

  if (!isConnected) {
    return (
      <div className="w-full max-w-[1600px] mx-auto p-6 md:p-10 pb-32">
        <EmptyState
          icon={Package}
          title="Connect Your Wallet"
          description="Please connect your wallet to view your assets"
          actionLabel="Connect Wallet"
          onAction={connectWallet}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1600px] mx-auto p-6 md:p-10 pb-32">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-grotesk font-bold uppercase tracking-tight mb-2">
            My Assets
          </h1>
          <p className="font-mono text-sm text-text-secondary">
            Digital assets you own and control
          </p>
        </div>
        <Link href="/mint">
          <Button variant="primary" className="gap-2">
            <Plus className="w-4 h-4" />
            Mint New Asset
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <EmptyState
          icon={Package}
          title="Failed to Load Assets"
          description={error}
        />
      ) : ownedAssets.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No Assets Yet"
          description="Start by minting your first digital asset"
          actionLabel="Mint Asset"
          onAction={() => window.location.href = '/mint'}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {ownedAssets.map((asset) => (
            <Link href={`/assets/${asset.id}`} key={asset.id} className="block group">
              <Card className="p-0 overflow-hidden bg-obsidian border-white/5 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(204,255,0,0.1)] hover:border-lime/30 transition-all duration-300">
                <div className="h-64 relative bg-black">
                  <img src={asset.imageUrl} alt={asset.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="absolute top-4 left-4 flex gap-2">
                    {asset.verified && (
                      <Badge variant="verified" showDot className="backdrop-blur-xl bg-black/60 border-white/10 px-2 py-0.5 text-[9px]">
                        VERIFIED
                      </Badge>
                    )}
                    {asset.private && (
                      <Badge variant="private" showDot className="backdrop-blur-xl bg-black/60 border-white/10 px-2 py-0.5 text-[9px]">
                        PRIVATE
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-grotesk font-bold text-lg leading-tight group-hover:text-lime transition-colors truncate mb-4">
                    {asset.title}
                  </h3>
                  
                  <div className="flex items-center justify-between font-mono">
                    <div>
                      <p className="text-[10px] text-text-muted uppercase tracking-widest mb-1">Current Value</p>
                      <p className="text-sm font-bold text-lime">{asset.price}</p>
                    </div>
                    <Button variant="secondary" size="sm" className="text-xs">
                      Manage
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
