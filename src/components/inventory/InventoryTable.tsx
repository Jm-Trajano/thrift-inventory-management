import Link from "next/link";

import { InventoryRow } from "@/components/inventory/InventoryRow";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Item } from "@/types/item";

interface InventoryTableProps {
  items: Item[];
  isLoading: boolean;
}

export function InventoryTable({ items, isLoading }: InventoryTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3 pt-8">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-[2.2fr_repeat(5,1fr)_80px] gap-4 border-b border-border-subtle py-5"
          >
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="ml-auto h-8 w-8 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="mb-3 text-2xl text-ink-muted">Nothing here yet.</p>
        <p className="mb-8 text-sm text-ink-muted">
          Add your first item to get started.
        </p>
        <Button asChild variant="outline" className="rounded-none">
          <Link href="/inventory/new">
            + Add Item
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="pt-8">
      <Table className="w-full border-collapse">
        <TableHeader>
          <TableRow className="border-border-subtle hover:bg-transparent">
            <TableHead className="h-auto px-0 py-4 text-xs uppercase tracking-[0.24em] text-ink-muted">
              Item
            </TableHead>
            <TableHead className="h-auto px-2 py-4 text-xs uppercase tracking-[0.24em] text-ink-muted">
              Category
            </TableHead>
            <TableHead className="h-auto px-2 py-4 text-xs uppercase tracking-[0.24em] text-ink-muted">
              Condition
            </TableHead>
            <TableHead className="h-auto px-2 py-4 text-xs uppercase tracking-[0.24em] text-ink-muted">
              Status
            </TableHead>
            <TableHead className="h-auto px-2 py-4 text-xs uppercase tracking-[0.24em] text-ink-muted">
              Price
            </TableHead>
            <TableHead className="h-auto px-2 py-4 text-xs uppercase tracking-[0.24em] text-ink-muted">
              Profit
            </TableHead>
            <TableHead className="h-auto px-2 py-4 text-xs uppercase tracking-[0.24em] text-ink-muted">
              Added
            </TableHead>
            <TableHead className="h-auto px-0 py-4 text-right text-xs uppercase tracking-[0.24em] text-ink-muted">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <InventoryRow key={item.id} item={item} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
