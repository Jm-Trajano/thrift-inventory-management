import { cn, formatCurrency } from "@/lib/utils";
import type { Item } from "@/types/item";

export function ProfitCell({ item }: { item: Item }) {
  if (item.status === "Sold" && item.sale_price !== null) {
    const profit = item.sale_price - item.cost_price;

    return (
      <span
        className={cn(
          "font-price text-sm",
          profit >= 0 ? "text-status-available" : "text-status-archived",
        )}
      >
        {profit >= 0 ? "+" : ""}
        {formatCurrency(profit)}
      </span>
    );
  }

  const potential = item.selling_price - item.cost_price;

  return <span className="font-price text-sm text-ink-muted">{formatCurrency(potential)}</span>;
}
