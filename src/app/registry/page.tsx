import { Badge } from "../../components/ui/Badge";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { registryData } from "../../data/mockData";
import { Search, SlidersHorizontal } from "lucide-react";

export default function Registry() {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-text_primary">Global Asset Registry</h1>
        <p className="text-text_secondary mt-2 max-w-2xl">
          Explorer and marketplace for cryptographically verified assets. All records are secured by zero-knowledge proofs.
        </p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text_secondary" />
          <Input placeholder="Search by Asset ID, Creator, or Proof Hash..." className="pl-10" />
        </div>
        <Button variant="secondary" className="gap-2">
          <SlidersHorizontal className="w-4 h-4" /> Filters
        </Button>
      </div>

      {/* Table */}
      <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-surface_alt text-text_secondary font-medium border-b border-border">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Asset ID</th>
                <th className="px-6 py-4 whitespace-nowrap">Creator</th>
                <th className="px-6 py-4 whitespace-nowrap">Verification</th>
                <th className="px-6 py-4 whitespace-nowrap">Ownership</th>
                <th className="px-6 py-4 whitespace-nowrap">Compliance</th>
                <th className="px-6 py-4 whitespace-nowrap text-right">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {registryData.map((row) => (
                <tr key={row.id} className="hover:bg-surface_alt/50 transition-colors cursor-pointer">
                  <td className="px-6 py-4 font-medium text-text_primary">{row.id}</td>
                  <td className="px-6 py-4 text-text_secondary">{row.creator}</td>
                  <td className="px-6 py-4">
                    <Badge variant={row.verification === "Verified" ? "verified" : "default"}>
                      {row.verification}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={row.ownership === "Provable" ? "compliant" : "private"}>
                      {row.ownership}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-text_secondary">{row.compliance}</td>
                  <td className="px-6 py-4 text-right text-text_secondary whitespace-nowrap">{row.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-border bg-surface_alt/30 flex items-center justify-between">
          <span className="text-sm text-text_secondary">Showing {registryData.length} entries</span>
          <div className="flex gap-2">
            <Button variant="secondary" disabled className="h-8 px-3 text-xs">Previous</Button>
            <Button variant="secondary" className="h-8 px-3 text-xs">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
