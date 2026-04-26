import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Filter, LayoutGrid, List, CheckCircle2, Globe, MessageCircle, Share2, Heart } from "lucide-react";
import { featuredAssets } from '@/data/mockData';
import Link from "next/link";

export default function CollectionDetail() {
  const assets = [...featuredAssets, ...featuredAssets, ...featuredAssets];

  return (
    <div className="w-full flex flex-col min-h-screen pb-32">
      
      {/* Banner */}
      <div className="w-full h-64 md:h-80 bg-obsidian relative">
        <img 
          src="https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?w=1600&h=600&fit=crop" 
          alt="Banner" 
          className="w-full h-full object-cover opacity-60 mix-blend-screen"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
      </div>

      <div className="max-w-[1600px] w-full mx-auto px-6 md:px-10 -mt-24 relative z-10">
        
        {/* Header Info */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
            <div className="relative rounded-3xl p-1.5 bg-black border border-white/10">
              <img 
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=200&h=200&fit=crop" 
                alt="Avatar" 
                className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover"
              />
              <div className="absolute -bottom-2 -right-2 bg-obsidian rounded-full p-1 border border-obsidian">
                 <CheckCircle2 className="w-8 h-8 text-emerald-glow fill-emerald-glow/20" />
              </div>
            </div>
            
            <div className="pb-2">
              <h1 className="text-4xl font-grotesk font-bold uppercase tracking-tight text-text-primary mb-2 flex items-center gap-3">
                Quantum Art
              </h1>
              <div className="flex items-center gap-4 font-mono text-xs text-text-secondary">
                <span>By <Link href="#" className="text-text-primary hover:text-lime transition-colors">0xCreator</Link></span>
                <span>·</span>
                <span>Items 9,999</span>
                <span>·</span>
                <span>Created Oct 2025</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <Button variant="secondary" size="icon" className="rounded-xl h-10 w-10 border-white/5"><Globe className="w-4 h-4" /></Button>
             <Button variant="secondary" size="icon" className="rounded-xl h-10 w-10 border-white/5"><MessageCircle className="w-4 h-4" /></Button>
             <Button variant="secondary" size="icon" className="rounded-xl h-10 w-10 border-white/5"><Share2 className="w-4 h-4" /></Button>
          </div>
        </div>

        {/* Description & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2">
            <p className="font-mono text-sm leading-relaxed text-text-secondary max-w-2xl">
              Generative art on the blockchain governed by Zero-Knowledge rulesets. A curated set of highly restricted digital artifacts.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:col-span-1">
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest mb-1">Total Volume</span>
              <span className="font-grotesk text-xl font-bold">14.2K ZERA</span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest mb-1">Floor Price</span>
              <span className="font-grotesk text-xl font-bold text-lime">2.4 ZERA</span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest mb-1">Best Offer</span>
              <span className="font-grotesk text-xl font-bold">2.1 ZERA</span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest mb-1">Owners</span>
              <span className="font-grotesk text-xl font-bold">4,201 (42%)</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-8 border-b border-white/10 mb-8 font-mono text-xs uppercase overflow-x-auto pb-4">
          <button className="text-lime border-b-2 border-lime pb-4 -mb-4 font-bold whitespace-nowrap">Items</button>
          <button className="text-text-secondary hover:text-text-primary pb-4 -mb-4 transition-colors whitespace-nowrap">Activity</button>
          <button className="text-text-secondary hover:text-text-primary pb-4 -mb-4 transition-colors whitespace-nowrap">Analytics</button>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
           <div className="flex items-center gap-2 w-full sm:w-auto">
             <Button variant="secondary" className="h-10 text-xs font-mono gap-2 bg-obsidian border-white/5 w-full sm:w-auto">
               <Filter className="w-4 h-4" /> Filters
             </Button>
           </div>
           <div className="relative w-full sm:w-96">
             <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
             <Input placeholder="Search by name or attribute..." className="pl-10 h-10 bg-obsidian border-white/5" />
           </div>
           <div className="hidden sm:flex items-center bg-obsidian border border-white/5 rounded-lg p-1">
             <button className="p-2 rounded-md bg-white/10 text-text-primary"><LayoutGrid className="w-4 h-4" /></button>
             <button className="p-2 rounded-md text-text-muted hover:text-text-primary"><List className="w-4 h-4" /></button>
           </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {assets.map((asset, i) => (
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
  );
}
