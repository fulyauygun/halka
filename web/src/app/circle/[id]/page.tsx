import { CircleDashboard } from "@/components/circle-dashboard";

export default async function CirclePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <CircleDashboard circleId={BigInt(id)} />
    </main>
  );
}
