"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  Ellipsis,
  ExternalLink,
  PencilLine,
  RotateCcw,
  Tag,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { ArchiveItemDialog } from "@/components/inventory/ArchiveItemDialog";
import { MarkAsSoldDialog } from "@/components/inventory/MarkAsSoldDialog";
import { ProfitCell } from "@/components/inventory/ProfitCell";
import { useAuth } from "@/components/providers/AuthProvider";
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
import { restoreItem } from "@/lib/items";
import { formatCurrency, formatShortDate } from "@/lib/utils";
import type { Item } from "@/types/item";

export function InventoryRow({ item }: { item: Item }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { supabase } = useAuth();
  const [soldDialogOpen, setSoldDialogOpen] = useState(false);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);

  const restoreMutation = useMutation({
    mutationFn: async () => {
      if (!supabase) {
        throw new Error("Supabase client is not ready.");
      }

      return restoreItem(item.id, supabase);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["items"] }),
        queryClient.invalidateQueries({ queryKey: ["item-stats"] }),
        queryClient.invalidateQueries({ queryKey: ["item", item.id] }),
      ]);

      toast.success("Item restored to available.");
    },
    onError: (error: unknown) => {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    },
  });

  return (
    <>
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
              <DropdownMenuItem
                onSelect={() => router.push(`/inventory/${item.id}`)}
              >
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
              {item.status === "Sold" ? (
                <DropdownMenuItem
                  disabled={restoreMutation.isPending}
                  onSelect={() => restoreMutation.mutate()}
                >
                  <RotateCcw size={14} />
                  {restoreMutation.isPending ? "Restoring..." : "Restore"}
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onSelect={() => setSoldDialogOpen(true)}>
                  <Tag size={14} />
                  Mark as Sold
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onSelect={() => setArchiveDialogOpen(true)}
                variant="destructive"
              >
                <Trash2 size={14} />
                Archive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      {soldDialogOpen ? (
        <MarkAsSoldDialog
          item={item}
          open={soldDialogOpen}
          onOpenChange={setSoldDialogOpen}
        />
      ) : null}
      {archiveDialogOpen ? (
        <ArchiveItemDialog
          item={item}
          open={archiveDialogOpen}
          onOpenChange={setArchiveDialogOpen}
        />
      ) : null}
    </>
  );
}
