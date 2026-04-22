import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { CheckCircle2, ShieldCheck, MessageCircle, Globe, Copy } from "lucide-react";
import { featuredAssets } from "../../data/mockData";
import Link from "next/link";

export default function Profile() {
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

      <div className="max-w-[1200px] w-full mx-auto px-6 md:px-10 -mt-24 relative z-10">
        
        {/* Profile Header Info */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
            <div className="relative rounded-3xl p-1.5 bg-black border border-white/10">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop" 
                alt="Avatar" 
                className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover"
              />
              <div className="absolute -bottom-2 -right-2 bg-obsidian rounded-full p-1 border border-obsidian">
                 <CheckCircle2 className="w-8 h-8 text-emerald-glow fill-emerald-glow/20" />
              </div>
            </div>
            
            <div className="pb-2">
              <h1 className="text-4xl font-grotesk font-bold uppercase tracking-tight text-text-primary mb-2 flex items-center gap-3">
                Institutional Vault
              </h1>
              <div className="flex items-center gap-4 font-mono text-xs text-text-secondary">
                <button className="flex items-center gap-2 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                  0x7F...3A19 <Copy className="w-3 h-3" />
                </button>
                <span>Joined Nov 2025</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <Button variant="secondary" size="icon" className="rounded-xl h-10 w-10 border-white/5"><MessageCircle className="w-4 h-4" /></Button>
             <Button variant="secondary" size="icon" className="rounded-xl h-10 w-10 border-white/5"><Globe className="w-4 h-4" /></Button>
             <Button variant="primary" className="h-10 px-6 font-mono text-xs uppercase rounded-xl">Follow</Button>
          </div>
        </div>

        {/* Bio & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2">
            <p className="font-mono text-sm leading-relaxed text-text-secondary max-w-2xl">
              Verified institutional custody solution specializing in high-value digital artifacts and tokenized real estate fractionals. Authorized issuer on the ZERA Protocol.
            </p>
          </div>
          <div className="flex gap-8">
            <div>
              <p className="font-mono text-[10px] text-text-muted uppercase tracking-widest mb-1">Total Volume</p>
              <p className="font-grotesk text-2xl font-bold">14.2K ZERA</p>
            </div>
            <div>
              <p className="font-mono text-[10px] text-text-muted uppercase tracking-widest mb-1">Trust Score</p>
              <p className="font-grotesk text-2xl font-bold text-lime">99.8%</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-8 border-b border-white/10 mb-8 font-mono text-xs uppercase overflow-x-auto pb-4">
          <button className="text-lime border-b-2 border-lime pb-4 -mb-4 font-bold whitespace-nowrap">Owned (24)</button>
          <button className="text-text-secondary hover:text-text-primary pb-4 -mb-4 transition-colors whitespace-nowrap">Created (112)</button>
          <button className="text-text-secondary hover:text-text-primary pb-4 -mb-4 transition-colors whitespace-nowrap">Activity</button>
          <button className="text-text-secondary hover:text-text-primary pb-4 -mb-4 transition-colors whitespace-nowrap flex items-center gap-2">
             <ShieldCheck className="w-4 h-4" /> Hidden Holdings
          </button>
        </div>

        {/* Grid (Reusing featuredAssets for display) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...featuredAssets, ...featuredAssets].map((asset, i) => (
            <Link href={`/assets/${asset.id}`} key={i} className="block group">
              <Card className="p-0 overflow-hidden bg-obsidian border-white/5 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(204,255,0,0.1)] hover:border-lime/30 transition-all duration-300">
                <div className="h-48 relative bg-black">
                  <img src={asset.imageUrl} alt={asset.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105" />
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
                      <p className="text-[10px] text-text-muted uppercase tracking-widest mb-1">Price</p>
                      <p className="text-sm font-bold text-lime">{asset.price}</p>
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
