"use client";

import freighter from "@stellar/freighter-api";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { networks } from "@/lib/contracts/circle";
import { describeError } from "@/lib/errors";

const STORAGE_KEY = "halka:wallet-connected";

interface WalletState {
  address: string | null;
  isConnecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletState | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    setError(null);
    setIsConnecting(true);
    try {
      const connected = await freighter.isConnected();
      if (connected.error || !connected.isConnected) {
        throw new Error(
          "Freighter wallet extension not found. Please install it from freighter.app."
        );
      }

      const access = await freighter.requestAccess();
      if (access.error) throw new Error(access.error.message);

      const network = await freighter.getNetwork();
      if (network.error) throw new Error(network.error.message);
      if (network.networkPassphrase !== networks.testnet.networkPassphrase) {
        throw new Error(
          "Your Freighter wallet is not on the Testnet network. Please switch to Testnet in Freighter's settings."
        );
      }

      setAddress(access.address);
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch (e) {
      setAddress(null);
      setError(describeError(e));
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setError(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  useEffect(() => {
    // Restoring a previously-approved Freighter session on mount — this is
    // syncing with the wallet extension, not a plain data fetch, so the
    // resulting setState calls are intentional here.
    if (window.localStorage.getItem(STORAGE_KEY) === "1") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      connect();
    }
    // Only run once, on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<WalletState>(
    () => ({ address, isConnecting, error, connect, disconnect }),
    [address, isConnecting, error, connect, disconnect]
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}
