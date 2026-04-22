import { Button } from "../components/ui/Button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge, badgeVariants } from "../components/ui/Badge";
import { featuredAssets } from "../data/mockData";
import Image from "next/image";
import { ShieldCheck, Lock, CheckCircle2, ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary-50/50 to-transparent dark:from-primary-900/10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="relative w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-20 md:py-32 flex flex-col lg:flex-row items-center gap-16">
          {/* Left - Copy & CTAs */}
          <div className="flex-1 space-y-8 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-surface border border-border shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-accent-green"></span>
              <span className="text-xs font-medium text-text_secondary">ZERA V1 is Live</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-text_primary leading-[1.1] max-w-[9ch] lg:max-w-none">
              Provable Ownership. <br className="hidden lg:block"/> Private by Default.
            </h1>
            
            <p className="text-lg text-text_secondary leading-relaxed max-w-xl">
              Verification-first digital asset marketplace inspired by familiar patterns, 
              redesigned around institutional-grade trust, privacy, and compliance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button variant="primary" className="h-12 px-8 text-base shadow-lg shadow-primary-500/20">
                Explore Assets
              </Button>
              <Button variant="secondary" className="h-12 px-8 text-base">
                Mint Verified Asset
              </Button>
            </div>
          </div>

          {/* Right - Floating Mockups */}
          <div className="flex-1 relative w-full max-w-md lg:max-w-full lg:h-[500px]">
            <div className="relative z-10 bg-surface border border-border rounded-2xl p-6 shadow-2xl shadow-primary-500/10 hover:shadow-glow transition-all duration-slow rotate-[-2deg] hover:rotate-0">
               <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-surface_alt flex items-center justify-center">
                     <ShieldCheck className="w-5 h-5 text-primary-500" />
                   </div>
                   <div>
                     <p className="text-sm font-semibold text-text_primary">Trust Score</p>
                     <p className="text-xs text-text_secondary">Verified Account</p>
                   </div>
                 </div>
                 <Badge variant="verified">99.8%</Badge>
               </div>
               <div className="space-y-4">
                 <div className="h-2 w-full bg-surface_alt rounded-full overflow-hidden">
                   <div className="h-full bg-primary-500 w-3/4"></div>
                 </div>
                 <div className="h-2 w-5/6 bg-surface_alt rounded-full overflow-hidden">
                   <div className="h-full bg-secondary-500 w-1/2"></div>
                 </div>
               </div>
               <div className="mt-8 pt-6 border-t border-border flex justify-between items-center">
                  <p className="text-sm text-text_secondary">Active Proofs</p>
                  <p className="text-base font-semibold text-text_primary">14 Valid</p>
               </div>
            </div>

            {/* Decorative background blur */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary-500/10 dark:bg-primary-500/5 blur-3xl -z-10 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Featured Assets Section */}
      <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-16 md:py-24">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-text_primary">Trending Verified Assets</h2>
            <p className="text-text_secondary mt-2">Assets with cryptographically proven ownership.</p>
          </div>
          <Button variant="ghost" className="hidden sm:inline-flex gap-2">
            View All <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredAssets.map((asset) => (
            <Card key={asset.id} className="group cursor-pointer">
              <div className="relative aspect-[4/5] overflow-hidden rounded-t-xl bg-surface_alt">
                <img 
                  src={asset.imageUrl} 
                  alt={asset.title}
                  className="object-cover w-full h-full transition-transform duration-slow group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-60"></div>
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {asset.badges.map(badge => (
                    <Badge 
                      key={badge} 
                      variant={badge as any} 
                      className="backdrop-blur-md bg-background/80"
                    >
                      {badge === 'verified' && <CheckCircle2 className="w-3 h-3 mr-1"/>}
                      {badge === 'private' && <Lock className="w-3 h-3 mr-1"/>}
                      {badge === 'compliant' && <ShieldCheck className="w-3 h-3 mr-1"/>}
                      <span className="capitalize">{badge}</span>
                    </Badge>
                  ))}
                </div>
              </div>
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-2 mt-2">
                  <div>
                    <CardTitle className="mb-1 text-base group-hover:text-primary-500 transition-colors">{asset.title}</CardTitle>
                    <p className="text-sm text-text_secondary">{asset.creator}</p>
                  </div>
                </div>
                <div className="pt-4 mt-4 border-t border-border flex justify-between items-center">
                  <span className="text-xs text-text_secondary">Price</span>
                  <span className="text-sm font-bold text-text_primary">{asset.price}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it Works / Trust Section */}
      <section className="bg-surface_alt border-y border-border py-20">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-text_primary mb-16">Institutional-Grade Confidence</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-text_primary">Verified Authenticity</h3>
              <p className="text-sm text-text_secondary max-w-xs">Every asset undergoes rigorous origin verification before listing.</p>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center text-secondary-600">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-text_primary">Private Ownership</h3>
              <p className="text-sm text-text_secondary max-w-xs">Hold assets securely with zero-knowledge proofs protecting your identity.</p>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-accent-teal/10 flex items-center justify-center text-accent-teal">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-text_primary">Built-in Compliance</h3>
              <p className="text-sm text-text_secondary max-w-xs">Programmable rules ensure all transfers meet regulatory requirements automatically.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
