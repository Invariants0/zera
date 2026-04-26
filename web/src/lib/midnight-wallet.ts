import "@midnight-ntwrk/dapp-connector-api";
import type { ConnectedAPI, InitialAPI } from "@midnight-ntwrk/dapp-connector-api";
import { nativeToken } from "@midnight-ntwrk/ledger-v8";

export type LaceBalance = {
  raw: string;
  label: string;
};

export type LaceSession = {
  api: ConnectedAPI;
  address: string;
  networkId: string;
  shieldedAddress: string;
  unshieldedAddress: string;
  dustAddress: string;
  shieldedBalances: Record<string, bigint>;
  unshieldedBalances: Record<string, bigint>;
  dustBalance: {
    balance: bigint;
    cap: bigint;
  };
  nightBalance: {
    shielded: bigint;
    unshielded: bigint;
    total: bigint;
  };
};

const NETWORK_ID = process.env.NEXT_PUBLIC_MIDNIGHT_NETWORK_ID || "preprod";

function getInjectedMidnightWallets(): Array<[string, InitialAPI]> {
  if (typeof window === "undefined") return [];

  return Object.entries(window.midnight ?? {}) as Array<[string, InitialAPI]>;
}

export function getLaceWallet(): InitialAPI | null {
  if (typeof window === "undefined") return null;

  const injectedWallets = getInjectedMidnightWallets();
  const directLace = window.midnight?.mnLace ?? null;
  if (directLace) return directLace;

  const laceByName = injectedWallets.find(([, wallet]) =>
    wallet.name.toLowerCase().includes("lace"),
  );
  if (laceByName) return laceByName[1];

  const laceByRdns = injectedWallets.find(([, wallet]) =>
    wallet.rdns.toLowerCase().includes("lace"),
  );
  return laceByRdns?.[1] ?? null;
}

export function getLaceAvailabilityDetails(): string {
  if (typeof window === "undefined") {
    return "Wallet detection only runs in the browser.";
  }

  const injectedWallets = getInjectedMidnightWallets();
  if (injectedWallets.length === 0) {
    return "No Midnight wallet was injected into window.midnight.";
  }

  const available = injectedWallets
    .map(([key, wallet]) => `${key} (${wallet.name}, api ${wallet.apiVersion})`)
    .join(", ");

  return `Detected wallets: ${available}`;
}

export async function connectLaceWallet(): Promise<LaceSession> {
  const wallet = getLaceWallet();
  if (!wallet) {
    throw new Error(
      `Lace wallet not found. Install or enable the Midnight Lace extension, then refresh the page. ${getLaceAvailabilityDetails()}`,
    );
  }

  const api = await wallet.connect(NETWORK_ID);
  const [shielded, unshielded, dust, shieldedBalances, unshieldedBalances, connection] = await Promise.all([
    api.getShieldedAddresses(),
    api.getUnshieldedAddress(),
    api.getDustAddress(),
    api.getShieldedBalances(),
    api.getUnshieldedBalances(),
    api.getConnectionStatus(),
  ]);
  if (connection.status !== "connected") {
    throw new Error("Lace wallet connection was not approved.");
  }

  if (connection.networkId !== NETWORK_ID) {
    throw new Error(
      `Lace is connected to ${connection.networkId}, but this app expects ${NETWORK_ID}.`,
    );
  }

  const dustBalance = await api.getDustBalance();

  // Extract NIGHT balances using nativeToken().raw (64-char key)
  const nightTokenKey = nativeToken().raw;
  
  // Debug: Log full balance objects to see all tokens
  console.log('[Wallet] NIGHT token key:', nightTokenKey);
  console.log('[Wallet] Full shielded balances:', JSON.stringify(
    Object.fromEntries(
      Object.entries(shieldedBalances).map(([k, v]) => [k, v.toString()])
    ), null, 2
  ));
  console.log('[Wallet] Full unshielded balances:', JSON.stringify(
    Object.fromEntries(
      Object.entries(unshieldedBalances).map(([k, v]) => [k, v.toString()])
    ), null, 2
  ));
  
  const shieldedNight = shieldedBalances[nightTokenKey] ?? 0n;
  const unshieldedNight = unshieldedBalances[nightTokenKey] ?? 0n;
  
  console.log('[Wallet] Shielded NIGHT (raw bigint):', shieldedNight.toString());
  console.log('[Wallet] Unshielded NIGHT (raw bigint):', unshieldedNight.toString());
  console.log('[Wallet] Total NIGHT (raw):', (shieldedNight + unshieldedNight).toString());
  console.log('[Wallet] Total NIGHT (formatted):', formatNightAmount(shieldedNight + unshieldedNight));

  return {
    api,
    address: shielded.shieldedAddress,
    networkId: connection.networkId,
    shieldedAddress: shielded.shieldedAddress,
    unshieldedAddress: unshielded.unshieldedAddress,
    dustAddress: dust.dustAddress,
    shieldedBalances,
    unshieldedBalances,
    dustBalance,
    nightBalance: {
      shielded: shieldedNight,
      unshielded: unshieldedNight,
      total: shieldedNight + unshieldedNight,
    },
  };
}

export async function restoreLaceWallet(): Promise<LaceSession | null> {
  const wallet = getLaceWallet();
  if (!wallet) return null;

  const api = await wallet.connect(NETWORK_ID).catch(() => null);
  if (!api) return null;

  const connected = await api.getConnectionStatus().catch(() => null);
  if (!connected || connected.status !== "connected" || connected.networkId !== NETWORK_ID) {
    return null;
  }

  const [shielded, unshielded, dust, shieldedBalances, unshieldedBalances, dustBalance] = await Promise.all([
    api.getShieldedAddresses(),
    api.getUnshieldedAddress(),
    api.getDustAddress(),
    api.getShieldedBalances(),
    api.getUnshieldedBalances(),
    api.getDustBalance(),
  ]);

  // Extract NIGHT balances using nativeToken().raw (64-char key)
  const nightTokenKey = nativeToken().raw;
  
  // Debug: Log full balance objects to see all tokens
  console.log('[Wallet Restore] NIGHT token key:', nightTokenKey);
  console.log('[Wallet Restore] Full shielded balances:', JSON.stringify(
    Object.fromEntries(
      Object.entries(shieldedBalances).map(([k, v]) => [k, v.toString()])
    ), null, 2
  ));
  console.log('[Wallet Restore] Full unshielded balances:', JSON.stringify(
    Object.fromEntries(
      Object.entries(unshieldedBalances).map(([k, v]) => [k, v.toString()])
    ), null, 2
  ));
  
  const shieldedNight = shieldedBalances[nightTokenKey] ?? 0n;
  const unshieldedNight = unshieldedBalances[nightTokenKey] ?? 0n;
  
  console.log('[Wallet Restore] Shielded NIGHT (raw bigint):', shieldedNight.toString());
  console.log('[Wallet Restore] Unshielded NIGHT (raw bigint):', unshieldedNight.toString());
  console.log('[Wallet Restore] Total NIGHT (raw):', (shieldedNight + unshieldedNight).toString());
  console.log('[Wallet Restore] Total NIGHT (formatted):', formatNightAmount(shieldedNight + unshieldedNight));

  return {
    api,
    address: shielded.shieldedAddress,
    networkId: connected.networkId,
    shieldedAddress: shielded.shieldedAddress,
    unshieldedAddress: unshielded.unshieldedAddress,
    dustAddress: dust.dustAddress,
    shieldedBalances,
    unshieldedBalances,
    dustBalance,
    nightBalance: {
      shielded: shieldedNight,
      unshielded: unshieldedNight,
      total: shieldedNight + unshieldedNight,
    },
  };
}

export async function getLaceBalance(api: ConnectedAPI): Promise<LaceBalance> {
  const dust = await api.getDustBalance().catch(() => null);
  if (dust) {
    const raw = dust.balance.toString();
    return {
      raw,
      label: formatLaceAmount(raw),
    };
  }

  return { raw: "0", label: "0 tDUST" };
}

export function formatWalletKey(key: string): string {
  return key.length > 18 ? `${key.slice(0, 8)}...${key.slice(-6)}` : key;
}

export function formatLaceAmount(raw: string): string {
  const numeric = Number(raw);
  if (!Number.isFinite(numeric)) return `${raw} tDUST`;
  if (numeric >= 1_000_000) return `${(numeric / 1_000_000).toFixed(2)} tDUST`;
  if (numeric >= 1_000) return `${(numeric / 1_000).toFixed(2)} tDUST`;
  return `${numeric.toFixed(2)} tDUST`;
}

export function formatNightAmount(raw: bigint): string {
  // IMPORTANT: On preprod, the Lace API returns NIGHT in a different scale
  // Based on testing: 1,000,000 base units = 1 tNIGHT (not 1,000,000,000)
  // Example: API returns 1000000000 for 1,000 tNIGHT shown in Lace UI
  const NIGHT_SCALE = 1_000_000n;  // Correct scale for preprod
  
  // Handle zero case
  if (raw === 0n) {
    return '0 tNIGHT';
  }
  
  const whole = raw / NIGHT_SCALE;
  const fraction = raw % NIGHT_SCALE;
  
  // If no fractional part, return whole number
  if (fraction === 0n) {
    return `${whole.toLocaleString()} tNIGHT`;
  }
  
  // Format fractional part with up to 6 decimal places, trim trailing zeros
  const fractionStr = fraction.toString().padStart(6, '0');
  const trimmedFraction = fractionStr.replace(/0+$/, '');
  
  return `${whole.toLocaleString()}.${trimmedFraction} tNIGHT`;
}

export async function startLaceBalancePolling(
  api: ConnectedAPI,
  onUpdate: (next: LaceBalance) => void,
  onError?: (error: Error) => void,
): Promise<() => void> {
  const tick = async () => {
    try {
      onUpdate(await getLaceBalance(api));
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error("Failed to refresh Lace balance"));
    }
  };

  await tick();
  const interval = window.setInterval(tick, 10_000);
  const onVisible = () => {
    if (!document.hidden) {
      void tick();
    }
  };

  window.addEventListener("focus", tick);
  document.addEventListener("visibilitychange", onVisible);

  return () => {
    window.clearInterval(interval);
    window.removeEventListener("focus", tick);
    document.removeEventListener("visibilitychange", onVisible);
  };
}

export function getMidnightNetworkId(): string {
  return NETWORK_ID;
}