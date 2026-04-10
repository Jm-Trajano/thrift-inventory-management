import { cn, formatCurrency } from "@/lib/utils";

export function ProfitPreview({
  cost,
  price,
}: {
  cost: number;
  price: number;
}) {
  const profit = (price || 0) - (cost || 0);
  const margin = price > 0 ? (profit / price) * 100 : 0;

  return (
    <div className="flex flex-wrap gap-8 border-t border-border-subtle py-4">
      <div>
        <p className="mb-1 text-xs uppercase tracking-[0.24em] text-ink-muted">
          Estimated Profit
        </p>
        <p
          className={cn(
            "text-2xl",
            profit >= 0 ? "text-status-available" : "text-status-archived",
          )}
        >
          {formatCurrency(profit)}
        </p>
      </div>
      <div>
        <p className="mb-1 text-xs uppercase tracking-[0.24em] text-ink-muted">
          Margin
        </p>
        <p className="text-2xl text-ink-primary">{margin.toFixed(1)}%</p>
      </div>
    </div>
  );
}
