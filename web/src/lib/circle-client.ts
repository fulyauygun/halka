import { Client, Errors, networks, rpc } from "@/lib/contracts/circle";
import { RPC_URL } from "@/lib/config";
import type { Circle } from "@/lib/contracts/circle";
import { contractErrorMessage } from "@/lib/errors";

/** Read-only client for simulated (non-signing) contract calls. */
export function getReadOnlyClient() {
  return new Client({
    contractId: networks.testnet.contractId,
    networkPassphrase: networks.testnet.networkPassphrase,
    rpcUrl: RPC_URL,
    errorTypes: Errors,
  });
}

/** Client configured to sign only through the wallet selected in Stellar Wallets Kit. */
export function getWalletClient(address: string) {
  const signTransaction = async (
    xdr: string,
    options?: { networkPassphrase?: string; address?: string }
  ) => {
    const { StellarWalletsKit } = await import("@creit.tech/stellar-wallets-kit/sdk");
    return StellarWalletsKit.signTransaction(xdr, {
      ...options,
      address: options?.address ?? address,
    });
  };
  const signAuthEntry = async (
    authEntry: string,
    options?: { networkPassphrase?: string; address?: string }
  ) => {
    const { StellarWalletsKit } = await import("@creit.tech/stellar-wallets-kit/sdk");
    return StellarWalletsKit.signAuthEntry(authEntry, {
      ...options,
      address: options?.address ?? address,
    });
  };

  return new Client({
    contractId: networks.testnet.contractId,
    networkPassphrase: networks.testnet.networkPassphrase,
    rpcUrl: RPC_URL,
    errorTypes: Errors,
    publicKey: address,
    signTransaction,
    signAuthEntry,
  });
}

/** Read live contract state and validate an action immediately before wallet approval. */
export async function preflightCircleAction(
  circleId: bigint,
  address: string,
  action: "deposit" | "payout" | "reclaim"
): Promise<Circle> {
  const client = getReadOnlyClient();
  const tx = await client.get_circle({ circle_id: circleId });
  if (tx.result.isErr()) {
    throw new Error(contractErrorMessage(tx.result.unwrapErr().message));
  }
  const circle = tx.result.unwrap();
  const member = circle.members.includes(address);
  const ledger = await new rpc.Server(RPC_URL).getLatestLedger();
  const now = BigInt(ledger.closeTime);

  if (circle.status.tag !== "Active") {
    throw new Error("This circle is not active, so this action is unavailable.");
  }
  if (action !== "payout" && !member) {
    throw new Error("Your connected wallet is not an eligible member of this circle.");
  }

  if (action === "deposit") {
    const deposited = await client.has_deposited_current_round({ circle_id: circleId, member: address });
    if (deposited.result.isErr()) throw new Error(contractErrorMessage(deposited.result.unwrapErr().message));
    if (deposited.result.unwrap()) throw new Error(contractErrorMessage("AlreadyDepositedThisRound"));
  }
  if (action === "payout" && circle.round_deposit_count !== circle.members.length) {
    throw new Error(contractErrorMessage("RoundNotComplete"));
  }
  if (action === "reclaim") {
    if (now < circle.round_deadline) throw new Error(contractErrorMessage("RoundNotTimedOut"));
    const deposited = await client.has_deposited_current_round({ circle_id: circleId, member: address });
    if (deposited.result.isErr()) throw new Error(contractErrorMessage(deposited.result.unwrapErr().message));
    if (!deposited.result.unwrap()) throw new Error(contractErrorMessage("NothingToReclaim"));
  }

  return circle;
}
