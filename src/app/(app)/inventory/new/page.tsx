import { ItemForm } from "@/components/inventory/ItemForm";
import { PageShell } from "@/components/layout/PageShell";

export default function NewInventoryItemPage() {
  return (
    <PageShell
      title="Add a new piece."
      subtitle="Capture the piece once, and the inventory view plus dashboard can stay in sync from there."
    >
      <ItemForm mode="create" />
    </PageShell>
  );
}
