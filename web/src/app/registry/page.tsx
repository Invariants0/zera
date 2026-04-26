"use client";

import { useEffect, useState } from "react";
import type React from "react";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Input } from "../../components/ui/Input";
import { Search, Shield } from "lucide-react";
import { getRegistryEntries } from "../../services/marketplace";
import type { RegistryEntry } from "../../services/marketplace";
import { Loading } from "../../components/ui/Loading";
import { EmptyState } from "../../components/ui/EmptyState";

export default function Registry() {
  const [entries, setEntries] = useState<RegistryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.currentTarget.value);
  };

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        setLoading(true);
        const data = await getRegistryEntries();
        setEntries(data);
      } catch (err) {
        setError('Failed to load registry entries');
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  const filteredEntries = entries.filter(entry =>
    entry.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.creator.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-[1600px] mx-auto p-6 md:p-10 pb-32">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-grotesk font-bold uppercase tracking-tight mb-2">
          Asset Registry
        </h1>
        <p className="font-mono text-sm text-text-secondary">
          Verified on-chain registry of all digital assets with cryptographic proof of ownership.
        </p>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <Input
            placeholder="Search by ID or creator..."
            className="pl-10 bg-obsidian border-white/10"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <Card className="bg-obsidian border-white/10 overflow-hidden">
        {loading ? (
          <Loading text="Loading registry..." />
        ) : error ? (
          <EmptyState
            icon={Shield}
            title="Failed to Load Registry"
            description={error}
          />
        ) : filteredEntries.length === 0 ? (
          <EmptyState
            icon={Shield}
            title="No Entries Found"
            description="Try adjusting your search query"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left p-4 font-mono text-[10px] text-text-muted uppercase tracking-widest">Asset ID</th>
                  <th className="text-left p-4 font-mono text-[10px] text-text-muted uppercase tracking-widest">Creator</th>
                  <th className="text-left p-4 font-mono text-[10px] text-text-muted uppercase tracking-widest">Verification</th>
                  <th className="text-left p-4 font-mono text-[10px] text-text-muted uppercase tracking-widest">Ownership</th>
                  <th className="text-left p-4 font-mono text-[10px] text-text-muted uppercase tracking-widest">Compliance</th>
                  <th className="text-left p-4 font-mono text-[10px] text-text-muted uppercase tracking-widest">Updated</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry) => (
                  <tr key={entry.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono text-sm text-lime">{entry.id}</td>
                    <td className="p-4 font-mono text-sm text-text-primary">{entry.creator}</td>
                    <td className="p-4">
                      <Badge
                        variant={entry.verification === 'Verified' ? 'verified' : 'default'}
                        className="text-[10px]"
                      >
                        {entry.verification}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={entry.ownership === 'Private' ? 'private' : 'default'}
                        className="text-[10px]"
                      >
                        {entry.ownership}
                      </Badge>
                    </td>
                    <td className="p-4 font-mono text-xs text-text-secondary">{entry.compliance}</td>
                    <td className="p-4 font-mono text-xs text-text-secondary">{entry.updated}</td>
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
