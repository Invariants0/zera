"use client";

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Calendar, Clock, Image as ImageIcon, Rocket } from "lucide-react";

export default function LaunchDrop() {
  return (
    <div className="w-full max-w-[800px] mx-auto p-6 md:p-10 pb-32">
      
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-grotesk font-bold uppercase tracking-tight text-text-primary">
          Launch Drop
        </h1>
        <p className="font-mono text-sm text-text-secondary mt-2">
          Configure a timed release schedule for your new verified digital collection.
        </p>
      </div>

      <Card className="bg-obsidian border-white/10 p-8">
        <div className="space-y-8">
          
          {/* Collection Selection */}
          <div>
            <label className="block font-mono text-[10px] uppercase text-text-secondary mb-2">Select Collection *</label>
            <div className="p-4 rounded-xl border border-white/10 bg-black flex items-center justify-between cursor-pointer hover:border-lime transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                   <ImageIcon className="w-5 h-5 text-text-muted" />
                </div>
                <div>
                  <p className="font-grotesk font-bold text-sm text-text-muted">No collection selected</p>
                </div>
              </div>
              <Button variant="secondary" className="h-8 text-xs font-mono">Select</Button>
            </div>
          </div>

          {/* Pricing */}
          <div>
            <label className="block font-mono text-[10px] uppercase text-text-secondary mb-2">Mint Price (ZERA) *</label>
            <div className="relative w-full md:w-1/2">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-text-muted text-sm">Z</span>
              <Input placeholder="0.1" type="number" step="0.01" className="h-12 bg-black border-white/10 pl-10" />
            </div>
          </div>

          {/* Schedule */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-mono text-[10px] uppercase text-text-secondary mb-2">Start Date *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <Input type="date" className="h-12 bg-black border-white/10 pl-10 font-mono text-sm" />
              </div>
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase text-text-secondary mb-2">Start Time *</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <Input type="time" className="h-12 bg-black border-white/10 pl-10 font-mono text-sm" />
              </div>
            </div>
          </div>

          {/* Limits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-mono text-[10px] uppercase text-text-secondary mb-2">Max Mints Per Wallet</label>
              <Input placeholder="Leave empty for no limit" type="number" className="h-12 bg-black border-white/10" />
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="mt-12 pt-8 border-t border-white/5 flex justify-end">
          <Button variant="primary" className="h-12 px-8 gap-2">
            Schedule Drop <Rocket className="w-4 h-4" />
          </Button>
        </div>
      </Card>

    </div>
  );
}
