"use client";

import { useWallet } from "@/lib/wallet";
import { truncateAddress } from "@/lib/format";

export function WalletButton() {
  const { address, isConnecting, error, connect, disconnect } = useWallet();

  if (address) {
    return (
      <div className="flex items-center gap-3">
        <span className="rounded-full bg-emerald-500/10 px-3 py-1 font-mono text-sm text-emerald-600 dark:text-emerald-400">
          {truncateAddress(address)}
        </span>
        <button
          onClick={disconnect}
          className="text-sm text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
        >
          Bağlantıyı kes
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={connect}
        disabled={isConnecting}
        className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
      >
        {isConnecting ? "Bağlanıyor…" : "Freighter ile Bağlan"}
      </button>
      {error && <p className="max-w-xs text-right text-xs text-red-500">{error}</p>}
    </div>
  );
}
