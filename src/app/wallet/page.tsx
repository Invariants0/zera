"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  Copy,
  Link as LinkIcon,
  RefreshCw,
  Unlink,
} from "lucide-react";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import type { HistoryEntry } from "@midnight-ntwrk/dapp-connector-api";
import { useWallet } from "../../hooks/useWallet";
import { getMidnightNetworkId, formatWalletKey } from "../../lib/midnight-wallet";

export default function WalletPage() {
  const {
    walletAddress,
    walletBalance,
    walletApi,
    isWalletAvailable,
    isConnected,
    walletNetworkId,
    shieldedAddress,
    unshieldedAddress,
    dustAddress,
    balanceBreakdown,
    connectWallet,
    disconnectWallet,
  } = useWallet();
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const shortAddress = useMemo(
    () => (walletAddress ? `${walletAddress.slice(0, 8)}...${walletAddress.slice(-6)}` : "Connect Lace"),
    [walletAddress],
  );
  const expectedNetworkId = getMidnightNetworkId();
  const networkMismatch = Boolean(walletNetworkId && walletNetworkId !== expectedNetworkId);

  useEffect(() => {
    if (!walletApi || !isConnected) {
      setHistory([]);
      return;
    }

    let active = true;

    const loadHistory = async () => {
      setHistoryLoading(true);
      try {
        const entries = await walletApi.getTxHistory(0, 12);
        if (!active) return;
        setHistory(entries);
      } catch {
        if (active) setHistory([]);
      } finally {
        if (active) setHistoryLoading(false);
      }
    };

    void loadHistory();

    return () => {
      active = false;
    };
  }, [isConnected, walletApi]);

  const handleCopyAddress = async () => {
    if (!walletAddress || typeof navigator === "undefined") return;

    await navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const refreshHistory = async () => {
    if (!walletApi || !isConnected) return;
    setHistoryLoading(true);
    try {
      const entries = await walletApi.getTxHistory(0, 12);
      setHistory(entries);
    } finally {
      setHistoryLoading(false);
    }
  };

  const formatHistoryStatus = (status: HistoryEntry["txStatus"]["status"]) => {
    if (status === "finalized") return "Finalized";
    if (status === "confirmed") return "Confirmed";
    if (status === "pending") return "Pending";
    return status;
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 py-6 sm:px-6 md:px-8 lg:px-10 pb-24">
      <div className="mb-8 sm:mb-10 lg:mb-12">
        <h1 className="text-2xl sm:text-3xl font-grotesk font-bold uppercase tracking-tight text-text-primary">
          Wallet Management
        </h1>
        <p className="font-mono text-xs sm:text-sm text-text-secondary mt-2 max-w-2xl">
          Manage your connected accounts, balances, and recent transactions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:gap-8 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-4">
          <Card className="bg-lime border-lime !text-black p-5 sm:p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern bg-grid-60 opacity-10 pointer-events-none mix-blend-overlay" />
            <div className="relative z-10">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-8">
                <Badge className="bg-black/10 text-black border-black/20" showDot>
                  PRIMARY_WALLET
                </Badge>
                <Badge className="bg-black/10 text-black border-black/20">
                  {walletNetworkId ?? expectedNetworkId}
                </Badge>
              </div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-black/70 mb-1">
                Total Balance
              </p>
              <div className="mb-2">
                <h2 className="font-grotesk text-3xl sm:text-4xl font-bold break-words">
                  {balanceBreakdown.night.total}
                </h2>
                <p className="font-mono text-xs text-black/60 mt-1">NIGHT Balance</p>
              </div>
              <div className="mb-5 sm:mb-6">
                <h3 className="font-grotesk text-xl sm:text-2xl font-bold break-words">
                  {walletBalance}
                </h3>
                <p className="font-mono text-xs text-black/60">DUST Balance</p>
              </div>
              <div className="rounded-xl bg-black/5 border border-black/10 p-3">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-black/60">Main Address</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyAddress}
                    disabled={!walletAddress}
                    className="h-8 px-3 bg-black/5 text-black hover:bg-black/10 disabled:opacity-50"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                </div>
                <p className="font-mono text-[11px] sm:text-xs break-all text-black/90">
                  {walletAddress ?? "No wallet connected"}
                </p>
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl bg-black/5 border border-black/10 p-3">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-black/60 mb-2">NIGHT Breakdown</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] text-black/70">Shielded:</span>
                      <span className="font-mono text-xs font-bold text-black">{balanceBreakdown.night.shielded}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] text-black/70">Unshielded:</span>
                      <span className="font-mono text-xs font-bold text-black">{balanceBreakdown.night.unshielded}</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl bg-black/5 border border-black/10 p-3">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-black/60 mb-2">DUST</p>
                  <p className="font-grotesk text-base font-bold break-words">{balanceBreakdown.dust}</p>
                  <p className="font-mono text-[9px] text-black/60 mt-1">Transaction fees</p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl bg-black/5 border border-black/10 p-3">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-black/60">Shielded Tokens</p>
                  <div className="mt-2 space-y-1">
                    {Object.entries(balanceBreakdown.shielded).length > 0 ? (
                      Object.entries(balanceBreakdown.shielded).map(([token, amount]) => (
                        <div key={token} className="flex items-center justify-between gap-2 font-mono text-[10px]">
                          <span className="truncate max-w-[120px]">{formatWalletKey(token)}</span>
                          <span>{amount}</span>
                        </div>
                      ))
                    ) : (
                      <p className="font-mono text-[10px] text-black/50">No tokens</p>
                    )}
                  </div>
                </div>
                <div className="rounded-xl bg-black/5 border border-black/10 p-3">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-black/60">Unshielded Tokens</p>
                  <div className="mt-2 space-y-1">
                    {Object.entries(balanceBreakdown.unshielded).length > 0 ? (
                      Object.entries(balanceBreakdown.unshielded).map(([token, amount]) => (
                        <div key={token} className="flex items-center justify-between gap-2 font-mono text-[10px]">
                          <span className="truncate max-w-[120px]">{formatWalletKey(token)}</span>
                          <span>{amount}</span>
                        </div>
                      ))
                    ) : (
                      <p className="font-mono text-[10px] text-black/50">No tokens</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={disconnectWallet}
                  className="w-full sm:w-auto bg-black/5 text-black hover:bg-red-500/10 hover:text-red-700 border border-transparent hover:border-red-500/20 transition-colors"
                >
                  Disconnect
                </Button>
              </div>
            </div>
          </Card>

          <Card className="bg-obsidian border-white/5 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h3 className="font-grotesk font-bold uppercase">Connected Accounts</h3>
              <Badge className={networkMismatch ? "bg-red-500/15 text-red-300 border-red-500/20" : "bg-lime/15 text-lime border-lime/20"}>
                {networkMismatch ? `Wrong: ${walletNetworkId}` : `Network: ${walletNetworkId ?? expectedNetworkId}`}
              </Badge>
            </div>
            {networkMismatch ? (
              <p className="font-mono text-[10px] text-red-300 mb-4">
                Connected to {walletNetworkId}, but this app expects {expectedNetworkId}.
              </p>
            ) : null}
            <div className="space-y-4">
              <div className="flex items-start sm:items-center justify-between gap-4 p-3 sm:p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-lime/20 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-lime" />
                  </div>
                  <div>
                    <p className="font-mono text-xs text-text-primary">{isConnected ? "Lace" : "No wallet"}</p>
                    <p className="font-mono text-[10px] sm:text-xs text-text-muted break-all">
                      {shortAddress}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 text-text-secondary hover:text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-colors"
                  onClick={disconnectWallet}
                >
                  <Unlink className="w-4 h-4" />
                </Button>
              </div>

              <Button variant="secondary" className="w-full border-dashed border-white/20 gap-2" onClick={connectWallet}>
                <LinkIcon className="w-4 h-4" /> Link Lace Wallet
              </Button>
              {!isWalletAvailable ? (
                <p className="font-mono text-[10px] text-amber-300 mt-3">
                  Midnight Lace is not detected in this browser session.
                </p>
              ) : null}
            </div>
          </Card>

          <Card className="bg-obsidian border-white/5 p-5 sm:p-6">
            <h3 className="font-grotesk font-bold uppercase mb-4">Wallet Addresses</h3>
            <div className="space-y-3">
              {[
                { label: "Shielded", value: shieldedAddress ?? walletAddress },
                { label: "Unshielded", value: unshieldedAddress ?? walletAddress },
                { label: "Dust", value: dustAddress ?? walletAddress },
              ].map((item) => (
                <div key={item.label} className="rounded-xl bg-white/5 border border-white/5 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted">{item.label}</p>
                      <p className="font-mono text-[10px] text-text-primary break-all mt-1">
                        {item.value ?? "Not available"}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={async () => item.value && navigator.clipboard.writeText(item.value)}
                      disabled={!item.value}
                      className="shrink-0"
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="xl:col-span-8">
          <Card className="bg-obsidian border-white/5 p-5 sm:p-6 min-h-[420px] flex flex-col">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
              <div>
                <h3 className="text-lg sm:text-xl font-grotesk font-bold uppercase tracking-tight">Recent Transactions</h3>
                <p className="font-mono text-[10px] sm:text-xs text-text-muted mt-1">
                  Live history from the connected Lace wallet
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshHistory}
                disabled={!isConnected || historyLoading}
                className="gap-2 w-full sm:w-auto"
              >
                <RefreshCw className={`w-4 h-4 ${historyLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 sm:pr-2 no-scrollbar">
              {!isConnected ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-text-secondary font-mono text-sm">
                  Connect Lace to see transaction history.
                </div>
              ) : historyLoading ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-text-secondary font-mono text-sm">
                  Loading recent transactions...
                </div>
              ) : history.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-text-secondary font-mono text-sm">
                  No recent transactions found.
                </div>
              ) : (
                history.map((tx, index) => {
                  const finalized = tx.txStatus.status === "finalized" || tx.txStatus.status === "confirmed";
                  const Icon = finalized ? ArrowDownRight : ArrowUpRight;
                  const color = finalized ? "text-emerald-glow" : "text-text-primary";
                  const bg = finalized ? "bg-emerald-glow/10" : "bg-white/5";
                  const shortHash = `${tx.txHash.slice(0, 10)}...${tx.txHash.slice(-8)}`;

                  return (
                    <div
                      key={`${tx.txHash}-${index}`}
                      className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${bg}`}>
                        <Icon className={`w-5 h-5 ${color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-grotesk font-bold text-sm sm:text-base">{formatHistoryStatus(tx.txStatus.status)}</p>
                        <p className="font-mono text-[10px] sm:text-xs text-text-muted break-all">
                          {shortHash}
                        </p>
                      </div>
                      <div className="sm:text-right flex flex-wrap items-center gap-2 sm:justify-end">
                        <Badge className={finalized ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/20" : "bg-white/10 text-text-primary border-white/10"}>
                          {formatHistoryStatus(tx.txStatus.status)}
                        </Badge>
                        <p className="font-mono text-[10px] text-text-secondary">
                          {"executionStatus" in tx.txStatus ? `${Object.keys(tx.txStatus.executionStatus).length} sections` : "Pending details"}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
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
