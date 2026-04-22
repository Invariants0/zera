"use client";

import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownRight, Link as LinkIcon, Unlink } from "lucide-react";

export default function WalletPage() {
  return (
    <div className="w-full max-w-[1200px] mx-auto p-6 md:p-10 pb-32">
      
      <div className="mb-12">
        <h1 className="text-3xl font-grotesk font-bold uppercase tracking-tight text-text-primary">
          Wallet Management
        </h1>
        <p className="font-mono text-sm text-text-secondary mt-2">
          Manage your connected accounts, balances, and recent transactions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left - Active Wallet */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-lime border-lime !text-black p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern bg-grid-60 opacity-10 pointer-events-none mix-blend-overlay"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <Badge className="bg-black/10 text-black border-black/20" showDot>PRIMARY_WALLET</Badge>
                <WalletIcon className="w-5 h-5 text-black/50" />
              </div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-black/70 mb-1">Total Balance</p>
              <h2 className="font-grotesk text-4xl font-bold mb-6">142.5 ZERA</h2>
              <div className="font-mono text-xs bg-black/5 rounded-lg p-3 border border-black/10 break-all">
                0x7F2C9B3D8A1E6F40A5B2C9D3E8F1A7B4C0D9E5F2
              </div>
            </div>
          </Card>

          <Card className="bg-obsidian border-white/5 p-6">
            <h3 className="font-grotesk font-bold uppercase mb-4">Connected Accounts</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                  </div>
                  <div>
                    <p className="font-mono text-xs text-text-primary">MetaMask</p>
                    <p className="font-mono text-[10px] text-text-muted">0x7F...3A19</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-text-secondary hover:text-red-500 hover:bg-red-500/10">
                  <Unlink className="w-4 h-4" />
                </Button>
              </div>
              
              <Button variant="secondary" className="w-full border-dashed border-white/20 gap-2">
                <LinkIcon className="w-4 h-4" /> Link New Wallet
              </Button>
            </div>
          </Card>
        </div>

        {/* Right - Transactions */}
        <div className="lg:col-span-2">
          <Card className="bg-obsidian border-white/5 p-6 min-h-[600px] flex flex-col">
            <h3 className="text-xl font-grotesk font-bold uppercase tracking-tight mb-6">Recent Transactions</h3>
            
            <div className="flex-1 overflow-y-auto space-y-2 pr-2 no-scrollbar">
              {[
                { type: 'Receive', asset: 'ZERA', amount: '+ 12.5', time: 'Today, 14:32', icon: ArrowDownRight, color: 'text-emerald-glow', bg: 'bg-emerald-glow/10' },
                { type: 'Send', asset: 'ETH', amount: '- 2.4', time: 'Yesterday, 09:15', icon: ArrowUpRight, color: 'text-text-primary', bg: 'bg-white/5' },
                { type: 'Mint Fee', asset: 'ZERA', amount: '- 0.05', time: 'Oct 24, 11:20', icon: ArrowUpRight, color: 'text-text-primary', bg: 'bg-white/5' },
                { type: 'Receive', asset: 'ZERA', amount: '+ 140.0', time: 'Oct 22, 16:45', icon: ArrowDownRight, color: 'text-emerald-glow', bg: 'bg-emerald-glow/10' },
                { type: 'Send', asset: 'USDC', amount: '- 500.0', time: 'Oct 20, 10:00', icon: ArrowUpRight, color: 'text-text-primary', bg: 'bg-white/5' },
              ].map((tx, i) => {
                const Icon = tx.icon;
                return (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 cursor-pointer">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${tx.bg}`}>
                      <Icon className={`w-5 h-5 ${tx.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-grotesk font-bold text-sm">{tx.type}</p>
                      <p className="font-mono text-[10px] text-text-muted">{tx.time}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-mono text-sm font-bold ${tx.color}`}>{tx.amount} {tx.asset}</p>
                      <p className="font-mono text-[10px] text-text-secondary">Confirmed</p>
                    </div>
                  </div>
                )
              })}
            </div>
            
            <Button variant="secondary" className="w-full mt-4 h-12 text-xs font-mono uppercase bg-white/5 border-none hover:bg-white/10">
              View Explorer
            </Button>
          </Card>
        </div>

      </div>
    </div>
  );
}
