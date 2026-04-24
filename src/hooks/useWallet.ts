"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAppStore } from "../store/appStore";
import {
  connectLaceWallet,
  getLaceBalance,
  formatLaceAmount,
  restoreLaceWallet,
  startLaceBalancePolling,
  type LaceSession,
} from "../lib/midnight-wallet";

let laceSession: LaceSession | null = null;

export const useWallet = () => {
  const walletAddress = useAppStore((state) => state.walletAddress);
  const walletBalance = useAppStore((state) => state.walletBalance);
  const isConnected = useAppStore((state) => state.isConnected);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [walletNetworkId, setWalletNetworkId] = useState<string | null>(null);
  const [shieldedAddress, setShieldedAddress] = useState<string | null>(null);
  const [unshieldedAddress, setUnshieldedAddress] = useState<string | null>(null);
  const [dustAddress, setDustAddress] = useState<string | null>(null);
  const [balanceBreakdown, setBalanceBreakdown] = useState<{
    shielded: Record<string, string>;
    unshielded: Record<string, string>;
    dust: string;
  }>({
    shielded: {},
    unshielded: {},
    dust: "0 tDUST",
  });
  const setWalletAddress = useAppStore((state) => state.setWalletAddress);
  const setWalletBalance = useAppStore((state) => state.setWalletBalance);
  const setIsConnected = useAppStore((state) => state.setIsConnected);
  const pollStopRef = useRef<(() => void) | null>(null);
  const [isWalletAvailable, setIsWalletAvailable] = useState(false);

  const stopPolling = useCallback(() => {
    pollStopRef.current?.();
    pollStopRef.current = null;
  }, []);

  const hydrateWalletDetails = useCallback(async (session: LaceSession) => {
    try {
      const [shielded, unshielded, dust, connection] = await Promise.all([
        session.api.getShieldedAddresses(),
        session.api.getUnshieldedAddress(),
        session.api.getDustAddress(),
        session.api.getConnectionStatus(),
      ]);

      setWalletNetworkId(connection.status === "connected" ? connection.networkId : session.networkId);
      setShieldedAddress(shielded.shieldedAddress);
      setUnshieldedAddress(unshielded.unshieldedAddress);
      setDustAddress(dust.dustAddress);
    } catch (error) {
      console.warn("[Lace Wallet] failed to hydrate wallet details:", error);
    }
  }, []);

  const syncSessionState = useCallback(
    async (session: LaceSession) => {
      laceSession = session;
      setWalletError(null);
      setWalletAddress(session.address);
      setWalletNetworkId(session.networkId);
      setShieldedAddress(session.shieldedAddress);
      setUnshieldedAddress(session.unshieldedAddress);
      setDustAddress(session.dustAddress);
      setBalanceBreakdown({
        shielded: Object.fromEntries(
          Object.entries(session.shieldedBalances).map(([token, amount]) => [token, formatLaceAmount(amount.toString())]),
        ),
        unshielded: Object.fromEntries(
          Object.entries(session.unshieldedBalances).map(([token, amount]) => [token, formatLaceAmount(amount.toString())]),
        ),
        dust: formatLaceAmount(session.dustBalance.balance.toString()),
      });
      setIsConnected(true);

      const balance = await getLaceBalance(session.api);
      setWalletBalance(balance.label);
      void hydrateWalletDetails(session);

      stopPolling();
      pollStopRef.current = await startLaceBalancePolling(
        session.api,
        (next) => setWalletBalance(next.label),
        (error) => console.warn("[Lace Wallet] balance refresh failed:", error),
      );

      if (typeof window !== "undefined") {
        localStorage.setItem("wallet_address", session.address);
        localStorage.setItem("wallet_connected", "true");
      }
    },
    [hydrateWalletDetails, setIsConnected, setWalletAddress, setWalletBalance, stopPolling],
  );

  const connectWallet = useCallback(async () => {
    try {
      const session = await connectLaceWallet();
      await syncSessionState(session);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to connect Lace wallet";
      setWalletError(message);
      throw error instanceof Error ? error : new Error(message);
    }
  }, [syncSessionState]);

  const disconnectWallet = useCallback(() => {
    stopPolling();
    laceSession = null;
    setWalletError(null);
    setWalletAddress(null);
    setWalletNetworkId(null);
    setShieldedAddress(null);
    setUnshieldedAddress(null);
    setDustAddress(null);
    setBalanceBreakdown({ shielded: {}, unshielded: {}, dust: "0 tDUST" });
    setWalletBalance("0 tDUST");
    setIsConnected(false);

    if (typeof window !== "undefined") {
      localStorage.removeItem("wallet_address");
      localStorage.removeItem("wallet_connected");
    }
  }, [setIsConnected, setWalletAddress, setWalletBalance, stopPolling]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    setIsWalletAvailable(Boolean(window.midnight && Object.keys(window.midnight).length > 0));

    const shouldRestore = window.localStorage.getItem("wallet_connected") === "true";
    if (shouldRestore) {
      void (async () => {
        const restored = await restoreLaceWallet();
        if (restored) {
          await syncSessionState(restored);
        } else {
          window.localStorage.removeItem("wallet_connected");
        }
      })();
    }

    return () => {
      stopPolling();
    };
  }, [syncSessionState, stopPolling]);

  return {
    walletAddress,
    walletBalance,
    walletError,
    isWalletAvailable,
    isConnected,
    walletNetworkId,
    shieldedAddress,
    unshieldedAddress,
    dustAddress,
    balanceBreakdown,
    connectWallet,
    disconnectWallet,
    walletApi: laceSession?.api ?? null,
  };
};
