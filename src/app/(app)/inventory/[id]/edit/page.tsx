import { ItemForm } from "@/components/inventory/ItemForm";
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
      subtitle="Refine the details, adjust the pricing, and keep the inventory record current."
    >
      <ItemForm mode="edit" itemId={id} />
    </PageShell>
  );
}
