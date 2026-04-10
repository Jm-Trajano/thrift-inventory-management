import { PageShell } from "@/components/layout/PageShell";

export default function NewInventoryItemPage() {
  return (
    <PageShell
      title="Add a new piece."
      subtitle="The inventory form is the next build slice. The route exists now so navigation is stable while the data layer and browse screens are being wired."
    >
      <div className="max-w-2xl border border-border-subtle bg-canvas-surface p-8 text-sm leading-6 text-ink-secondary">
        The add-item form is queued next. This placeholder keeps the route live
        while the browsing flow and data hooks are being finished.
      </div>
    </PageShell>
  );
}
