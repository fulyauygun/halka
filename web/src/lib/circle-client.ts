import freighter from "@stellar/freighter-api";

import { Client, Errors, networks } from "@/lib/contracts/circle";
import { RPC_URL } from "@/lib/config";

/** Read-only client for simulated (non-signing) contract calls. */
export function getReadOnlyClient() {
  return new Client({
    contractId: networks.testnet.contractId,
    networkPassphrase: networks.testnet.networkPassphrase,
    rpcUrl: RPC_URL,
    errorTypes: Errors,
  });
}

/** Client configured to sign state-changing calls via the connected Freighter wallet. */
export function getWalletClient(address: string) {
  return new Client({
    contractId: networks.testnet.contractId,
    networkPassphrase: networks.testnet.networkPassphrase,
    rpcUrl: RPC_URL,
    errorTypes: Errors,
    publicKey: address,
    signTransaction: freighter.signTransaction,
  });
}
