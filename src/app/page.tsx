import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Paintbrush, Gamepad2, Landmark } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { topCollections, notableDrops } from "../data/mockData";

export default function Home() {
  const leftColumn = topCollections.slice(0, 5);
  const rightColumn = topCollections.slice(5, 10);

  return (
    <div className="w-full mx-auto pb-20 md:pb-32">
      <section className="relative w-full min-h-[calc(100vh-5rem)] flex items-center bg-black overflow-hidden border-b border-white/5 pt-16 md:pt-20 pb-16 md:pb-20">
        <div className="absolute inset-0 bg-grid-pattern bg-grid-60 opacity-20 mix-blend-overlay pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-[800px] h-[800px] bg-lime/10 blur-[150px] rounded-full pointer-events-none -translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-[1600px] mx-auto w-full px-4 sm:px-6 md:px-10 flex flex-col lg:flex-row items-center gap-10 lg:gap-16 relative z-10">
          <div className="flex-1 w-full space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
            <Badge className="bg-lime/10 text-lime border-lime/30 font-mono tracking-widest text-[10px]" showDot>
              THE TRUST LAYER FOR DIGITAL ASSETS
            </Badge>

            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-grotesk font-bold uppercase tracking-tighter leading-[1.02] sm:leading-[1]">
                NFTs are still seen as speculative toys, <br className="hidden xl:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime to-white/50">
                  not serious assets.
                </span>
              </h1>
            </div>

            <p className="font-mono text-base sm:text-lg md:text-xl text-text-primary max-w-2xl leading-relaxed">
              ZERA changes that by turning digital assets into verified, private, and compliant financial primitives built for real ownership.
            </p>

            <p className="font-mono text-xs sm:text-sm text-text-secondary max-w-xl leading-relaxed border-l-2 border-lime/50 pl-4">
              Most marketplaces optimized for hype, visibility, and speculation.
              <br />
              ZERA optimizes for legitimacy, trust, and enforceability.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/explore">
                <Button variant="primary" size="lg" className="w-full sm:w-auto rounded-xl gap-2 h-14 px-8 text-sm">
                  Explore Marketplace <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/create-asset">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto rounded-xl bg-white/5 border-white/10 h-14 px-8 text-sm">
                  Start Tokenizing
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-8 font-mono text-[10px] text-text-muted uppercase tracking-widest">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-lime" /> Verified Ownership
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-lime" /> Private Transfers
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-lime" /> Midnight Powered
              </span>
            </div>
          </div>

          <div className="flex-1 w-full max-w-2xl relative animate-in fade-in slide-in-from-right-12 duration-1000 delay-300 fill-mode-both">
            <div className="relative aspect-[4/5] sm:aspect-square w-full rounded-[1.75rem] sm:rounded-[2.5rem] overflow-hidden border border-white/10 bg-obsidian_light shadow-[0_0_100px_rgba(204,255,0,0.15)] group">
              <img
                src="/images/hero_vault.png"
                className="w-full h-full object-cover transform scale-105 group-hover:scale-100 transition-transform duration-[2s] ease-out"
                alt="Digital Vault"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

              <div className="absolute bottom-4 sm:bottom-10 left-4 sm:left-10 right-4 sm:right-10 backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-4 sm:p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <Badge variant="verified" className="mb-2 sm:mb-3 backdrop-blur-md bg-black/50 text-[9px] sm:text-xs" showDot>
                      SECURE_ARTIFACT
                    </Badge>
                    <h3 className="font-grotesk font-bold text-lg sm:text-2xl mb-1 text-white">Cryptographic Relic</h3>
                    <p className="font-mono text-xs text-lime">Proof Generated: 0x8a...29b</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-lime/30 flex items-center justify-center bg-lime/10 shrink-0">
                    <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-lime" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 space-y-20 md:space-y-32 pt-16 md:pt-32">
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-grotesk font-bold uppercase tracking-tight">Market Activity</h2>
              <p className="font-mono text-sm text-text-secondary mt-2">Top volume across all verified registries (24h)</p>
            </div>
            <Link href="/registry">
              <Button variant="ghost" className="font-mono text-xs hidden sm:flex">
                View Registry
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-16 gap-y-8">
            {[leftColumn, rightColumn].map((col, idx) => (
              <div key={idx} className="flex flex-col">
                <div className="hidden md:flex text-[10px] font-mono text-text-muted uppercase tracking-widest pb-4 px-2 border-b border-white/5 mb-2">
                  <span className="w-8 text-center">#</span>
                  <span className="flex-1">Collection</span>
                  <span className="w-24 text-right">Floor Price</span>
                  <span className="w-24 text-right">Volume</span>
                </div>

                <div className="space-y-2">
                  {col.map((item) => (
                    <Link
                      href={`/collections/${item.name.toLowerCase().replace(/ /g, "-")}`}
                      key={item.rank}
                      className="flex flex-col md:flex-row md:items-center gap-3 md:gap-0 p-3 rounded-2xl hover:bg-white/5 transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-3 md:gap-0 md:w-auto">
                        <span className="w-8 text-center font-mono text-xs font-bold text-text-secondary">{item.rank}</span>
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

                      <div className="flex items-center justify-between md:justify-end md:flex-1 gap-4 pl-0 md:pl-2">
                        <div className="md:w-24 md:text-right">
                          <span className="font-mono text-sm">{item.floor}</span>
                        </div>
                        <div className="md:w-24 md:text-right flex flex-col items-end">
                          <span className="font-mono text-sm">{item.volume}</span>
                          <span className={`font-mono text-[10px] mt-0.5 ${item.change.startsWith("+") ? "text-emerald-glow" : "text-red-500"}`}>{item.change}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-grotesk font-bold uppercase tracking-tight mb-8">Notable Drops</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {notableDrops.map((drop, i) => (
              <Link href={`/collections/${drop.name.toLowerCase().replace(/ /g, "-")}`} key={i} className="group">
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

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1 space-y-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-grotesk font-bold uppercase tracking-tight">
              Markets need proof, <br />
              <span className="text-lime">not promises.</span>
            </h2>
            <div className="space-y-6 font-mono text-sm text-text-secondary leading-relaxed">
              <p>
                Traditional NFT platforms focused on openness, visibility, and permissionless access - but ignored what matters most:
                <span className="text-white font-bold"> Verifiability, Privacy, and Compliance.</span>
              </p>
              <p>
                ZERA is a verification-first registry and marketplace built on Midnight Network. It transforms open marketplaces into:
              </p>
              <ul className="space-y-3 pl-4 border-l border-white/10">
                <li className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-lime" /> Trust systems
                </li>
                <li className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-lime" /> Compliance-aware environments
                </li>
                <li className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-lime" /> Private ownership layers
                </li>
              </ul>
            </div>
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-4 py-2 mt-4">
              <div className="w-2 h-2 rounded-full bg-lime animate-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted">Powered by Midnight Network privacy infrastructure</span>
            </div>
          </div>

          <div className="order-1 lg:order-2 w-full rounded-3xl overflow-hidden border border-white/10 bg-black aspect-square relative shadow-[0_0_80px_rgba(204,255,0,0.05)]">
            <img src="/images/network_nodes.png" className="w-full h-full object-cover" alt="Midnight Network Infrastructure" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          </div>
        </section>

        <section className="space-y-16">
          <div className="max-w-3xl space-y-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-grotesk font-bold uppercase tracking-tight leading-[1.1]">
              We&apos;re turning digital ownership into a <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime to-white">real asset class.</span>
            </h2>
            <p className="font-mono text-text-secondary text-base leading-relaxed">
              Digital assets should be more than collectibles and speculation. ZERA enables a future where creators, brands, communities, and institutions can issue assets with real utility, real trust, and real financial meaning.
            </p>
            <p className="font-mono text-text-secondary text-base leading-relaxed">
              From culture assets to memberships, media rights, game economies, and premium collectibles - ownership becomes investable, transferable, and credible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <Card className="bg-obsidian border-white/5 p-8 hover:bg-white/5 hover:border-lime/30 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-lime/10 border border-lime/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Paintbrush className="w-6 h-6 text-lime" />
              </div>
              <h3 className="font-grotesk font-bold text-xl mb-3">Creator Economies</h3>
              <p className="font-mono text-sm text-text-secondary">Launch premium verified assets.</p>
            </Card>

            <Card className="bg-obsidian border-white/5 p-8 hover:bg-white/5 hover:border-lime/30 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-lime/10 border border-lime/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6 text-lime" />
              </div>
              <h3 className="font-grotesk font-bold text-xl mb-3">Brand Assets</h3>
              <p className="font-mono text-sm text-text-secondary">Memberships, loyalty, access passes.</p>
            </Card>

            <Card className="bg-obsidian border-white/5 p-8 hover:bg-white/5 hover:border-lime/30 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-lime/10 border border-lime/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Gamepad2 className="w-6 h-6 text-lime" />
              </div>
              <h3 className="font-grotesk font-bold text-xl mb-3">Gaming Economies</h3>
              <p className="font-mono text-sm text-text-secondary">Trusted in-game ownership markets.</p>
            </Card>

            <Card className="bg-obsidian border-white/5 p-8 hover:bg-white/5 hover:border-lime/30 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-lime/10 border border-lime/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Landmark className="w-6 h-6 text-lime" />
              </div>
              <h3 className="font-grotesk font-bold text-xl mb-3">Digital Finance</h3>
              <p className="font-mono text-sm text-text-secondary">Assets that can actually be taken seriously.</p>
            </Card>
          </div>
        </section>

        <section className="relative w-full rounded-[2rem] bg-obsidian_light border border-white/5 overflow-hidden p-6 sm:p-8 lg:p-12 text-center shadow-[0_0_40px_rgba(204,255,0,0.03)]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-lime/5 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6 flex flex-col items-center">
            <h2 className="text-2xl md:text-3xl font-grotesk font-bold uppercase tracking-tight leading-tight">
              Start building the next generation of digital assets.
            </h2>
            <p className="font-mono text-text-secondary text-sm max-w-xl">Mint, tokenize, launch, and trade assets built on trust.</p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 w-full sm:w-auto">
              <Link href="/create-asset">
                <Button variant="primary" className="px-8 text-sm w-full sm:w-auto">
                  Start Tokenizing
                </Button>
              </Link>
              <Link href="/explore">
                <Button variant="secondary" className="px-8 text-sm bg-white/5 border-white/10 w-full sm:w-auto">
                  Explore Marketplace
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
