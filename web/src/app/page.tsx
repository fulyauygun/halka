import { CreateCircleForm } from "@/components/create-circle-form";

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">
        Dijital &quot;Altın Günü&quot;
      </h1>
      <p className="mt-3 text-neutral-500">
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
