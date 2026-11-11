"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { networks } from "@/lib/contracts/circle";
import { describeError } from "@/lib/errors";

interface WalletState {
  address: string | null;
  walletName: string | null;
  isConnecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const WalletContext = createContext<WalletState | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [walletName, setWalletName] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    setError(null);
    setIsConnecting(true);
    try {
      const [{ StellarWalletsKit }, { defaultModules }, { Networks }] =
        await Promise.all([
          import("@creit.tech/stellar-wallets-kit/sdk"),
          import("@creit.tech/stellar-wallets-kit/modules/utils"),
          import("@creit.tech/stellar-wallets-kit/types"),
        ]);

      StellarWalletsKit.init({
        network: Networks.TESTNET,
        modules: defaultModules({
          filterBy: (module) => ["varial", "freighter", "albedo", "hana"].includes(module.productId),
        }),
        authModal: { hideUnsupportedWallets: false },
      });

      const connected = await StellarWalletsKit.authModal();
      const network = await StellarWalletsKit.getNetwork();
      if (network.networkPassphrase !== networks.testnet.networkPassphrase) {
        await StellarWalletsKit.disconnect();
        throw new Error("Your wallet is not on the Stellar Testnet. Switch networks in the wallet and reconnect.");
      }

      setAddress(connected.address);
      setWalletName(StellarWalletsKit.selectedModule.productName);
    } catch (e) {
      setAddress(null);
      setWalletName(null);
      setError(describeError(e));
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    setError(null);
    try {
      const { StellarWalletsKit } = await import("@creit.tech/stellar-wallets-kit/sdk");
      await StellarWalletsKit.disconnect();
      setAddress(null);
      setWalletName(null);
    } catch (e) {
      setAddress(null);
      setWalletName(null);
      setError(describeError(e));
    }
  }, []);

  const value = useMemo<WalletState>(
    () => ({ address, walletName, isConnecting, error, connect, disconnect }),
    [address, walletName, isConnecting, error, connect, disconnect]
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}
