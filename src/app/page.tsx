import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { topCollections, notableDrops } from "../data/mockData";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const leftColumn = topCollections.slice(0, 5);
  const rightColumn = topCollections.slice(5, 10);

  return (
    <div className="w-full max-w-[1600px] mx-auto p-6 md:p-10 pb-24 space-y-16">
      
      {/* App Dashboard Hero */}
      <section className="relative w-full rounded-[2.5rem] bg-obsidian border border-white/5 overflow-hidden group">
        <div className="absolute inset-0 bg-grid-pattern bg-grid-60 opacity-20 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-lime/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="relative z-10 p-12 lg:p-20 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-8">
            <Badge className="bg-lime/10 text-lime border-none" showDot>CREATOR_STUDIO_LIVE</Badge>
            <h1 className="text-5xl lg:text-7xl font-grotesk font-bold uppercase tracking-tighter leading-[0.9]">
              Verified Digital <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">Asset Registry</span>
            </h1>
            <p className="font-mono text-text-secondary max-w-lg leading-relaxed">
              Mint, manage, and trade verified digital assets—from music rights to gaming items—with Zero-Knowledge privacy preserving infrastructure.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/mint">
                <Button variant="primary" size="lg" className="rounded-full gap-2">
                  Mint Digital Asset <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/explore">
                <Button variant="secondary" size="lg" className="rounded-full bg-white/5 border-white/10">
                  Explore Markets
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex-1 w-full max-w-md hidden lg:block">
            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(204,255,0,0.1)] group-hover:shadow-[0_0_80px_rgba(204,255,0,0.2)] transition-shadow duration-700">
               <img src="https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?w=800&fit=crop" className="w-full h-full object-cover" alt="Hero Featured" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
               <div className="absolute bottom-0 left-0 w-full p-8">
                 <Badge variant="verified" className="mb-4 backdrop-blur-md bg-black/50" showDot>MUSIC_RIGHTS</Badge>
                 <h3 className="font-grotesk font-bold text-3xl mb-2">The Obsidian Sequence</h3>
                 <p className="font-mono text-xs text-text-secondary">By 0xCreator · Verified Master Recording</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Data */}
      <section>
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-grotesk font-bold uppercase tracking-tight">Market Activity</h2>
            <p className="font-mono text-xs text-text-secondary mt-2">Top volume across all verified registries (24h)</p>
          </div>
          <Link href="/registry">
             <Button variant="ghost" className="font-mono text-xs hidden sm:flex">View Registry</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-16 gap-y-4">
          {[leftColumn, rightColumn].map((col, idx) => (
            <div key={idx} className="flex flex-col">
              <div className="flex text-[10px] font-mono text-text-muted uppercase tracking-widest pb-4 px-2 border-b border-white/5 mb-2">
                <span className="w-8 text-center">#</span>
                <span className="flex-1">Collection</span>
                <span className="w-24 text-right">Floor Price</span>
                <span className="w-24 text-right">Volume</span>
              </div>
              {col.map((item) => (
                <Link href={`/collections/${item.name.toLowerCase().replace(/ /g, '-')}`} key={item.rank} className="flex items-center p-3 rounded-2xl hover:bg-white/5 transition-colors group cursor-pointer">
                  <span className="w-8 text-center font-mono text-xs font-bold text-text-secondary">{item.rank}</span>
                  <div className="flex-1 flex items-center gap-4 pl-2">
                    <div className="relative">
                      <img src={item.avatar} className="w-12 h-12 rounded-xl object-cover border border-white/10" alt={item.name} />
                      {item.verified && (
                        <div className="absolute -bottom-1 -right-1 bg-obsidian rounded-full border border-obsidian">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-glow fill-emerald-glow/20" />
                        </div>
                      )}
                    </div>
                    <span className="font-grotesk font-bold text-sm md:text-base group-hover:text-lime transition-colors">{item.name}</span>
                  </div>
                  <div className="w-24 text-right">
                    <span className="font-mono text-sm">{item.floor}</span>
                  </div>
                  <div className="w-24 text-right flex flex-col items-end">
                    <span className="font-mono text-sm">{item.volume}</span>
                    <span className={`font-mono text-[10px] mt-0.5 ${item.change.startsWith('+') ? 'text-emerald-glow' : 'text-red-500'}`}>{item.change}</span>
                  </div>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Notable Drops Grid */}
      <section>
        <h2 className="text-3xl font-grotesk font-bold uppercase tracking-tight mb-8">Notable Drops</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {notableDrops.map((drop, i) => (
            <Link href={`/collections/${drop.name.toLowerCase().replace(/ /g, '-')}`} key={i} className="group">
              <Card className="p-0 overflow-hidden bg-obsidian border-white/5 hover:border-lime/30 transition-all duration-300 hover:-translate-y-1">
                 <div className="h-40 w-full relative overflow-hidden bg-black">
                   <img src={drop.banner} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-transform duration-700 group-hover:scale-105" alt="Banner" />
                 </div>
                 <div className="p-6 pt-0 relative flex flex-col items-start bg-obsidian h-full">
                   <div className="relative -mt-10 mb-4 rounded-2xl p-1 bg-obsidian border border-white/10">
                     <img src={drop.avatar} className="w-16 h-16 rounded-xl object-cover" alt="Avatar" />
                   </div>
                   <h3 className="font-grotesk font-bold text-lg mb-2 group-hover:text-lime transition-colors flex items-center gap-1.5">
                     {drop.name} <CheckCircle2 className="w-4 h-4 text-emerald-glow" />
                   </h3>
                   <p className="text-xs font-mono text-text-secondary line-clamp-2 leading-relaxed">{drop.description}</p>
                 </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
