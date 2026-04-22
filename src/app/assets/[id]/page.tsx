import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { CheckCircle2, ShieldCheck, Lock, Check, History, Wallet, FileKey } from "lucide-react";

export default function AssetDetail() {
  return (
    <div className="w-full max-w-[1400px] mx-auto p-6 md:p-10 pb-32">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-text-muted mb-8">
        <span>Explore</span>
        <span>/</span>
        <span className="text-lime">Neon Nexus Orb</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left - Media Preview */}
        <div className="flex flex-col gap-6">
          <div className="w-full aspect-square rounded-[2rem] bg-obsidian border border-white/5 overflow-hidden relative group">
            <img 
              src="https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=1000&auto=format&fit=crop" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              alt="Asset"
            />
            {/* Overlay Badges */}
            <div className="absolute top-6 left-6 flex flex-col gap-3">
              <Badge variant="verified" className="backdrop-blur-xl bg-obsidian/60" showDot>VERIFIED_ASSET</Badge>
              <Badge variant="private" className="backdrop-blur-xl bg-obsidian/60" showDot>PRIVATE_OWNER</Badge>
            </div>
            
            {/* View Fullscreen */}
            <div className="absolute bottom-6 right-6">
               <Button variant="secondary" size="icon" className="rounded-xl bg-obsidian/60 backdrop-blur-xl border-white/10 hover:bg-obsidian">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
               </Button>
            </div>
          </div>
        </div>

        {/* Right - Metadata & Proof Panel */}
        <div className="flex flex-col gap-8">
          
          {/* Header */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs uppercase text-text-secondary">Institutional Vault</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-glow" />
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="icon" className="rounded-xl h-10 w-10 border-white/5"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg></Button>
                <Button variant="secondary" size="icon" className="rounded-xl h-10 w-10 border-white/5"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></Button>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-grotesk font-bold uppercase tracking-tight text-text-primary mb-2">
              Neon Nexus Orb
            </h1>
            <p className="text-text-secondary mt-4 max-w-lg">
              A highly restricted digital artifact governed by Zero-Knowledge rulesets. Ownership is provable yet entirely private on the public registry.
            </p>
          </div>

          {/* Pricing Box */}
          <div className="rounded-[1.5rem] bg-obsidian border border-white/5 p-6 flex flex-col gap-6">
            <div className="flex justify-between items-end">
              <div>
                <p className="font-mono text-[10px] text-text-muted uppercase tracking-widest mb-2">Current Price</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-grotesk font-bold text-lime">15.0 ZERA</span>
                  <span className="font-mono text-sm text-text-secondary">$45,210.00</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono text-[10px] text-text-muted uppercase tracking-widest mb-1">Owner</p>
                <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-1.5 border border-white/5">
                  <Lock className="w-3 h-3 text-lime" />
                  <span className="font-mono text-xs">Hidden (ZK)</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/5">
              <Button variant="primary" className="flex-1 rounded-xl h-14 text-base gap-2">
                <Wallet className="w-5 h-5" /> Buy Now
              </Button>
              <Button variant="secondary" className="flex-1 rounded-xl h-14 text-base gap-2">
                Make Offer
              </Button>
            </div>
          </div>

          {/* ZK Proof Panel (Critical Component) */}
          <Card className="bg-obsidian border-white/5 p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
              <h3 className="font-grotesk font-bold uppercase tracking-wide flex items-center gap-2">
                <FileKey className="w-5 h-5 text-lime" /> Proof Verification Panel
              </h3>
              <Badge className="bg-emerald-glow/10 text-emerald-glow border-none" showDot>ALL_VALID</Badge>
            </div>

            <div className="space-y-4 font-mono text-xs">
              {[
                { title: 'Authenticity Verified', desc: 'Asset originated from authorized creator.', icon: ShieldCheck, status: 'VERIFIED', color: 'text-emerald-glow' },
                { title: 'Ownership Provable', desc: 'Current owner holds valid ZK proof.', icon: Lock, status: 'PROVABLE', color: 'text-lime' },
                { title: 'Transfer Eligible', desc: 'Complies with all automated restrictions.', icon: Check, status: 'ELIGIBLE', color: 'text-emerald-glow' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className={`mt-0.5 p-1.5 rounded-md bg-white/5 ${item.color}`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-text-primary uppercase mb-1">{item.title}</p>
                    <p className="text-text-secondary text-[10px]">{item.desc}</p>
                  </div>
                  <div className="font-bold tracking-widest text-[10px] bg-white/5 px-2 py-1 rounded border border-white/5 mt-1">
                    {item.status}
                  </div>
                </div>
              ))}
              
              <Button variant="ghost" className="w-full mt-4 h-10 border border-dashed border-white/10 hover:border-lime/30 text-[10px] tracking-widest uppercase">
                View On-Chain Proofs
              </Button>
            </div>
          </Card>

          {/* Tabs */}
          <div className="mt-4">
             <div className="flex items-center gap-8 border-b border-white/10 font-mono text-[10px] uppercase tracking-widest overflow-x-auto pb-4">
                <button className="text-lime border-b-2 border-lime pb-4 -mb-4 font-bold whitespace-nowrap">Item Details</button>
                <button className="text-text-secondary hover:text-text-primary pb-4 -mb-4 transition-colors whitespace-nowrap">History</button>
                <button className="text-text-secondary hover:text-text-primary pb-4 -mb-4 transition-colors whitespace-nowrap">Offers (3)</button>
                <button className="text-text-secondary hover:text-text-primary pb-4 -mb-4 transition-colors whitespace-nowrap">Proof Logs</button>
             </div>
             
             <div className="py-6 font-mono text-sm text-text-secondary space-y-4">
               <div className="flex justify-between py-2 border-b border-white/5">
                 <span>Contract Address</span>
                 <span className="text-lime">0x7F...3A19</span>
               </div>
               <div className="flex justify-between py-2 border-b border-white/5">
                 <span>Token ID</span>
                 <span>#8492</span>
               </div>
               <div className="flex justify-between py-2 border-b border-white/5">
                 <span>Token Standard</span>
                 <span>ZK-ERC721</span>
               </div>
               <div className="flex justify-between py-2 border-b border-white/5">
                 <span>Blockchain</span>
                 <span>Midnight Network</span>
               </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
