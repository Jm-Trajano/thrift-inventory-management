"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Ellipsis, ExternalLink, PencilLine, RotateCcw, Tag, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ProfitCell } from "@/components/inventory/ProfitCell";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatCurrency, formatShortDate } from "@/lib/utils";
import type { Item } from "@/types/item";

export function InventoryRow({ item }: { item: Item }) {
  const router = useRouter();

  const futureMutationMessage = () => {
    toast.message("Item mutations come next", {
      description:
        "The menu shell is in place. Sale, restore, and archive actions will be connected when the mutation flow is added.",
    });
  };

  return (
    <TableRow className="border-border-subtle hover:bg-canvas-surface/80">
      <TableCell className="py-5 pl-0">
        <div className="space-y-1">
          <Link
            href={`/inventory/${item.id}`}
            className="font-medium text-ink-primary transition-colors hover:text-accent-dark"
          >
            {item.name}
          </Link>
          <p className="text-xs uppercase tracking-[0.2em] text-ink-muted">
            {item.brand || "Unbranded"} {item.size ? `· Size ${item.size}` : ""}
          </p>
        </div>
      </TableCell>

      <TableCell className="py-5 text-sm text-ink-secondary">
        {item.category ?? "—"}
      </TableCell>

      <TableCell className="py-5 text-sm text-ink-secondary">
        {item.condition ?? "—"}
      </TableCell>

      <TableCell className="py-5">
        <StatusBadge status={item.status} />
      </TableCell>

      <TableCell className="py-5 font-price text-sm text-ink-primary">
        {formatCurrency(item.selling_price)}
      </TableCell>

      <TableCell className="py-5">
        <ProfitCell item={item} />
      </TableCell>

      <TableCell className="py-5 text-sm text-ink-secondary">
        {formatShortDate(item.created_at)}
      </TableCell>

      <TableCell className="py-5 pr-0 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="rounded-full text-ink-secondary hover:text-ink-primary"
              aria-label={`Open actions for ${item.name}`}
            >
              <Ellipsis size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 rounded-none border border-border-subtle bg-canvas-surface"
          >
            <DropdownMenuItem onSelect={() => router.push(`/inventory/${item.id}`)}>
              <ExternalLink size={14} />
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => router.push(`/inventory/${item.id}/edit`)}
            >
              <PencilLine size={14} />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={futureMutationMessage}>
              {item.status === "Sold" ? <RotateCcw size={14} /> : <Tag size={14} />}
              {item.status === "Sold" ? "Restore" : "Mark as Sold"}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={futureMutationMessage} variant="destructive">
              <Trash2 size={14} />
              Archive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
