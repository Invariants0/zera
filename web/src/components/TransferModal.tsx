"use client";

import { useState } from "react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { ArrowRightLeft, X } from "lucide-react";
import toast from "react-hot-toast";

interface TransferModalProps {
  assetId: string;
  assetTitle: string;
  currentOwner: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function TransferModal({ assetId, assetTitle, currentOwner, onClose, onSuccess }: TransferModalProps) {
  const [recipient, setRecipient] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);

  const handleTransfer = async () => {
    if (!recipient.trim()) {
      toast.error("Please enter a recipient address");
      return;
    }

    setIsTransferring(true);
    const tid = toast.loading("Initiating ownership transfer on Midnight...");

    try {
      const res = await fetch(`/api/assets/${assetId}/transfer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: currentOwner,
          to: recipient.trim(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Ownership transferred successfully!", { id: tid });
        onSuccess();
        onClose();
      } else {
        toast.error(data.message || "Transfer failed", { id: tid });
      }
    } catch (error) {
      toast.error("Transfer failed", { id: tid });
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <Card className="w-full max-w-md bg-obsidian border-white/10 p-6 relative animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-lime/10 rounded-lg">
            <ArrowRightLeft className="w-6 h-6 text-lime" />
          </div>
          <div>
            <h2 className="text-xl font-grotesk font-bold uppercase tracking-tight">Transfer Ownership</h2>
            <p className="text-xs font-mono text-text-muted">{assetTitle}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block font-mono text-[10px] text-text-muted uppercase mb-2">Recipient Address</label>
            <Input 
              placeholder="mn_shield-addr..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="bg-black border-white/10"
              disabled={isTransferring}
            />
            <p className="mt-2 text-[10px] font-mono text-text-muted">
              Enter the Midnight wallet address of the new owner.
            </p>
          </div>

          <div className="pt-4 flex gap-3">
            <Button 
              variant="secondary" 
              className="flex-1 border-white/10" 
              onClick={onClose}
              disabled={isTransferring}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              className="flex-1" 
              onClick={handleTransfer}
              disabled={isTransferring || !recipient.trim()}
            >
              {isTransferring ? "Processing..." : "Transfer"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
