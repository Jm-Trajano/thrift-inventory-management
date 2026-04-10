import { PageShell } from "@/components/layout/PageShell";

export default async function InventoryItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <PageShell
      title="Item detail is staged next."
      subtitle={`Detail route ready for item ${id}. The full article-style item view comes after the inventory list and forms are complete.`}
    >
      <div className="max-w-2xl border border-border-subtle bg-canvas-surface p-8 text-sm leading-6 text-ink-secondary">
        This route is live so inventory links have a stable destination. The
        detailed item layout and mutation controls are the next feature slice.
      </div>
    </PageShell>
  );
}
