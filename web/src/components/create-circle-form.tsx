"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { StrKey } from "@stellar/stellar-sdk";

import { getWalletClient } from "@/lib/circle-client";
import { TOKEN_OPTIONS } from "@/lib/config";
import { describeError } from "@/lib/errors";
import { parseTokenAmount } from "@/lib/format";
import { useWallet } from "@/lib/wallet";

export function CreateCircleForm() {
  const { address, connect } = useWallet();
  const router = useRouter();

  const [members, setMembers] = useState<string[]>(["", ""]);
  const [tokenId, setTokenId] = useState<string>(TOKEN_OPTIONS[0].id);
  const [amount, setAmount] = useState("10");
  const [timeoutHours, setTimeoutHours] = useState("24");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateMember(index: number, value: string) {
    setMembers((prev) => prev.map((m, i) => (i === index ? value : m)));
  }

  function addMember() {
    setMembers((prev) => [...prev, ""]);
  }

  function removeMember(index: number) {
    setMembers((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!address) {
      setError("Önce cüzdanınızı bağlamalısınız.");
      return;
    }

    const trimmedMembers = members.map((m) => m.trim());
    if (trimmedMembers.some((m) => !m)) {
      setError("Tüm üye adresleri doldurulmalı.");
      return;
    }
    if (trimmedMembers.some((m) => !StrKey.isValidEd25519PublicKey(m))) {
      setError("Bir veya daha fazla üye adresi geçerli bir Stellar adresi (G…) değil.");
      return;
    }
    if (new Set(trimmedMembers).size !== trimmedMembers.length) {
      setError("Üye listesinde tekrar eden bir adres var.");
      return;
    }
    if (trimmedMembers.length < 2) {
      setError("Bir halka en az 2 üyeden oluşmalı.");
      return;
    }

    let contributionAmount: bigint;
    try {
      contributionAmount = parseTokenAmount(amount);
    } catch (e) {
      setError(describeError(e));
      return;
    }

    const hours = Number(timeoutHours);
    if (!Number.isFinite(hours) || hours <= 0) {
      setError("Round süresi sıfırdan büyük olmalı.");
      return;
    }
    const roundTimeoutSecs = BigInt(Math.round(hours * 3600));

    setIsSubmitting(true);
    try {
      const client = getWalletClient(address);
      const tx = await client.create_circle({
        creator: address,
        token: tokenId,
        members: trimmedMembers,
        payout_order: trimmedMembers,
        contribution_amount: contributionAmount,
        round_timeout_secs: roundTimeoutSecs,
      });
      const sent = await tx.signAndSend();
      const result = sent.result;
      if (result.isErr()) {
        throw new Error(result.unwrapErr().message);
      }
      const circleId = result.unwrap();
      router.push(`/circle/${circleId}`);
    } catch (e) {
      setError(describeError(e));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border-2 border-card-border bg-card p-6 shadow-[0_4px_0_0_var(--card-border)]"
    >
      <div>
        <h2 className="text-lg font-semibold text-nazar-blue-dark dark:text-gold-light">
          Yeni halka oluştur
        </h2>
        <p className="mt-1 text-sm text-muted">
          Üyeleri davet et, katkı miktarını belirle. Ödeme sırası, aşağıdaki üye sırasını
          takip eder.
        </p>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">Üyeler</label>
        {members.map((member, index) => (
          <div key={index} className="flex gap-2">
            <input
              value={member}
              onChange={(e) => updateMember(index, e.target.value)}
              placeholder={`Üye ${index + 1} adresi (G…)`}
              className="flex-1 rounded-lg border border-card-border bg-background px-3 py-2 font-mono text-sm outline-none focus:border-turquoise"
            />
            {members.length > 2 && (
              <button
                type="button"
                onClick={() => removeMember(index)}
                className="rounded-lg px-3 text-sm text-muted hover:bg-terracotta/10 hover:text-terracotta"
              >
                Sil
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addMember}
          className="text-sm font-medium text-turquoise-dark hover:underline dark:text-turquoise"
        >
          + Üye ekle
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Token</label>
          <select
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
            className="mt-1 w-full rounded-lg border border-card-border bg-background px-3 py-2 text-sm outline-none focus:border-turquoise"
          >
            {TOKEN_OPTIONS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Round süresi (saat)</label>
          <input
            type="number"
            min={1}
            value={timeoutHours}
            onChange={(e) => setTimeoutHours(e.target.value)}
            className="mt-1 w-full rounded-lg border border-card-border bg-background px-3 py-2 text-sm outline-none focus:border-turquoise"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Katkı miktarı (üye başı / round)</label>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="10"
          className="mt-1 w-full rounded-lg border border-card-border bg-background px-3 py-2 text-sm outline-none focus:border-turquoise"
        />
      </div>

      {error && <p className="text-sm text-terracotta">{error}</p>}

      {address ? (
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-gradient-to-r from-turquoise to-nazar-blue px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? "Oluşturuluyor…" : "Halkayı oluştur"}
        </button>
      ) : (
        <button
          type="button"
          onClick={connect}
          className="w-full rounded-full bg-gradient-to-r from-turquoise to-nazar-blue px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:opacity-90"
        >
          Devam etmek için cüzdanı bağla
        </button>
      )}
    </form>
  );
}
