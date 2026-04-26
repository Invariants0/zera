"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PieChart, Percent, ArrowRight, ShieldCheck } from "lucide-react";

export default function FractionalizeAsset() {
  return (
    <div className="w-full max-w-[800px] mx-auto p-6 md:p-10 pb-32">
      
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-grotesk font-bold uppercase tracking-tight text-text-primary">
          Fractionalize Asset
        </h1>
        <p className="font-mono text-sm text-text-secondary mt-2">
          Split a verified digital asset (like Music Royalties or Premium Art) into tradable ownership units.
        </p>
      </div>

      <Card className="bg-obsidian border-white/10 p-8">
        <div className="space-y-8">
          
          {/* Asset Selection */}
          <div>
            <label className="block font-mono text-[10px] uppercase text-text-secondary mb-2">Select Target Asset *</label>
            <div className="p-4 rounded-xl border border-white/10 bg-black flex items-center justify-between cursor-pointer hover:border-lime transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?w=100&h=100&fit=crop" className="w-full h-full object-cover" alt="Asset" />
                </div>
                <div>
                  <p className="font-grotesk font-bold text-sm flex items-center gap-1.5">
                    The Obsidian Sequence <ShieldCheck className="w-3.5 h-3.5 text-emerald-glow" />
                  </p>
                  <p className="font-mono text-[10px] text-text-muted">Verified Master Recording</p>
                </div>
              </div>
              <Button variant="secondary" className="h-8 text-xs font-mono group-hover:bg-lime group-hover:text-black group-hover:border-lime">Change</Button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-mono text-[10px] uppercase text-text-secondary mb-2">Total Supply (Fractions) *</label>
              <div className="relative">
                <PieChart className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <Input placeholder="e.g. 10000" type="number" className="h-12 bg-black border-white/10 pl-10" />
              </div>
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase text-text-secondary mb-2">Initial Price per Fraction (ZERA) *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-text-muted text-sm">Z</span>
                <Input placeholder="0.05" type="number" step="0.01" className="h-12 bg-black border-white/10 pl-10" />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase text-text-secondary mb-2">Creator Retained Supply</label>
            <p className="text-xs text-text-muted mb-2 font-mono">Percentage of fractions you will keep in your wallet.</p>
            <div className="relative w-full md:w-1/2">
              <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <Input placeholder="20" type="number" max="100" className="h-12 bg-black border-white/10 pl-10" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-lime/5 border border-lime text-lime font-mono text-xs flex flex-col gap-2">
            <p className="uppercase tracking-widest font-bold text-[10px]">Preview</p>
            <div className="flex justify-between">
              <span>Implied Total Valuation:</span>
              <span className="font-bold">500 ZERA</span>
            </div>
            <div className="flex justify-between">
              <span>Publicly Tradable Fractions:</span>
              <span className="font-bold">8,000</span>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="mt-12 pt-8 border-t border-white/5 flex justify-end">
          <Button variant="primary" className="h-12 px-8 gap-2">
            Deploy Vault <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>

    </div>
  );
}
