"use client";

import { useWallet } from "@/lib/wallet";
import { truncateAddress } from "@/lib/format";

export function WalletButton() {
  const { address, isConnecting, error, connect, disconnect } = useWallet();

  if (address) {
    return (
      <div className="flex items-center gap-3">
        <span className="rounded-full bg-turquoise/15 px-3 py-1 font-mono text-sm text-turquoise-dark dark:text-turquoise">
          {truncateAddress(address)}
        </span>
        <button
          onClick={disconnect}
          className="text-sm text-muted hover:text-terracotta"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={connect}
        disabled={isConnecting}
        className="rounded-full bg-gradient-to-r from-turquoise to-nazar-blue px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
      >
        {isConnecting ? "Connecting…" : "Connect with Freighter"}
      </button>
      {error && <p className="max-w-xs text-right text-xs text-terracotta">{error}</p>}
    </div>
  );
}
