import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Filter, CheckCircle2 } from "lucide-react";
import { topCollections } from '@/data/mockData';
import Link from "next/link";

export default function Collections() {
  return (
    <div className="w-full max-w-[1600px] mx-auto p-6 md:p-10 pb-32">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-grotesk font-bold uppercase tracking-tight text-text-primary">
            Collections
          </h1>
          <p className="font-mono text-sm text-text-secondary mt-2">
            Explore verified digital asset collections and top performers.
          </p>
        </div>
      </div>

      <Card className="bg-obsidian border-white/5 overflow-hidden min-h-[600px] flex flex-col">
        
        {/* Controls */}
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
           <div className="relative w-full sm:w-96">
             <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
             <Input placeholder="Search collections..." className="pl-10 h-10 bg-black border-white/10" />
           </div>
           <div className="flex items-center gap-2 w-full sm:w-auto">
             <Button variant="secondary" className="h-10 text-xs font-mono gap-2 bg-black border-white/10 w-full sm:w-auto">
               <Filter className="w-4 h-4" /> Filters
             </Button>
           </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left font-mono text-sm whitespace-nowrap">
            <thead className="bg-black/50 text-[10px] text-text-secondary uppercase tracking-widest border-b border-white/5">
              <tr>
                <th className="px-6 py-4 font-normal w-16">#</th>
                <th className="px-6 py-4 font-normal">Collection</th>
                <th className="px-6 py-4 font-normal text-right">Floor Price</th>
                <th className="px-6 py-4 font-normal text-right">Volume</th>
                <th className="px-6 py-4 font-normal text-right">24h %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {topCollections.map((col, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors cursor-pointer group">
                  <td className="px-6 py-4 text-text-muted font-bold">{col.rank}</td>
                  <td className="px-6 py-4">
                    <Link href={`/collections/${col.name.toLowerCase().replace(/ /g, '-')}`} className="flex items-center gap-4">
                      <div className="relative shrink-0">
                        <img src={col.avatar} className="w-10 h-10 rounded-lg object-cover border border-white/10" alt={col.name} />
                        {col.verified && (
                          <div className="absolute -bottom-1 -right-1 bg-obsidian rounded-full border border-obsidian">
                            <CheckCircle2 className="w-3 h-3 text-emerald-glow fill-emerald-glow/20" />
                          </div>
                        )}
                      </div>
                      <span className="font-grotesk font-bold text-base group-hover:text-lime transition-colors">{col.name}</span>
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-right font-bold">{col.floor}</td>
                  <td className="px-6 py-4 text-right">{col.volume}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={col.change.startsWith('+') ? 'text-emerald-glow' : 'text-red-500'}>
                      {col.change}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
