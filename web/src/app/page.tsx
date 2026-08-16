import { CreateCircleForm } from "@/components/create-circle-form";
import { NazarBead } from "@/components/nazar-bead";

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <div className="flex items-center gap-3">
        <NazarBead size={22} />
        <span className="text-xs font-semibold tracking-[0.2em] text-terracotta uppercase">
          Digital Altın Günü
        </span>
        <NazarBead size={22} />
      </div>
      <h1 className="mt-3 bg-gradient-to-r from-turquoise-dark via-nazar-blue to-terracotta bg-clip-text text-4xl font-bold tracking-tight text-transparent">
        Halka
      </h1>
      <p className="mt-4 text-muted">
        A group pays a fixed contribution every round; the pool is automatically paid out to
        the member whose turn it is once that round is complete. The money is never held by a
        single person or institution — the rule is written into the Stellar Soroban contract.
      </p>
      <div className="mt-10">
        <CreateCircleForm />
      </div>
    </main>
  );
}
