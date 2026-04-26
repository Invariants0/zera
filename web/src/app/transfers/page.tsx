"use client";

import { useEffect, useState } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Search, Filter, ArrowRightLeft, Download, RefreshCw } from "lucide-react";
import { EmptyState } from "../../components/ui/EmptyState";
import { Loading } from "../../components/ui/Loading";

type TransferRow = {
  id: string; txHash: string; asset: string; assetId: string;
  from: string; to: string; value: string; type: string; status: string; time: string;
};

export default function Transfers() {
  const [rows, setRows] = useState<TransferRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/transfers');
      setRows(await res.json());
    } catch { setRows([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = rows.filter((r) =>
    r.txHash.toLowerCase().includes(search.toLowerCase()) ||
    r.asset.toLowerCase().includes(search.toLowerCase()) ||
    r.from.toLowerCase().includes(search.toLowerCase()) ||
    r.to.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="w-full max-w-[1600px] mx-auto p-6 md:p-10 pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-grotesk font-bold uppercase tracking-tight text-text-primary">Transfer History</h1>
          <p className="font-mono text-sm text-text-secondary mt-2">Immutable log of all ownership transfers and settlement executions.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="gap-2 text-xs font-mono" onClick={fetchData}>
            <RefreshCw className="w-4 h-4" /> REFRESH
          </Button>
          <Button variant="secondary" className="gap-2 text-xs font-mono">
            <Download className="w-4 h-4" /> EXPORT_CSV
          </Button>
        </div>
      </div>

      <Card className="bg-obsidian border-white/5 overflow-hidden min-h-[600px] flex flex-col">
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <Input placeholder="Search by TxHash, Address, or Asset..." className="pl-10 h-10 bg-black border-white/10"
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        {loading ? <Loading text="Loading transfer history..." /> :
          filtered.length === 0 ? (
            <EmptyState icon={ArrowRightLeft} title="No Transfers Yet" description="Ownership transfers will appear here after assets are traded or transferred." />
          ) : (
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left font-mono text-sm whitespace-nowrap">
                <thead className="bg-black/50 text-[10px] text-text-secondary uppercase tracking-widest border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4 font-normal">TxHash</th>
                    <th className="px-6 py-4 font-normal">Asset</th>
                    <th className="px-6 py-4 font-normal">From</th>
                    <th className="px-6 py-4 font-normal">To</th>
                    <th className="px-6 py-4 font-normal">Value</th>
                    <th className="px-6 py-4 font-normal">Type</th>
                    <th className="px-6 py-4 font-normal text-right">Age</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered.map((row) => (
                    <tr key={row.id} className="hover:bg-white/5 transition-colors cursor-pointer group">
                      <td className="px-6 py-4">
                        {row.txHash && row.txHash !== `0x${row.id.replace('act-', '')}` ? (
                          <a href={`https://testnet.explorer.midnight.network/transactions/${row.txHash}`}
                            target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 text-lime hover:underline">
                            <ArrowRightLeft className="w-4 h-4" />
                            {row.txHash.slice(0, 16)}...
                          </a>
                        ) : (
                          <div className="flex items-center gap-2 text-text-secondary">
                            <ArrowRightLeft className="w-4 h-4" />
                            {row.txHash.slice(0, 16)}...
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-grotesk font-bold text-sm">{row.asset}</td>
                      <td className="px-6 py-4 text-text-secondary">{row.from.slice(0, 12)}...</td>
                      <td className="px-6 py-4 text-text-secondary">{row.to.slice(0, 12)}...</td>
                      <td className="px-6 py-4 text-text-primary">{row.value}</td>
                      <td className="px-6 py-4">
                        <span className="text-lime uppercase tracking-widest text-[10px] font-bold bg-lime/10 px-2 py-1 rounded">{row.type}</span>
                      </td>
                      <td className="px-6 py-4 text-right text-text-muted text-xs">
                        {new Date(row.time).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </Card>
    </div>
  );
}
