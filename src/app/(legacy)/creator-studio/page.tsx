import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BarChart, Users, Eye, TrendingUp, Download, ArrowUpRight } from "lucide-react";

export default function CreatorStudio() {
  return (
    <div className="w-full max-w-[1600px] mx-auto p-6 md:p-10 pb-32">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-grotesk font-bold uppercase tracking-tight text-text-primary">
            Creator Studio
          </h1>
          <p className="font-mono text-sm text-text-secondary mt-2">
            Analytics and management for your minted collections and fractional drops.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="gap-2 text-xs font-mono">
            <Download className="w-4 h-4" /> EXPORT_REPORT
          </Button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
         <Card className="bg-obsidian border-white/5 p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between text-text-secondary">
               <span className="font-mono text-[10px] uppercase tracking-widest">Total Revenue</span>
               <TrendingUp className="w-4 h-4" />
            </div>
            <span className="font-grotesk text-3xl font-bold text-lime">245.8 ZERA</span>
         </Card>
         <Card className="bg-obsidian border-white/5 p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between text-text-secondary">
               <span className="font-mono text-[10px] uppercase tracking-widest">Secondary Royalties</span>
               <BarChart className="w-4 h-4" />
            </div>
            <span className="font-grotesk text-3xl font-bold">14.2 ZERA</span>
         </Card>
         <Card className="bg-obsidian border-white/5 p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between text-text-secondary">
               <span className="font-mono text-[10px] uppercase tracking-widest">Unique Holders</span>
               <Users className="w-4 h-4" />
            </div>
            <span className="font-grotesk text-3xl font-bold">1,204</span>
         </Card>
         <Card className="bg-obsidian border-white/5 p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between text-text-secondary">
               <span className="font-mono text-[10px] uppercase tracking-widest">Page Views (30d)</span>
               <Eye className="w-4 h-4" />
            </div>
            <span className="font-grotesk text-3xl font-bold">45.2K</span>
         </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left - Performance Chart */}
        <div className="lg:col-span-2">
          <Card className="bg-obsidian border-white/5 p-6 h-full min-h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-grotesk font-bold uppercase tracking-tight">Revenue Over Time</h3>
              <div className="flex gap-2">
                {["1W", "1M", "ALL"].map((tf, i) => (
                  <button key={tf} className={`px-3 py-1 rounded font-mono text-[10px] uppercase tracking-widest ${i === 1 ? 'bg-white/10 text-white' : 'text-text-muted hover:text-white'}`}>
                    {tf}
                  </button>
                ))}
              </div>
            </div>
            {/* Faux Chart Area */}
            <div className="flex-1 w-full flex items-end gap-2 pt-10">
              {[40, 70, 45, 90, 65, 85, 100, 60, 40, 80, 50, 75, 95, 60, 85, 45, 70, 90].map((h, i) => (
                <div key={i} className="flex-1 bg-lime/20 hover:bg-lime/50 transition-colors rounded-t-sm relative group cursor-pointer" style={{ height: `${h}%` }}>
                  {/* Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-black border border-white/10 px-2 py-1 rounded font-mono text-[10px] whitespace-nowrap pointer-events-none transition-opacity z-10">
                    {h * 2.5} ZERA
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 font-mono text-[10px] text-text-muted border-t border-white/5 pt-4">
               <span>Oct 1</span>
               <span>Oct 15</span>
               <span>Oct 31</span>
            </div>
          </Card>
        </div>

        {/* Right - Recent Sales */}
        <div className="lg:col-span-1">
          <Card className="bg-obsidian border-white/5 p-6 h-full min-h-[400px] flex flex-col">
            <h3 className="text-xl font-grotesk font-bold uppercase tracking-tight mb-6">Recent Sales</h3>
            
            <div className="flex-1 overflow-y-auto space-y-2 pr-2 no-scrollbar">
              {[
                { asset: 'Quantum Core #01', amount: '2.4 ZERA', time: '10 mins ago' },
                { asset: 'Neon Nexus Pass', amount: '0.8 ZERA', time: '1 hour ago' },
                { asset: 'Obsidian Sequence #45', amount: '5.0 ZERA', time: '3 hours ago' },
                { asset: 'Quantum Core #88', amount: '2.1 ZERA', time: '5 hours ago' },
                { asset: 'Genesis Key', amount: '12.0 ZERA', time: '1 day ago' },
                { asset: 'Neon Nexus Pass', amount: '0.8 ZERA', time: '2 days ago' },
              ].map((sale, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 cursor-pointer group">
                  <div>
                    <p className="font-grotesk font-bold text-sm group-hover:text-lime transition-colors">{sale.asset}</p>
                    <p className="font-mono text-[10px] text-text-muted">{sale.time}</p>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <p className="font-mono text-sm font-bold text-text-primary">{sale.amount}</p>
                    <ArrowUpRight className="w-3 h-3 text-text-secondary group-hover:text-lime" />
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="secondary" className="w-full mt-4 h-10 text-xs font-mono uppercase bg-white/5 border-none hover:bg-white/10">
              View All
            </Button>
          </Card>
        </div>

      </div>
    </div>
  );
}
