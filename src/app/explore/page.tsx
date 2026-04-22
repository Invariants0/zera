import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Search, Filter, ChevronDown, CheckCircle2, Lock, Heart } from "lucide-react";
import { featuredAssets } from "../../data/mockData";
import Link from "next/link";

export default function Explore() {
  // Let's create an array of 12 assets by repeating the mock data
  const gridAssets = [...featuredAssets, ...featuredAssets, ...featuredAssets, ...featuredAssets, ...featuredAssets, ...featuredAssets];

  return (
    <div className="w-full flex flex-col min-h-screen">
      
      {/* Header Area */}
      <div className="px-6 md:px-10 py-8 border-b border-white/5">
        <h1 className="text-3xl font-grotesk font-bold uppercase tracking-tight mb-6">Explore Assets</h1>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
           {/* Mobile Filter Toggle */}
           <Button variant="secondary" className="sm:hidden w-full gap-2 justify-center">
             <Filter className="w-4 h-4" /> Filters
           </Button>

           <div className="flex-1 w-full flex items-center gap-4 overflow-x-auto no-scrollbar">
             {["All", "Art", "Music", "Gaming", "Memberships", "IP Licenses"].map((cat, i) => (
               <button key={cat} className={`whitespace-nowrap px-4 py-2 rounded-full font-mono text-xs uppercase tracking-wider transition-colors ${i === 0 ? 'bg-white/10 text-text-primary' : 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-white/5'}`}>
                 {cat}
               </button>
             ))}
           </div>

           <div className="flex items-center gap-4 shrink-0">
             <div className="relative w-64 hidden md:block">
               <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
               <Input placeholder="Search assets..." className="pl-10 h-10 bg-obsidian border-white/10 rounded-xl" />
             </div>
             <Button variant="secondary" className="h-10 px-4 text-xs font-mono uppercase gap-2 bg-obsidian border-white/10">
               Sort: Trending <ChevronDown className="w-3 h-3" />
             </Button>
           </div>
        </div>
      </div>

      <div className="flex flex-1">
        
        {/* Left Sidebar Filters (Desktop) */}
        <div className="hidden lg:block w-72 border-r border-white/5 p-6 overflow-y-auto space-y-8">
           
           <div>
             <h3 className="font-mono text-[10px] text-text-muted uppercase tracking-widest mb-4">Status</h3>
             <div className="space-y-3 font-mono text-sm">
               <label className="flex items-center gap-3 cursor-pointer group">
                 <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-white/20 bg-obsidian text-lime focus:ring-lime/50" />
                 <span className="group-hover:text-lime transition-colors">Verified Only</span>
               </label>
               <label className="flex items-center gap-3 cursor-pointer group">
                 <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-white/20 bg-obsidian text-lime focus:ring-lime/50" />
                 <span className="group-hover:text-lime transition-colors">Privacy Enabled</span>
               </label>
               <label className="flex items-center gap-3 cursor-pointer group">
                 <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-obsidian text-lime focus:ring-lime/50" />
                 <span className="group-hover:text-lime transition-colors">Buy Now</span>
               </label>
             </div>
           </div>

           <div className="pt-6 border-t border-white/5">
             <h3 className="font-mono text-[10px] text-text-muted uppercase tracking-widest mb-4">Price Range</h3>
             <div className="flex items-center gap-2">
               <Input placeholder="Min" className="h-10 bg-obsidian border-white/10 rounded-lg text-center" />
               <span className="text-text-muted">to</span>
               <Input placeholder="Max" className="h-10 bg-obsidian border-white/10 rounded-lg text-center" />
             </div>
             <Button variant="secondary" className="w-full mt-4 h-10 border-white/10 text-xs font-mono">Apply</Button>
           </div>

        </div>

        {/* Main Grid */}
        <div className="flex-1 p-6 md:p-10 bg-obsidian_light">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {gridAssets.map((asset, i) => (
              <Link href={`/assets/${asset.id}`} key={i} className="block group">
                <Card className="p-0 overflow-hidden bg-obsidian border-white/5 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(204,255,0,0.1)] hover:border-lime/30 transition-all duration-300">
                  <div className="h-64 relative bg-black">
                    <img src={asset.imageUrl} alt={asset.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105" />
                    
                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      {asset.badges.map(b => (
                        <Badge key={b} variant={b as any} showDot className="backdrop-blur-xl bg-black/60 border-white/10 px-2 py-0.5 text-[9px]">
                          {b === 'verified' ? 'VERIFIED' : 'PRIVATE'}
                        </Badge>
                      ))}
                    </div>

                    {/* Favorite Button */}
                    <button className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/10 transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-1.5 mb-1">
                       <span className="font-mono text-[10px] text-text-secondary uppercase">{asset.creator}</span>
                       <CheckCircle2 className="w-3 h-3 text-emerald-glow" />
                    </div>
                    <h3 className="font-grotesk font-bold text-lg leading-tight group-hover:text-lime transition-colors truncate">{asset.title}</h3>
                    
                    <div className="mt-4 pt-4 border-t border-white/5 flex items-end justify-between font-mono">
                      <div>
                        <p className="text-[10px] text-text-muted uppercase tracking-widest mb-1">Price</p>
                        <p className="text-sm font-bold text-lime">{asset.price}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-text-muted uppercase tracking-widest mb-1">Last Sale</p>
                        <p className="text-xs text-text-secondary">2.1 ZERA</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
