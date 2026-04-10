import { cn } from "@/lib/utils";
import type { ItemStatus } from "@/types/item";

const config: Record<
  ItemStatus,
  { text: string; dot: string; background: string }
> = {
  Available: {
    text: "text-status-available",
    dot: "bg-status-available",
    background: "bg-status-available/10",
  },
  Sold: {
    text: "text-status-sold",
    dot: "bg-status-sold",
    background: "bg-status-sold/12",
  },
  Archived: {
    text: "text-status-archived",
    dot: "bg-status-archived",
    background: "bg-status-archived/10",
  },
};

export function StatusBadge({ status }: { status: ItemStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        config[status].text,
        config[status].background,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config[status].dot)} />
      {status}
    </span>
  );
}
