"use client";

import { useEffect, useState } from "react";

import { getWalletClient } from "@/lib/circle-client";
import { describeError } from "@/lib/errors";
import { formatTokenAmount, truncateAddress } from "@/lib/format";
import { useCircle } from "@/lib/use-circle";
import { useWallet } from "@/lib/wallet";
import { CopyLinkButton } from "@/components/copy-link-button";
import { NazarBead } from "@/components/nazar-bead";

const STATUS_LABEL: Record<string, string> = {
  Forming: "Katılım bekleniyor",
  Active: "Aktif",
  Completed: "Tamamlandı",
};

const STATUS_STYLE: Record<string, string> = {
  Forming: "bg-gold/15 text-terracotta-dark dark:text-gold-light",
  Active: "bg-turquoise/15 text-turquoise-dark dark:text-turquoise",
  Completed: "bg-nazar-blue/15 text-nazar-blue-dark dark:text-nazar-blue",
};

export function CircleDashboard({ circleId }: { circleId: bigint }) {
  const { address, connect } = useWallet();
  const { circle, members, loading, error, refetch } = useCircle(circleId);
  const [actionError, setActionError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 15_000);
    return () => clearInterval(id);
  }, []);

  async function runAction(name: string, fn: () => Promise<void>) {
    setActionError(null);
    setPendingAction(name);
    try {
      await fn();
      await refetch();
    } catch (e) {
      setActionError(describeError(e));
    } finally {
      setPendingAction(null);
    }
  }

  if (loading && !circle) {
    return (
      <div className="flex items-center gap-3 text-muted">
        <NazarBead size={22} spin />
        <span>Halka bilgileri yükleniyor…</span>
      </div>
    );
  }
  if (error && !circle) {
    return <p className="text-terracotta">{error}</p>;
  }
  if (!circle || !members) return null;

  const status = circle.status.tag;
  const memberCount = circle.members.length;
  const roundDeadlineMs = Number(circle.round_deadline) * 1000;
  const isTimedOut = status === "Active" && now >= roundDeadlineMs;

  const self = address
    ? members.find((m) => m.address === address)
    : undefined;
  const isMember = Boolean(self);

  const canJoin = status === "Forming" && self && !self.joined;
  const canDeposit = status === "Active" && self && !self.depositedThisRound;
  const canPayout = status === "Active" && circle.round_deposit_count === memberCount;
  const canReclaim = status === "Active" && isTimedOut && self?.depositedThisRound;

  const joinUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/circle/${circleId}/join`
      : "";

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {status === "Completed" && <NazarBead size={26} />}
            <h1 className="text-2xl font-semibold">Halka #{circleId.toString()}</h1>
          </div>
          <span className={`rounded-full px-3 py-1 text-sm font-medium ${STATUS_STYLE[status] ?? ""}`}>
            {STATUS_LABEL[status] ?? status}
          </span>
        </div>
        <p className="mt-1 text-sm text-muted">
          {memberCount} üye · Katkı: {formatTokenAmount(circle.contribution_amount)} / round
        </p>
      </div>

      {status !== "Completed" && (
        <div className="rounded-xl border-2 border-card-border bg-card p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">
              Round {circle.round_index + 1} / {memberCount}
            </span>
            <span className="text-muted">
              {circle.round_deposit_count} / {memberCount} üye yatırdı
            </span>
          </div>
          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-background">
            <div
              className="h-full rounded-full bg-gradient-to-r from-turquoise to-gold transition-all"
              style={{
                width: `${(circle.round_deposit_count / memberCount) * 100}%`,
              }}
            />
          </div>
          {status === "Active" && (
            <p className="mt-2 text-xs text-muted">
              Sıradaki ödeme:{" "}
              <span className="font-mono">
                {truncateAddress(circle.payout_order[circle.round_index])}
              </span>{" "}
              · Round bitiş: {new Date(roundDeadlineMs).toLocaleString("tr-TR")}
              {isTimedOut && " (süresi doldu — geri çekim açık)"}
            </p>
          )}
        </div>
      )}

      <div>
        <h2 className="text-sm font-medium text-muted">Üyeler</h2>
        <ul className="mt-2 divide-y divide-card-border">
          {members.map((m) => (
            <li key={m.address} className="flex items-center justify-between py-2 text-sm">
              <span className="font-mono">{truncateAddress(m.address)}</span>
              <span className="flex gap-2 text-xs text-muted">
                {status === "Forming" && (m.joined ? "Katıldı" : "Bekleniyor")}
                {status === "Active" && (m.depositedThisRound ? "Bu round yatırdı" : "Bekleniyor")}
                {status === "Completed" && "—"}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {circle.round_index > 0 && (
        <div>
          <h2 className="text-sm font-medium text-muted">Ödeme geçmişi</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {circle.payout_order.slice(0, circle.round_index).map((recipient, i) => (
              <li key={i} className="flex justify-between">
                <span>Round {i + 1}</span>
                <span className="font-mono">{truncateAddress(recipient)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-3">
        {actionError && <p className="text-sm text-terracotta">{actionError}</p>}

        {!address && status !== "Completed" && (
          <button
            onClick={connect}
            className="w-full rounded-full bg-gradient-to-r from-turquoise to-nazar-blue px-4 py-2.5 text-sm font-medium text-white shadow-sm"
          >
            Devam etmek için cüzdanı bağla
          </button>
        )}

        {address && !isMember && status === "Forming" && (
          <p className="text-sm text-muted">
            Bağlı adresiniz bu halkanın üye listesinde değil. Katılabilmek için davet linkiyle
            eklenmeniz gerekir.
          </p>
        )}

        {canJoin && (
          <ActionButton
            label="Halkaya katıl"
            pending={pendingAction === "join"}
            onClick={() =>
              runAction("join", async () => {
                const client = getWalletClient(address!);
                const tx = await client.join_circle({ circle_id: circleId, member: address! });
                const sent = await tx.signAndSend();
                if (sent.result.isErr()) throw new Error(sent.result.unwrapErr().message);
              })
            }
          />
        )}

        {canDeposit && (
          <ActionButton
            label={`Katkı payını yatır (${formatTokenAmount(circle.contribution_amount)})`}
            pending={pendingAction === "deposit"}
            onClick={() =>
              runAction("deposit", async () => {
                const client = getWalletClient(address!);
                const tx = await client.deposit({ circle_id: circleId, member: address! });
                const sent = await tx.signAndSend();
                if (sent.result.isErr()) throw new Error(sent.result.unwrapErr().message);
              })
            }
          />
        )}

        {canReclaim && (
          <ActionButton
            label="Katkımı geri çek"
            pending={pendingAction === "reclaim"}
            variant="secondary"
            onClick={() =>
              runAction("reclaim", async () => {
                const client = getWalletClient(address!);
                const tx = await client.reclaim({ circle_id: circleId, member: address! });
                const sent = await tx.signAndSend();
                if (sent.result.isErr()) throw new Error(sent.result.unwrapErr().message);
              })
            }
          />
        )}

        {canPayout && (
          <ActionButton
            label="Payout'u tetikle"
            pending={pendingAction === "payout"}
            variant="secondary"
            onClick={() =>
              runAction("payout", async () => {
                const signerAddress = address ?? circle.creator;
                const client = getWalletClient(signerAddress);
                const tx = await client.payout({ circle_id: circleId });
                const sent = await tx.signAndSend();
                if (sent.result.isErr()) throw new Error(sent.result.unwrapErr().message);
              })
            }
          />
        )}
      </div>

      {status === "Forming" && joinUrl && (
        <div className="rounded-xl border-2 border-dashed border-gold/50 bg-gold/5 p-4">
          <p className="text-sm font-medium">Davet linki</p>
          <p className="mt-1 break-all font-mono text-xs text-muted">{joinUrl}</p>
          <CopyLinkButton url={joinUrl} />
        </div>
      )}
    </div>
  );
}

function ActionButton({
  label,
  onClick,
  pending,
  variant = "primary",
}: {
  label: string;
  onClick: () => void;
  pending: boolean;
  variant?: "primary" | "secondary";
}) {
  return (
    <button
      onClick={onClick}
      disabled={pending}
      className={
        variant === "primary"
          ? "w-full rounded-full bg-gradient-to-r from-turquoise to-nazar-blue px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
          : "w-full rounded-full border-2 border-gold/60 px-4 py-2.5 text-sm font-medium text-terracotta-dark transition hover:bg-gold/10 disabled:opacity-50 dark:text-gold-light"
      }
    >
      {pending ? "İşleniyor…" : label}
    </button>
  );
}
