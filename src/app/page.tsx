import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { topCollections, notableDrops, resources } from "../data/mockData";
import { CheckCircle2 } from "lucide-react";

export default function Home() {
  const leftColumn = topCollections.slice(0, 5);
  const rightColumn = topCollections.slice(5, 10);

  return (
    <div className="w-full flex flex-col gap-16 pb-24">
      
      {/* Featured Banner / Hero */}
      <section className="w-full px-4 md:px-8 mt-6">
        <div className="w-full h-[400px] md:h-[500px] relative rounded-3xl overflow-hidden group cursor-pointer border border-white/10">
          <img 
            src="https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?w=1600&h=600&fit=crop" 
            alt="Featured Drop" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 p-8 w-full">
            <Badge className="bg-lime text-black border-none mb-4 font-bold" showDot>LIVE_DROP</Badge>
            <h1 className="text-4xl md:text-5xl font-grotesk font-bold text-white mb-2">The Obsidian Sequence</h1>
            <p className="text-white/80 font-mono text-sm max-w-xl mb-6">By 0xCreator. A curated set of 999 provably rare digital artifacts.</p>
            <Button variant="secondary" className="bg-white text-black hover:bg-gray-200 border-none font-grotesk">View Drop</Button>
          </div>
        </div>
      </section>

      {/* Trending / Top Collections Tables */}
      <section className="w-full px-4 md:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-6 border-b border-white/10 pb-2">
             <button className="text-xl font-grotesk font-bold text-text-primary border-b-2 border-text-primary pb-2 -mb-[10px]">Trending</button>
             <button className="text-xl font-grotesk font-bold text-text-secondary hover:text-text-primary pb-2 -mb-[10px]">Top</button>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" className="h-10 px-4 text-sm font-mono bg-white/5 rounded-xl border-white/10">24h</Button>
            <Button variant="secondary" className="h-10 px-4 text-sm font-mono bg-white/5 rounded-xl border-white/10">View All</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-2">
          
          {/* Left Column (1-5) */}
          <div className="flex flex-col">
            <div className="flex text-xs font-mono text-text-secondary uppercase pb-4 px-2 border-b border-white/5 mb-2">
              <span className="w-10 text-center">#</span>
              <span className="flex-1">Collection</span>
              <span className="w-24 text-right">Floor Price</span>
              <span className="w-24 text-right">Volume</span>
            </div>
            {leftColumn.map((col) => (
              <div key={col.rank} className="flex items-center p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group border border-transparent hover:border-white/10">
                <span className="w-8 text-center font-bold text-text-secondary">{col.rank}</span>
                <div className="flex-1 flex items-center gap-4">
                  <div className="relative">
                    <img src={col.avatar} className="w-14 h-14 rounded-xl object-cover border border-white/10" alt={col.name} />
                    {col.verified && (
                      <div className="absolute -bottom-1 -right-1 bg-black rounded-full border border-black">
                        <CheckCircle2 className="w-4 h-4 text-emerald-glow fill-emerald-glow/20" />
                      </div>
                    )}
                  </div>
                  <span className="font-grotesk font-bold text-base group-hover:text-lime transition-colors">{col.name}</span>
                </div>
                <div className="w-24 text-right">
                  <span className="font-mono text-sm">{col.floor}</span>
                </div>
                <div className="w-24 text-right flex flex-col items-end">
                  <span className="font-mono text-sm">{col.volume}</span>
                  <span className={`font-mono text-xs ${col.change.startsWith('+') ? 'text-emerald-glow' : 'text-red-500'}`}>{col.change}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column (6-10) */}
          <div className="flex flex-col">
            <div className="flex text-xs font-mono text-text-secondary uppercase pb-4 px-2 border-b border-white/5 mb-2">
              <span className="w-10 text-center">#</span>
              <span className="flex-1">Collection</span>
              <span className="w-24 text-right">Floor Price</span>
              <span className="w-24 text-right">Volume</span>
            </div>
            {rightColumn.map((col) => (
              <div key={col.rank} className="flex items-center p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group border border-transparent hover:border-white/10">
                <span className="w-8 text-center font-bold text-text-secondary">{col.rank}</span>
                <div className="flex-1 flex items-center gap-4">
                  <div className="relative">
                    <img src={col.avatar} className="w-14 h-14 rounded-xl object-cover border border-white/10" alt={col.name} />
                    {col.verified && (
                      <div className="absolute -bottom-1 -right-1 bg-black rounded-full border border-black">
                        <CheckCircle2 className="w-4 h-4 text-emerald-glow fill-emerald-glow/20" />
                      </div>
                    )}
                  </div>
                  <span className="font-grotesk font-bold text-base group-hover:text-lime transition-colors">{col.name}</span>
                </div>
                <div className="w-24 text-right">
                  <span className="font-mono text-sm">{col.floor}</span>
                </div>
                <div className="w-24 text-right flex flex-col items-end">
                  <span className="font-mono text-sm">{col.volume}</span>
                  <span className={`font-mono text-xs ${col.change.startsWith('+') ? 'text-emerald-glow' : 'text-red-500'}`}>{col.change}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Notable Collections Grid */}
      <section className="w-full px-4 md:px-8 mt-8">
        <h2 className="text-2xl font-grotesk font-bold mb-6">Notable Collections</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {notableDrops.map((drop, i) => (
            <div key={i} className="group flex flex-col rounded-2xl bg-white/5 border border-white/10 overflow-hidden cursor-pointer hover:-translate-y-1 hover:border-lime/30 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(204,255,0,0.1)]">
               <div className="h-40 w-full relative overflow-hidden">
                 <img src={drop.banner} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-transform duration-500 group-hover:scale-105" alt="Banner" />
               </div>
               <div className="relative p-5 pt-0 flex flex-col items-start bg-obsidian flex-1">
                 <div className="relative -mt-8 mb-3 rounded-xl p-1 bg-obsidian border border-white/10">
                   <img src={drop.avatar} className="w-16 h-16 rounded-lg object-cover" alt="Avatar" />
                 </div>
                 <h3 className="font-grotesk font-bold text-lg mb-1 group-hover:text-lime transition-colors flex items-center gap-1">
                   {drop.name} <CheckCircle2 className="w-4 h-4 text-emerald-glow" />
                 </h3>
                 <p className="text-sm font-mono text-text-secondary line-clamp-2">{drop.description}</p>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* NFT 101 Resources */}
      <section className="w-full px-4 md:px-8 mt-8">
        <h2 className="text-2xl font-grotesk font-bold mb-6">NFT 101</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map((res, i) => (
            <div key={i} className="group relative rounded-2xl overflow-hidden cursor-pointer border border-white/10 hover:border-lime/40 transition-colors h-48">
              <img src={res.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-300" alt={res.title} />
              <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-black/90 to-transparent">
                <h3 className="font-grotesk font-bold text-xl group-hover:text-lime transition-colors">{res.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
