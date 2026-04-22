import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Search, Filter, TrendingUp, Plus, Wallet, FileKey, ShieldCheck } from "lucide-react";

const activityData = [
  { type: 'Listed', asset: 'Quantum Core Alpha', price: '2.4 ZERA', time: '2 mins ago', from: '0x7F...3A19', to: '--', icon: TrendingUp },
  { type: 'Minted', asset: 'Neon Nexus Orb', price: '--', time: '15 mins ago', from: 'NullAddress', to: 'Institutional Vault', icon: Plus },
  { type: 'Sold', asset: 'Cyberspace Fragment', price: '0.8 ZERA', time: '1 hour ago', from: '0x99...EE10', to: 'EarthDAO', icon: Wallet },
  { type: 'Proof Gen', asset: 'Zero-Knowledge Artifact', price: '--', time: '2 hours ago', from: 'ZK-Labs', to: '--', icon: FileKey },
  { type: 'Verified', asset: 'Cypher Punk #002', price: '--', time: '5 hours ago', from: 'System', to: '--', icon: ShieldCheck },
  { type: 'Listed', asset: 'Manhattan Prime Fraction', price: '120 ZERA', time: '1 day ago', from: '0x2B...9C44', to: '--', icon: TrendingUp },
  { type: 'Sold', asset: 'Doodles #8921', price: '7.8 ETH', time: '1 day ago', from: '0x1A...8B22', to: '0x7F...3A19', icon: Wallet },
];

export default function Activity() {
  return (
    <div className="w-full max-w-[1200px] mx-auto p-6 md:p-10 pb-32">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-grotesk font-bold uppercase tracking-tight text-text-primary">
            Market Activity
          </h1>
          <p className="font-mono text-sm text-text-secondary mt-2">
            Real-time feed of all marketplace events, proofs, and transfers.
          </p>
        </div>
      </div>

      <Card className="bg-obsidian border-white/5 overflow-hidden flex flex-col min-h-[600px]">
        
        {/* Controls */}
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
           <div className="relative w-full sm:w-96">
             <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
             <Input placeholder="Search activity..." className="pl-10 h-10 bg-black border-white/10" />
           </div>
           <div className="flex items-center gap-2 w-full sm:w-auto">
             <Button variant="secondary" className="h-10 text-xs font-mono gap-2 bg-black border-white/10 w-full sm:w-auto">
               <Filter className="w-4 h-4" /> Filter Event Types
             </Button>
           </div>
        </div>

        {/* Feed */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left font-mono text-sm whitespace-nowrap">
            <thead className="bg-black/50 text-[10px] text-text-secondary uppercase tracking-widest border-b border-white/5">
              <tr>
                <th className="px-6 py-4 font-normal">Event</th>
                <th className="px-6 py-4 font-normal">Item</th>
                <th className="px-6 py-4 font-normal">Price</th>
                <th className="px-6 py-4 font-normal">From</th>
                <th className="px-6 py-4 font-normal">To</th>
                <th className="px-6 py-4 font-normal text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {activityData.map((row, i) => {
                const Icon = row.icon;
                return (
                  <tr key={i} className="hover:bg-white/5 transition-colors cursor-pointer group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
                          <Icon className="w-3.5 h-3.5 text-text-secondary group-hover:text-lime transition-colors" />
                        </div>
                        <span className="text-text-primary uppercase text-[10px] tracking-widest">{row.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-grotesk font-bold text-sm group-hover:text-lime transition-colors">{row.asset}</span>
                    </td>
                    <td className="px-6 py-4 text-lime">{row.price}</td>
                    <td className="px-6 py-4 text-text-secondary">{row.from}</td>
                    <td className="px-6 py-4 text-text-secondary">{row.to}</td>
                    <td className="px-6 py-4 text-right text-text-muted text-xs">{row.time}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
