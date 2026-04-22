"use client";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { UploadCloud, Image as ImageIcon } from "lucide-react";

export default function CreateCollection() {
  return (
    <div className="w-full max-w-[800px] mx-auto p-6 md:p-10 pb-32">
      
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-grotesk font-bold uppercase tracking-tight text-text-primary">
          Create a Collection
        </h1>
        <p className="font-mono text-sm text-text-secondary mt-2">
          Deploy a smart contract to group your digital artifacts or tokenized RWAs.
        </p>
      </div>

      <Card className="bg-obsidian border-white/10 p-8">
        <div className="space-y-8">
          
          {/* Logo Image */}
          <div>
            <label className="block font-mono text-[10px] uppercase text-text-secondary mb-2">Logo Image *</label>
            <p className="text-xs text-text-muted mb-4 font-mono">This image will also be used for navigation. 350 x 350 recommended.</p>
            <div className="w-40 h-40 rounded-full border-2 border-dashed border-white/20 bg-black hover:bg-white/5 hover:border-lime/50 transition-colors flex flex-col items-center justify-center cursor-pointer group">
              <UploadCloud className="w-8 h-8 text-text-secondary group-hover:text-lime transition-colors" />
            </div>
          </div>

          {/* Banner Image */}
          <div>
            <label className="block font-mono text-[10px] uppercase text-text-secondary mb-2">Banner Image</label>
            <p className="text-xs text-text-muted mb-4 font-mono">This image will appear at the top of your collection page. 1400 x 350 recommended.</p>
            <div className="w-full h-48 rounded-2xl border-2 border-dashed border-white/20 bg-black hover:bg-white/5 hover:border-lime/50 transition-colors flex flex-col items-center justify-center cursor-pointer group">
              <ImageIcon className="w-8 h-8 text-text-secondary group-hover:text-lime transition-colors mb-2" />
              <span className="font-mono text-xs text-text-secondary group-hover:text-text-primary">Drag & drop or click to upload</span>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            <div>
              <label className="block font-mono text-[10px] uppercase text-text-secondary mb-2">Name *</label>
              <Input placeholder="Example: Neon Nexus" className="h-12 bg-black border-white/10 text-lg" />
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase text-text-secondary mb-2">URL</label>
              <p className="text-xs text-text-muted mb-2 font-mono">Customize your URL on ZERA. Must only contain lowercase letters, numbers, and hyphens.</p>
              <Input placeholder="https://zera.network/collection/your-custom-url" className="h-12 bg-black border-white/10" />
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase text-text-secondary mb-2">Description</label>
              <p className="text-xs text-text-muted mb-2 font-mono">Markdown syntax is supported. 0 of 1000 characters used.</p>
              <textarea rows={5} className="w-full rounded-xl bg-black border border-white/10 p-4 text-sm font-mono text-text-primary focus:outline-none focus:border-lime resize-none"></textarea>
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase text-text-secondary mb-2">Creator Earnings (Royalties)</label>
              <p className="text-xs text-text-muted mb-2 font-mono">Earn a percentage of the sale price every time one of your items is sold. Max 10%.</p>
              <div className="relative w-48">
                <Input placeholder="0" type="number" max="10" className="h-12 bg-black border-white/10 pr-8" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary">%</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="mt-12 pt-8 border-t border-white/5 flex justify-end">
          <Button variant="primary" className="h-12 px-8">
            Create Collection
          </Button>
        </div>
      </Card>

    </div>
  );
}
