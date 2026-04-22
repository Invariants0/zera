import { Button } from "../components/ui/Button";
import { Card, CardContent, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { featuredAssets } from "../data/mockData";

export default function Home() {
  return (
    <div className="w-full h-full relative">
      
      {/* Background Grid & Glows */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid-60 opacity-30 pointer-events-none"></div>
      <div className="glow-sphere w-[600px] h-[600px] bg-lime/20 top-[-200px] left-[-200px]"></div>
      <div className="glow-sphere w-[800px] h-[800px] bg-emerald-glow/10 bottom-[-200px] right-[-200px]"></div>

      {/* Hero Section */}
      <section className="relative z-10 w-full pt-40 pb-24 px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left - Giant Typography (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex">
              <Badge variant="default" showDot>Sys_Init: ZERA_CORE</Badge>
            </div>
            
            <h1 className="text-[4rem] sm:text-[5rem] lg:text-[7.5rem] font-bold font-grotesk leading-[0.85] tracking-tighter text-text-primary uppercase">
              Provably Real. <br />
              <span className="italic bg-gradient-to-r from-lime to-white text-transparent bg-clip-text">Privately Owned.</span>
            </h1>
            
            <p className="text-xl text-text-secondary font-mono max-w-2xl mt-8">
              Trade verified digital assets with private ownership and compliant transfers. The future of premium marketplaces.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 pt-8">
              <Button variant="primary" size="lg">EXPLORE ASSETS</Button>
              <Button variant="secondary" size="lg">MINT VERIFIED</Button>
            </div>
          </div>

          {/* Right - Glass Mockup (5 cols) */}
          <div className="lg:col-span-5 relative hidden lg:block h-[600px]">
             <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[120%] animate-float">
                <Card className="bg-obsidian border-white/20 p-8 transform rotate-[-5deg] hover:rotate-0 hover:border-lime/40 transition-all duration-500">
                  <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                    <Badge variant="verified" showDot>TRUST_SCORE</Badge>
                    <span className="font-mono text-lime text-2xl font-bold">99.8%</span>
                  </div>
                  <div className="space-y-6">
                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-lime w-3/4"></div>
                    </div>
                    <div className="h-3 w-4/5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-glow w-1/2"></div>
                    </div>
                  </div>
                  <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center font-mono">
                    <span className="text-sm text-text-muted">ACTIVE_PROOFS</span>
                    <span className="text-lg text-text-primary">14_VALID</span>
                  </div>
                </Card>
             </div>
             {/* AI Cursor Label */}
             <div className="absolute bottom-20 right-20 bg-lime text-black font-mono text-xs px-3 py-1 rounded-full animate-bounce shadow-[0_0_20px_rgba(204,255,0,0.4)]">
                VERIFIED_OWNER ↗
             </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="relative z-10 w-full px-4 sm:px-8 lg:px-12 py-24">
        <div className="mb-16">
          <Badge variant="default" className="mb-4">SYSTEM_ARCHITECTURE</Badge>
          <h2 className="text-4xl lg:text-5xl font-grotesk font-bold uppercase tracking-tight">Institutional Confidence</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[250px]">
          
          {/* Large Card (2x2) */}
          <Card className="md:col-span-2 md:row-span-2 flex flex-col justify-between group">
            <div>
              <Badge variant="verified" showDot>VERIFIED_AUTHENTICITY</Badge>
              <CardTitle className="text-3xl mt-6 uppercase">Zero-Knowledge Proofs</CardTitle>
              <p className="text-text-secondary mt-2 font-mono text-sm max-w-sm">
                Every asset undergoes rigorous origin verification without exposing the underlying data.
              </p>
            </div>
            {/* Fake Data Viz */}
            <div className="h-40 w-full flex items-end gap-2 mt-8 opacity-50 group-hover:opacity-100 transition-opacity">
              {[40, 70, 45, 90, 65, 80, 50, 100].map((h, i) => (
                <div key={i} className="flex-1 bg-lime/20 rounded-t-sm transition-all duration-500 hover:bg-lime" style={{ height: `${h}%` }}></div>
              ))}
            </div>
          </Card>

          {/* Tall Card (1x2) */}
          <Card className="md:row-span-2 flex flex-col justify-between bg-obsidian border-white/10">
            <div>
              <Badge variant="private" showDot>PRIVATE_OWNERSHIP</Badge>
              <CardTitle className="text-2xl mt-6 uppercase">Hold Securely</CardTitle>
            </div>
            <div className="space-y-4">
              <div className="h-24 w-full rounded-xl bg-gradient-to-br from-lime/20 to-transparent border border-lime/30 flex items-center justify-center">
                <span className="font-mono text-lime">HIDDEN_HOLDINGS</span>
              </div>
              <div className="h-16 w-full rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <span className="font-mono text-text-muted">PUBLIC_RECORD</span>
              </div>
            </div>
          </Card>

          {/* Accent Card */}
          <Card className="bg-lime border-lime !text-black group">
            <Badge className="bg-black/10 text-black border-black/20" showDot>COMPLIANCE_READY</Badge>
            <CardTitle className="text-2xl mt-6 uppercase text-black">Programmable Rules</CardTitle>
            <p className="text-black/70 mt-2 font-mono text-xs">
              Automated transfers meeting regulatory requirements natively.
            </p>
          </Card>

          {/* Standard Feature Card */}
          <Card className="flex flex-col justify-between">
             <Badge variant="default">PREMIUM_UX</Badge>
             <div>
               <CardTitle className="text-xl uppercase">Stripe-Level Polish</CardTitle>
               <p className="text-text-secondary mt-2 font-mono text-xs">Familiar interfaces upgraded.</p>
             </div>
          </Card>
        </div>
      </section>

      {/* Explore Section */}
      <section className="relative z-10 w-full px-4 sm:px-8 lg:px-12 py-24 border-t border-white/10">
        <div className="flex justify-between items-end mb-12">
          <div>
            <Badge variant="default" className="mb-4">MARKET_DATA</Badge>
            <h2 className="text-4xl lg:text-5xl font-grotesk font-bold uppercase tracking-tight">Trending Assets</h2>
          </div>
          <Button variant="secondary" className="hidden sm:flex rounded-full">VIEW_ALL -{">"}</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredAssets.map((asset) => (
            <Card key={asset.id} className="p-0 overflow-hidden group cursor-pointer bg-obsidian">
              <div className="h-64 relative bg-black">
                <img src={asset.imageUrl} alt={asset.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105" />
                <div className="absolute top-4 left-4 flex gap-2">
                  {asset.badges.map(b => (
                     <Badge key={b} variant={b as any} showDot className="backdrop-blur-xl bg-black/50 border-white/10">{b}</Badge>
                  ))}
                </div>
              </div>
              <div className="p-6">
                <CardTitle className="text-lg group-hover:text-lime transition-colors">{asset.title}</CardTitle>
                <div className="flex justify-between items-center mt-4 border-t border-white/10 pt-4 font-mono">
                  <span className="text-xs text-text-secondary">{asset.creator}</span>
                  <span className="text-sm text-lime">{asset.price}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Contrast Section */}
      <section className="relative z-20 w-[calc(100%+2rem)] -ml-4 sm:w-[calc(100%+4rem)] sm:-ml-8 lg:w-[calc(100%+4rem)] lg:-ml-8 bg-[#e5e5e5] text-black mt-24 rounded-t-[4rem] px-4 sm:px-8 lg:px-16 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-[1400px] mx-auto">
          <div className="space-y-12">
            <h2 className="text-5xl lg:text-7xl font-grotesk font-bold uppercase tracking-tighter leading-none">
              The Standard <br/> For Verification
            </h2>
            <div className="space-y-8 font-mono">
              {[
                { num: "01", text: "Connect your wallet securely." },
                { num: "02", text: "Mint assets with Zero-Knowledge proofs." },
                { num: "03", text: "Trade privately on a global registry." }
              ].map((step) => (
                <div key={step.num} className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center font-bold text-xl">
                    {step.num}
                  </div>
                  <p className="text-lg uppercase tracking-wide">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-full bg-gray-300 overflow-hidden relative grayscale">
               <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80" alt="Portrait" className="w-full h-full object-cover" />
            </div>
            {/* Glass Testimonial */}
            <div className="absolute -bottom-10 left-10 right-10 bg-white/30 backdrop-blur-xl border border-white/50 rounded-3xl p-6 shadow-2xl">
               <p className="font-grotesk font-medium text-lg leading-tight">"ZERA finally provides the infrastructure needed for institutional capital to enter the digital asset space safely."</p>
               <p className="font-mono text-xs mt-4 uppercase font-bold">— Head of Digital Assets</p>
            </div>
          </div>
        </div>
      </section>

      {/* Massive Footer */}
      <footer className="relative bg-black text-white px-4 sm:px-8 lg:px-12 py-32 overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8 mb-[-2rem] md:mb-[-1.5rem] lg:mb-[-2rem] rounded-b-[2.5rem]">
        {/* Watermark */}
        <div className="absolute top-0 left-0 w-full text-center pointer-events-none select-none">
          <span className="text-[12rem] lg:text-[18rem] font-black font-grotesk opacity-5 tracking-tighter uppercase leading-none">ZERA</span>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center space-y-12">
          <h2 className="text-4xl lg:text-6xl font-grotesk font-bold uppercase tracking-tight max-w-3xl mx-auto">
            Ready to upgrade your ownership?
          </h2>
          <Button variant="primary" size="lg" className="rounded-full text-xl px-12 py-6 h-auto">LAUNCH APP_</Button>
        </div>

        <div className="relative z-10 mt-32 pt-12 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-8 font-mono text-sm text-text-muted">
          <div>
            <p className="mb-4 text-text-primary uppercase font-bold">Protocol</p>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-lime transition-colors">Registry</a></li>
              <li><a href="#" className="hover:text-lime transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-lime transition-colors">Smart Contracts</a></li>
            </ul>
          </div>
          <div>
            <p className="mb-4 text-text-primary uppercase font-bold">Company</p>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-lime transition-colors">About</a></li>
              <li><a href="#" className="hover:text-lime transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-lime transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
          <div className="flex flex-col items-start md:items-end justify-between">
            <div className="flex gap-4 mb-8">
              {/* Social Circles */}
              {[1, 2, 3].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border border-white/20 hover:border-lime hover:bg-lime/10 transition-colors cursor-pointer flex items-center justify-center">
                   <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              ))}
            </div>
            <p>2026 © ZERA NETWORK_</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
