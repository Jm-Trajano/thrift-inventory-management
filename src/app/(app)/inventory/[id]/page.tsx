import { InventoryItemDetail } from "@/components/inventory/InventoryItemDetail";

export default async function InventoryItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <InventoryItemDetail itemId={id} />;
}
