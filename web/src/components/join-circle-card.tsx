"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { getWalletClient } from "@/lib/circle-client";
import { describeError } from "@/lib/errors";
import { formatTokenAmount, truncateAddress } from "@/lib/format";
import { useCircle } from "@/lib/use-circle";
import { useWallet } from "@/lib/wallet";

export function JoinCircleCard({ circleId }: { circleId: bigint }) {
  const { address, connect, isConnecting } = useWallet();
  const { circle, members, loading, error, refetch } = useCircle(circleId);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const router = useRouter();

  if (loading && !circle) {
    return <p className="text-neutral-500">Halka bilgileri yükleniyor…</p>;
  }
  if (error && !circle) {
    return <p className="text-red-500">{error}</p>;
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
    <div className="space-y-6 rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800">
      <div>
        <h1 className="text-xl font-semibold">Halka #{circleId.toString()}&apos;e katıl</h1>
        <p className="mt-1 text-sm text-neutral-500">
          {members.length} üye · Katkı: {formatTokenAmount(circle.contribution_amount)} / round ·
          Oluşturan: <span className="font-mono">{truncateAddress(circle.creator)}</span>
        </p>
      </div>

      {circle.status.tag !== "Forming" && (
        <p className="text-sm text-amber-600 dark:text-amber-400">
          Bu halka artık katılıma açık değil — davetler kapandı.
        </p>
      )}

      {circle.status.tag === "Forming" && (
        <>
          {!address && (
            <button
              onClick={connect}
              disabled={isConnecting}
              className="w-full rounded-full bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-neutral-900"
            >
              {isConnecting ? "Bağlanıyor…" : "Freighter ile bağlan"}
            </button>
          )}

          {address && !isMember && (
            <p className="text-sm text-red-500">
              Bağlı adresiniz ({truncateAddress(address)}) bu halkanın üye listesinde değil.
              Yanlış cüzdanla bağlandıysanız Freighter&apos;dan hesap değiştirip tekrar deneyin.
            </p>
          )}

          {address && isMember && alreadyJoined && (
            <p className="text-sm text-emerald-600 dark:text-emerald-400">
              Zaten katıldınız — halka sayfasına gidebilirsiniz.
            </p>
          )}

          {address && isMember && !alreadyJoined && (
            <button
              onClick={handleJoin}
              disabled={isJoining}
              className="w-full rounded-full bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-neutral-900"
            >
              {isJoining ? "Katılınıyor…" : "Katıl"}
            </button>
          )}

          {joinError && <p className="text-sm text-red-500">{joinError}</p>}
        </>
      )}

      <a
        href={`/circle/${circleId}`}
        className="block text-center text-sm text-neutral-500 hover:underline"
      >
        Halka sayfasına git
      </a>
    </div>
  );
}
