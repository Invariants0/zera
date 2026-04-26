import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Search, Filter, Download, FileKey, CheckCircle2, XCircle } from "lucide-react";

const logsData = [
  { id: "PR-8921", asset: "Quantum Core Alpha", type: "Authenticity", user: "0x7F...3A19", time: "10 mins ago", status: "Success" },
  { id: "PR-8920", asset: "Manhattan Prime Fraction", type: "Ownership (ZK)", user: "Hidden", time: "1 hour ago", status: "Success" },
  { id: "PR-8919", asset: "Neon Nexus Orb", type: "Transfer Eligibility", user: "Institutional Vault", time: "3 hours ago", status: "Failed" },
  { id: "PR-8918", asset: "Zero-Knowledge Artifact", type: "Metadata Integrity", user: "ZK-Labs", time: "5 hours ago", status: "Success" },
  { id: "PR-8917", asset: "Cyberspace Fragment", type: "Authenticity", user: "0x99...EE10", time: "1 day ago", status: "Success" },
  { id: "PR-8916", asset: "Cypher Punk #002", type: "Ownership (ZK)", user: "Hidden", time: "2 days ago", status: "Success" },
];

export default function ProofLogs() {
  return (
    <div className="w-full max-w-[1600px] mx-auto p-6 md:p-10 pb-32">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-grotesk font-bold uppercase tracking-tight text-text-primary">
            Proof Logs
          </h1>
          <p className="font-mono text-sm text-text-secondary mt-2">
            Immutable audit trail of all Zero-Knowledge proofs generated and verified on the network.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="gap-2 text-xs font-mono">
            <Download className="w-4 h-4" /> EXPORT_CSV
          </Button>
        </div>
      </div>

      <Card className="bg-obsidian border-white/5 overflow-hidden min-h-[600px] flex flex-col">
        
        {/* Controls */}
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
           <div className="relative w-full sm:w-96">
             <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
             <Input placeholder="Search by Proof ID, Asset, or User..." className="pl-10 h-10 bg-black border-white/10" />
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
                <th className="px-6 py-4 font-normal">Proof ID</th>
                <th className="px-6 py-4 font-normal">Asset</th>
                <th className="px-6 py-4 font-normal">Proof Type</th>
                <th className="px-6 py-4 font-normal">Requester</th>
                <th className="px-6 py-4 font-normal">Timestamp</th>
                <th className="px-6 py-4 font-normal text-right">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {logsData.map((row, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors cursor-pointer group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-text-primary group-hover:text-lime transition-colors">
                      <FileKey className="w-4 h-4" />
                      {row.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-grotesk font-bold text-sm">{row.asset}</td>
                  <td className="px-6 py-4 text-text-secondary">{row.type}</td>
                  <td className="px-6 py-4 text-text-secondary">{row.user}</td>
                  <td className="px-6 py-4 text-text-muted text-xs">{row.time}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {row.status === 'Success' ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-glow" />
                          <span className="text-emerald-glow uppercase tracking-widest text-[10px] font-bold">VALID</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-red-500" />
                          <span className="text-red-500 uppercase tracking-widest text-[10px] font-bold">FAILED</span>
                        </>
                      )}
                    </div>
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
