import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Search, Filter, Download, ArrowRight, ShieldCheck, Lock } from "lucide-react";
import { registryData } from "../../data/mockData";

export default function Registry() {
  return (
    <div className="w-full max-w-[1600px] mx-auto p-6 md:p-10 pb-32">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-grotesk font-bold uppercase tracking-tight text-text-primary">
            Verified Registry
          </h1>
          <p className="font-mono text-sm text-text-secondary mt-2">
            Immutable log of all verified digital assets, physical tokenizations, and ownership commitments.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="gap-2 text-xs font-mono">
            <Download className="w-4 h-4" /> EXPORT_CSV
          </Button>
        </div>
      </div>

      {/* Network Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
         <Card className="bg-obsidian border-white/5 p-4 flex flex-col justify-between h-24">
            <span className="font-mono text-[10px] text-text-secondary uppercase tracking-widest">Total Verified Assets</span>
            <span className="font-grotesk text-2xl font-bold">142,893</span>
         </Card>
         <Card className="bg-obsidian border-white/5 p-4 flex flex-col justify-between h-24">
            <span className="font-mono text-[10px] text-text-secondary uppercase tracking-widest">Private Ownership (ZK)</span>
            <span className="font-grotesk text-2xl font-bold text-lime">89,210</span>
         </Card>
         <Card className="bg-obsidian border-white/5 p-4 flex flex-col justify-between h-24">
            <span className="font-mono text-[10px] text-text-secondary uppercase tracking-widest">Total Value Locked</span>
            <span className="font-grotesk text-2xl font-bold">$1.42B</span>
         </Card>
         <Card className="bg-obsidian border-white/5 p-4 flex flex-col justify-between h-24">
            <span className="font-mono text-[10px] text-text-secondary uppercase tracking-widest">Latest Block</span>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-emerald-glow animate-pulse-fast"></div>
               <span className="font-mono text-xl font-bold">#14,291,002</span>
            </div>
         </Card>
      </div>

      {/* Table Container */}
      <Card className="bg-obsidian border-white/5 overflow-hidden">
        
        {/* Table Controls */}
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
           <div className="relative w-full sm:w-96">
             <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
             <Input placeholder="Search by Asset ID, Creator, or Contract Address" className="pl-10 h-10 bg-black border-white/10" />
           </div>
           <div className="flex items-center gap-2 w-full sm:w-auto">
             <Button variant="secondary" className="h-10 text-xs font-mono gap-2 bg-black border-white/10 w-full sm:w-auto">
               <Filter className="w-4 h-4" /> Filters
             </Button>
           </div>
        </div>

        {/* Etherscan Style Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-sm whitespace-nowrap">
            <thead className="bg-black/50 text-[10px] text-text-secondary uppercase tracking-widest border-b border-white/5">
              <tr>
                <th className="px-6 py-4 font-normal">Asset ID</th>
                <th className="px-6 py-4 font-normal">Creator</th>
                <th className="px-6 py-4 font-normal">Verification</th>
                <th className="px-6 py-4 font-normal">Ownership</th>
                <th className="px-6 py-4 font-normal">Compliance</th>
                <th className="px-6 py-4 font-normal">Updated</th>
                <th className="px-6 py-4 font-normal text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {registryData.map((row, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors cursor-pointer group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-lime group-hover:underline">
                      <ShieldCheck className="w-4 h-4" />
                      {row.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-text-secondary">{row.creator}</td>
                  <td className="px-6 py-4">
                    <Badge variant={row.verification === 'Verified' ? 'verified' : 'default'} className="px-2 py-0.5 text-[10px] border-none">
                      {row.verification}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {row.ownership === 'Private' ? <Lock className="w-3 h-3 text-lime" /> : <ShieldCheck className="w-3 h-3 text-text-secondary" />}
                      <span className={row.ownership === 'Private' ? 'text-lime' : 'text-text-secondary'}>{row.ownership}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-text-secondary">{row.compliance}</td>
                  <td className="px-6 py-4 text-text-muted">{row.updated}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 rounded-lg bg-white/5 hover:bg-lime hover:text-black transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-white/5 flex items-center justify-between font-mono text-[10px] text-text-muted">
           <span>Showing 1 to 4 of 142,893 entries</span>
           <div className="flex gap-1">
             <button className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors">Prev</button>
             <button className="px-3 py-1 rounded bg-white/10 text-text-primary transition-colors">1</button>
             <button className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors">2</button>
             <button className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors">3</button>
             <span className="px-3 py-1">...</span>
             <button className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors">Next</button>
           </div>
        </div>

      </Card>
    </div>
  );
}
