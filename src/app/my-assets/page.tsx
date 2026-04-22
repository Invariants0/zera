import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Search, Filter, LayoutGrid, List } from "lucide-react";
import { featuredAssets } from "../../data/mockData";
import Link from "next/link";

export default function MyAssets() {
  const assets = [...featuredAssets, ...featuredAssets];

  return (
    <div className="w-full max-w-[1600px] mx-auto p-6 md:p-10 pb-32">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-grotesk font-bold uppercase tracking-tight text-text-primary">
            My Assets
          </h1>
          <p className="font-mono text-sm text-text-secondary mt-2">
            Manage your verified holdings and generate Zero-Knowledge proofs.
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
         <div className="relative w-full sm:w-96">
           <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
           <Input placeholder="Search your assets..." className="pl-10 h-10 bg-obsidian border-white/5" />
         </div>
         <div className="flex items-center gap-2 w-full sm:w-auto">
           <Button variant="secondary" className="h-10 text-xs font-mono gap-2 bg-obsidian border-white/5 w-full sm:w-auto">
             <Filter className="w-4 h-4" /> Filters
           </Button>
           <div className="hidden sm:flex items-center bg-obsidian border border-white/5 rounded-lg p-1">
             <button className="p-2 rounded-md bg-white/10 text-text-primary"><LayoutGrid className="w-4 h-4" /></button>
             <button className="p-2 rounded-md text-text-muted hover:text-text-primary"><List className="w-4 h-4" /></button>
           </div>
         </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {assets.map((asset, i) => (
          <Link href={`/assets/${asset.id}`} key={i} className="block group">
            <Card className="p-0 overflow-hidden bg-obsidian border-white/5 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(204,255,0,0.1)] hover:border-lime/30 transition-all duration-300">
              <div className="h-48 relative bg-black">
                <img src={asset.imageUrl} alt={asset.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105" />
                
                {/* Top Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {asset.badges.map(b => (
                    <Badge key={b} variant={b as any} showDot className="backdrop-blur-xl bg-black/60 border-white/10 px-2 py-0.5 text-[9px]">
                      {b === 'verified' ? 'VERIFIED' : 'PRIVATE'}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-grotesk font-bold text-lg leading-tight group-hover:text-lime transition-colors truncate">{asset.title}</h3>
                
                <div className="mt-4 pt-4 border-t border-white/5 flex items-end justify-between font-mono">
                  <div>
                    <p className="text-[10px] text-text-muted uppercase tracking-widest mb-1">Current Value</p>
                    <p className="text-sm font-bold text-lime">{asset.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-text-muted uppercase tracking-widest mb-1">Status</p>
                    <p className="text-xs text-text-secondary">Held Securely</p>
                  </div>
                </div>

                <Button variant="secondary" className="w-full mt-4 h-8 text-[10px] tracking-widest uppercase bg-white/5 border-white/10 group-hover:bg-lime group-hover:text-black group-hover:border-lime transition-colors">
                  Manage Asset
                </Button>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
