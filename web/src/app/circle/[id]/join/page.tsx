import { JoinCircleCard } from "@/components/join-circle-card";

export default async function JoinCirclePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <JoinCircleCard circleId={BigInt(id)} />
    </main>
  );
}
