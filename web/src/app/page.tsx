import { CreateCircleForm } from "@/components/create-circle-form";
import { NazarBead } from "@/components/nazar-bead";

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <div className="flex items-center gap-3">
        <NazarBead size={22} />
        <span className="text-xs font-semibold tracking-[0.2em] text-terracotta uppercase">
          Dijital Altın Günü
        </span>
        <NazarBead size={22} />
      </div>
      <h1 className="mt-3 bg-gradient-to-r from-turquoise-dark via-nazar-blue to-terracotta bg-clip-text text-4xl font-bold tracking-tight text-transparent">
        Halka
      </h1>
      <p className="mt-4 text-muted">
        Bir grup, sabit bir katkı miktarını her round&apos;da öder; havuz o round
        tamamlandığında sırası gelen üyeye otomatik olarak ödenir. Para hiçbir zaman tek bir
        kişinin veya kurumun elinde tutulmaz — kural, Stellar Soroban kontratında yazılıdır.
      </p>
      <div className="mt-10">
        <CreateCircleForm />
      </div>
    </main>
  );
}
