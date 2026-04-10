import { PageShell } from "@/components/layout/PageShell";

export default async function EditInventoryItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <PageShell
      title="Edit item."
      subtitle={`Edit route ready for item ${id}. The full editorial form experience comes in the next implementation pass.`}
    >
      <div className="max-w-2xl border border-border-subtle bg-canvas-surface p-8 text-sm leading-6 text-ink-secondary">
        The edit form is not wired yet, but this route now exists so row actions
        and future navigation do not dead-end.
      </div>
    </PageShell>
  );
}
