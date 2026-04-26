"use client";

import { useEffect, useState, Suspense } from "react";
import type React from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Search, Filter, ChevronDown, CheckCircle2, Heart, Package, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAssets } from "../../hooks/useAssets";
import { useWallet } from "../../hooks/useWallet";
import { Loading, CardSkeleton } from "../../components/ui/Loading";
import { EmptyState } from "../../components/ui/EmptyState";
import Link from "next/link";

const categories = ["All", "Art", "Music", "Gaming", "Memberships", "IP Licenses"];

export default function Explore() {
  return (
    <Suspense fallback={<Loading />}>
      <ExploreContent />
    </Suspense>
  );
}

function ExploreContent() {
  const router = useRouter();
  const { walletAddress } = useWallet();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") ?? "");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [privateOnly, setPrivateOnly] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  useEffect(() => {
    setSearchQuery(searchParams.get("search") ?? "");
  }, [searchParams]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const { assets, loading, error } = useAssets({
    category: selectedCategory !== "All" ? selectedCategory.toLowerCase() : undefined,
    verified: verifiedOnly ? true : undefined,
    private: privateOnly ? true : undefined,
    search: searchQuery || undefined,
  });

  const filteredAssets = assets.filter(asset => {
    if (searchQuery) {
      const match = asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   asset.creator.toLowerCase().includes(searchQuery.toLowerCase());
      if (!match) return false;
    }
    
    if (priceRange.min) {
      const price = parseFloat(asset.price.replace(/[^\d.]/g, ''));
      if (price < parseFloat(priceRange.min)) return false;
    }
    if (priceRange.max) {
      const price = parseFloat(asset.price.replace(/[^\d.]/g, ''));
      if (price > parseFloat(priceRange.max)) return false;
    }

    return true;
  });

  return (
    <div className="w-full flex flex-col min-h-screen">
      
      {/* Premium Header Area */}
      <div className="px-6 md:px-10 py-10 border-b border-white/5 sticky top-0 z-20 bg-obsidian/80 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-8">
            <div className="space-y-1">
              <h1 className="text-4xl md:text-5xl font-grotesk font-bold uppercase tracking-tight text-white">
                Explore <span className="text-lime">Assets</span>
              </h1>
              <p className="font-mono text-xs text-text-muted uppercase tracking-widest">
                Discover sovereign digital artifacts secured by Midnight
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative w-full md:w-80 group">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-lime transition-colors" />
                <Input
                  placeholder="Search by name or creator..."
                  className="pl-12 h-12 bg-black/40 border-white/10 rounded-2xl focus:border-lime/50 transition-all text-sm font-mono"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              <Button 
                variant="secondary" 
                className="h-12 px-6 shrink-0 gap-2 border-white/10 hover:border-lime/50 hover:bg-lime/5 group transition-all"
                onClick={async (e) => {
                  const btn = e.currentTarget;
                  btn.disabled = true;
                  const tid = toast.loading("Synchronizing registry with Midnight...");
                  try {
                    const res = await fetch('/api/contract/sync', { 
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ walletAddress })
                    });
                    const data = await res.json();
                    if (data.success) {
                      toast.success(data.message, { id: tid });
                      router.refresh();
                    } else {
                      toast.error(data.message, { id: tid });
                    }
                  } catch (err) {
                    toast.error("Sync failed", { id: tid });
                  } finally {
                    btn.disabled = false;
                  }
                }}
              >
                <RefreshCw className="w-4 h-4 text-lime group-hover:rotate-180 transition-transform duration-500" />
                <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-widest font-bold">Sync Registry</span>
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-xl font-mono text-[10px] font-bold uppercase tracking-widest transition-all border ${
                  selectedCategory === cat 
                    ? 'bg-lime text-obsidain border-lime shadow-[0_0_20px_rgba(204,255,0,0.2)]' 
                    : 'bg-white/5 text-text-secondary border-white/5 hover:border-white/20 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-1 max-w-[1600px] mx-auto w-full">
        
        {/* Refined Sidebar Filters */}
        <div className="hidden lg:block w-80 border-r border-white/5 p-8 sticky top-48 h-fit space-y-10">
           
           <div>
             <div className="flex items-center justify-between mb-6">
               <h3 className="font-mono text-[11px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                 <Filter className="w-3 h-3 text-lime" /> Status
               </h3>
               { (verifiedOnly || privateOnly) && (
                 <button 
                  onClick={() => { setVerifiedOnly(false); setPrivateOnly(false); }}
                  className="text-[9px] font-mono uppercase text-lime hover:underline"
                 >
                  Clear
                 </button>
               )}
             </div>
             <div className="space-y-4 font-mono text-xs">
               <label className="flex items-center justify-between cursor-pointer group">
                 <span className="text-text-secondary group-hover:text-white transition-colors">Verified Only</span>
                 <input
                   type="checkbox"
                   checked={verifiedOnly}
                   onChange={(e) => setVerifiedOnly(e.target.checked)}
                   className="w-4 h-4 rounded border-white/20 bg-black text-lime focus:ring-lime/50"
                 />
               </label>
               <label className="flex items-center justify-between cursor-pointer group">
                 <span className="text-text-secondary group-hover:text-white transition-colors">Privacy Enabled</span>
                 <input
                   type="checkbox"
                   checked={privateOnly}
                   onChange={(e) => setPrivateOnly(e.target.checked)}
                   className="w-4 h-4 rounded border-white/20 bg-black text-lime focus:ring-lime/50"
                 />
               </label>
             </div>
           </div>

           <div className="pt-8 border-t border-white/5">
             <h3 className="font-mono text-[11px] font-bold text-white uppercase tracking-widest mb-6">Price Range (ZERA)</h3>
             <div className="space-y-4">
               <div className="flex items-center gap-3">
                 <Input 
                   placeholder="Min" 
                   value={priceRange.min}
                   onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                   className="h-11 bg-black/60 border-white/10 rounded-xl text-center font-mono text-sm" 
                 />
                 <span className="text-text-muted font-mono text-xs">TO</span>
                 <Input 
                   placeholder="Max" 
                   value={priceRange.max}
                   onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                   className="h-11 bg-black/60 border-white/10 rounded-xl text-center font-mono text-sm" 
                 />
               </div>
               <Button 
                variant="secondary" 
                className="w-full h-11 border-white/10 text-[10px] font-mono font-bold uppercase tracking-widest hover:border-lime/30"
               >
                Refine Search
               </Button>
             </div>
           </div>

           <div className="pt-8 border-t border-white/5">
              <h3 className="font-mono text-[11px] font-bold text-white uppercase tracking-widest mb-6">Sort By</h3>
              <select className="w-full bg-black/60 border border-white/10 rounded-xl h-11 px-4 font-mono text-xs text-text-secondary focus:outline-none focus:border-lime/50 appearance-none cursor-pointer">
                <option>Newest First</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Most Popular</option>
              </select>
           </div>
        </div>

        {/* Main Grid */}
        <div className="flex-1 p-6 md:p-10 bg-obsidian_light">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {[...Array(10)].map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <EmptyState
              icon={Package}
              title="Failed to Load Assets"
              description={error}
            />
          ) : filteredAssets.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No Assets Found"
              description="Try adjusting your filters or search query"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {filteredAssets.map((asset) => (
                <Link href={`/assets/${asset.id}`} key={asset.id} className="block group">
                  <Card className="p-0 overflow-hidden bg-obsidian border-white/5 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(204,255,0,0.1)] hover:border-lime/30 transition-all duration-300">
                    <div className="h-64 relative bg-black">
                      <img src={asset.imageUrl} alt={asset.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105" />
                      
                      {/* Top Badges */}
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

                      {/* Favorite Button */}
                      <button className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/10 transition-colors">
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-5">
                      <div className="flex items-center gap-1.5 mb-1">
                         <div className="flex items-center gap-1 bg-emerald-glow/5 border border-emerald-glow/10 rounded px-1.5 py-0.5">
                           <CheckCircle2 className="w-2.5 h-2.5 text-emerald-glow" />
                           <span className="font-mono text-[9px] text-emerald-glow uppercase tracking-tighter">ZK-Verified Creator</span>
                         </div>
                      </div>
                      <h3 className="font-grotesk font-bold text-lg leading-tight group-hover:text-lime transition-colors truncate">{asset.title}</h3>
                      
                      <div className="mt-4 pt-4 border-t border-white/5 flex items-end justify-between font-mono">
                        <div>
                          <p className="text-[10px] text-text-muted uppercase tracking-widest mb-1">Price</p>
                          <p className="text-sm font-bold text-lime">{asset.price}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-text-muted uppercase tracking-widest mb-1">Last Sale</p>
                          <p className="text-xs text-text-secondary">--</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
