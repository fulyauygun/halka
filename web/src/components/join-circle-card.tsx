"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { getWalletClient } from "@/lib/circle-client";
import { describeError } from "@/lib/errors";
import { formatTokenAmount, truncateAddress } from "@/lib/format";
import { useCircle } from "@/lib/use-circle";
import { useWallet } from "@/lib/wallet";
import { NazarBead } from "@/components/nazar-bead";

export function JoinCircleCard({ circleId }: { circleId: bigint }) {
  const { address, connect, isConnecting } = useWallet();
  const { circle, members, loading, error, refetch } = useCircle(circleId);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const router = useRouter();

  if (loading && !circle) {
    return (
      <div className="flex items-center gap-3 text-muted">
        <NazarBead size={22} spin />
        <span>Loading circle info…</span>
      </div>
    );
  }
  if (error && !circle) {
    return <p className="text-terracotta">{error}</p>;
  }
  if (!circle || !members) return null;

  const self = address ? members.find((m) => m.address === address) : undefined;
  const isMember = Boolean(self);
  const alreadyJoined = self?.joined ?? false;

  async function handleJoin() {
    if (!address) return;
    setJoinError(null);
    setIsJoining(true);
    try {
      const client = getWalletClient(address);
      const tx = await client.join_circle({ circle_id: circleId, member: address });
      const sent = await tx.signAndSend();
      if (sent.result.isErr()) throw new Error(sent.result.unwrapErr().message);
      await refetch();
      router.push(`/circle/${circleId}`);
    } catch (e) {
      setJoinError(describeError(e));
    } finally {
      setIsJoining(false);
    }
  }

  return (
    <div className="space-y-6 rounded-2xl border-2 border-card-border bg-card p-6 shadow-[0_4px_0_0_var(--card-border)]">
      <div className="flex items-center gap-2.5">
        <NazarBead size={24} />
        <h1 className="text-xl font-semibold">Join Halka #{circleId.toString()}</h1>
      </div>
      <p className="-mt-3 text-sm text-muted">
        {members.length} members · Contribution: {formatTokenAmount(circle.contribution_amount)} / round ·
        Created by: <span className="font-mono">{truncateAddress(circle.creator)}</span>
      </p>

      {circle.status.tag !== "Forming" && (
        <p className="text-sm text-gold">
          This circle is no longer open for joining — invitations are closed.
        </p>
      )}

      {circle.status.tag === "Forming" && (
        <>
          {!address && (
            <button
              onClick={connect}
              disabled={isConnecting}
              className="w-full rounded-full bg-gradient-to-r from-turquoise to-nazar-blue px-4 py-2.5 text-sm font-medium text-white shadow-sm disabled:opacity-50"
            >
              {isConnecting ? "Connecting…" : "Connect with Freighter"}
            </button>
          )}

          {address && !isMember && (
            <p className="text-sm text-terracotta">
              Your connected address ({truncateAddress(address)}) is not on this circle&apos;s
              member list. If you connected the wrong wallet, switch accounts in Freighter and
              try again.
            </p>
          )}

          {address && isMember && alreadyJoined && (
            <p className="text-sm text-turquoise-dark dark:text-turquoise">
              You&apos;ve already joined — you can go to the circle page.
            </p>
          )}

          {address && isMember && !alreadyJoined && (
            <button
              onClick={handleJoin}
              disabled={isJoining}
              className="w-full rounded-full bg-gradient-to-r from-turquoise to-nazar-blue px-4 py-2.5 text-sm font-medium text-white shadow-sm disabled:opacity-50"
            >
              {isJoining ? "Joining…" : "Join"}
            </button>
          )}

          {joinError && <p className="text-sm text-terracotta">{joinError}</p>}
        </>
      )}

      <a
        href={`/circle/${circleId}`}
        className="block text-center text-sm text-muted hover:text-turquoise-dark hover:underline"
      >
        Go to circle page
      </a>
    </div>
  );
}
