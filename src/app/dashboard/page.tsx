import { Card, CardContent, CardTitle } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { 
  TrendingUp, 
  Wallet, 
  ShieldCheck, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  Activity,
  Plus,
  FileKey
} from "lucide-react";
import { featuredAssets } from "../../data/mockData";

export default function Dashboard() {
  return (
    <div className="w-full max-w-[1400px] mx-auto p-6 md:p-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-grotesk font-bold uppercase tracking-tight text-text-primary">
            Dashboard
          </h1>
          <p className="font-mono text-sm text-text-secondary mt-1">Manage your verified assets and proofs.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="gap-2 h-10 px-4 text-xs">
            <FileKey className="w-4 h-4" /> GENERATE_PROOF
          </Button>
          <Button variant="primary" className="gap-2 h-10 px-4 text-xs rounded-full">
            <Plus className="w-4 h-4" /> MINT_ASSET
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-white/10 mb-8 font-mono text-xs uppercase overflow-x-auto pb-4">
        <button className="text-lime border-b-2 border-lime pb-4 -mb-4 font-bold whitespace-nowrap">OVERVIEW</button>
        <button className="text-text-secondary hover:text-text-primary pb-4 -mb-4 transition-colors whitespace-nowrap">HOLDINGS</button>
        <button className="text-text-secondary hover:text-text-primary pb-4 -mb-4 transition-colors whitespace-nowrap">ANALYTICS</button>
        <button className="text-text-secondary hover:text-text-primary pb-4 -mb-4 transition-colors whitespace-nowrap">CREATOR_MODE</button>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        <Card className="bg-obsidian border-white/5 p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-text-secondary text-[10px] tracking-widest uppercase">Portfolio_Value</span>
            <div className="p-1.5 bg-white/5 rounded-md border border-white/5">
              <Wallet className="w-3.5 h-3.5 text-lime" />
            </div>
          </div>
          <p className="text-2xl font-grotesk font-bold">142.5 ZERA</p>
          <div className="flex items-center gap-1.5 mt-3 text-emerald-glow text-xs font-mono">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+12.4% (30d)</span>
          </div>
        </Card>

        <Card className="bg-obsidian border-white/5 p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-text-secondary text-[10px] tracking-widest uppercase">Assets_Owned</span>
            <div className="p-1.5 bg-white/5 rounded-md border border-white/5">
              <ShieldCheck className="w-3.5 h-3.5 text-lime" />
            </div>
          </div>
          <p className="text-2xl font-grotesk font-bold">24</p>
          <div className="flex items-center gap-2 mt-3 text-text-secondary text-xs font-mono">
            <span className="text-lime">18 Verified</span>
            <span>· 6 Pending</span>
          </div>
        </Card>

        <Card className="bg-obsidian border-white/5 p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-text-secondary text-[10px] tracking-widest uppercase">Pending_Offers</span>
            <div className="p-1.5 bg-white/5 rounded-md border border-white/5">
              <Clock className="w-3.5 h-3.5 text-lime" />
            </div>
          </div>
          <p className="text-2xl font-grotesk font-bold">3</p>
          <div className="flex items-center gap-2 mt-3 text-text-secondary text-xs font-mono">
            <span>Total: 45.2 ZERA</span>
          </div>
        </Card>

        <Card className="bg-lime border-lime !text-black flex flex-col justify-between group cursor-pointer relative overflow-hidden p-5">
          <div className="absolute inset-0 bg-grid-pattern bg-grid-60 opacity-10 pointer-events-none mix-blend-overlay"></div>
          <div className="flex justify-between items-start z-10">
            <Badge className="bg-black/10 text-black border-black/20 px-2 py-0.5 text-[10px]" showDot>TRUST_SCORE</Badge>
            <Activity className="w-4 h-4 text-black" />
          </div>
          <div className="z-10 mt-4">
            <p className="text-3xl font-grotesk font-bold text-black">98.5%</p>
            <p className="font-mono text-[10px] uppercase mt-1 text-black/70">Top 5% of Traders</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Area */}
        <Card className="lg:col-span-2 bg-obsidian border-white/5 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-8">
             <div>
               <h3 className="text-lg font-bold uppercase font-grotesk">Portfolio Performance</h3>
               <p className="font-mono text-[10px] text-text-secondary mt-1 uppercase tracking-wider">Value over time (90 Days)</p>
             </div>
             <div className="flex bg-white/5 rounded-lg p-1 border border-white/5">
                {['1W', '1M', '3M', '1Y'].map((t, i) => (
                  <button key={t} className={`px-3 py-1 font-mono text-[10px] rounded-md ${i === 2 ? 'bg-white/10 text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}>
                    {t}
                  </button>
                ))}
             </div>
          </div>
          
          <div className="flex-1 min-h-[250px] w-full relative flex items-end gap-1 px-4 border-b border-l border-white/5 pb-2 pl-4 mt-auto">
            <div className="absolute left-[-28px] top-0 h-full flex flex-col justify-between font-mono text-[9px] text-text-muted pb-2">
              <span>150</span>
              <span>100</span>
              <span>50</span>
              <span>0</span>
            </div>
            {Array.from({ length: 45 }).map((_, i) => {
              const height = 20 + Math.random() * 70;
              const isAccent = i === 44;
              return (
                <div 
                  key={i} 
                  className={`flex-1 rounded-t-[2px] transition-all duration-300 hover:opacity-100 ${isAccent ? 'bg-lime' : 'bg-white/10 hover:bg-lime/50'}`}
                  style={{ height: `${height}%` }}
                ></div>
              );
            })}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-obsidian border-white/5 p-6 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold uppercase font-grotesk">Recent Activity</h3>
            <Button variant="ghost" size="sm" className="font-mono text-[10px]">VIEW_ALL</Button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2 no-scrollbar">
            {[
              { type: 'Listed', asset: 'Quantum Core Alpha', price: '2.4 ZERA', time: '2h ago', icon: TrendingUp },
              { type: 'Minted', asset: 'Neon Nexus Orb', price: '--', time: '5h ago', icon: Plus },
              { type: 'Sold', asset: 'Cyberspace Fragment', price: '0.8 ZERA', time: '1d ago', icon: Wallet },
              { type: 'Proof Gen', asset: 'Zero-Knowledge Artifact', price: '--', time: '2d ago', icon: FileKey },
              { type: 'Listed', asset: 'Cypher Punk #002', price: '12 ZERA', time: '3d ago', icon: TrendingUp },
            ].map((activity, i) => {
              const Icon = activity.icon;
              return (
                <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                  <div className="w-8 h-8 rounded-md bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5 text-text-secondary group-hover:text-lime transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-[10px] text-text-secondary uppercase">{activity.type}</p>
                    <p className="font-grotesk font-semibold text-sm truncate">{activity.asset}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-mono text-xs text-lime">{activity.price}</p>
                    <p className="font-mono text-[9px] text-text-muted">{activity.time}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
