"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { MarkAsSoldDialog } from "@/components/inventory/MarkAsSoldDialog";
import { useAuth } from "@/components/providers/AuthProvider";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useItem } from "@/hooks/useItem";
import { restoreItem, softDeleteItem } from "@/lib/items";
import { formatCurrency, formatShortDate } from "@/lib/utils";
import type { Item } from "@/types/item";

function buildDetailRows(item: Item) {
  return [
    { label: "Category", value: item.category ?? "Not set" },
    { label: "Condition", value: item.condition ?? "Not set" },
    { label: "Size", value: item.size ?? "Not set" },
    { label: "Added", value: formatShortDate(item.created_at) },
    { label: "Sold On", value: item.date_sold ? formatShortDate(item.date_sold) : "Not sold yet" },
    { label: "Notes", value: item.notes ?? "No notes yet." },
  ];
}

export function InventoryItemDetail({ itemId }: { itemId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { supabase } = useAuth();
  const itemQuery = useItem(itemId);

  const invalidateInventory = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["items"] }),
      queryClient.invalidateQueries({ queryKey: ["item-stats"] }),
      queryClient.invalidateQueries({ queryKey: ["item", itemId] }),
    ]);
  };

  const restoreMutation = useMutation({
    mutationFn: async () => {
      if (!supabase) {
        throw new Error("Supabase client is not ready.");
      }

      return restoreItem(itemId, supabase);
    },
    onSuccess: async () => {
      await invalidateInventory();
      toast.success("Item restored to available.");
    },
    onError: (error: unknown) => {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    },
  });

  const archiveMutation = useMutation({
    mutationFn: async () => {
      if (!supabase) {
        throw new Error("Supabase client is not ready.");
      }

      await softDeleteItem(itemId, supabase);
    },
    onSuccess: async () => {
      await invalidateInventory();
      toast.success("Item archived.");
      router.push("/inventory");
      router.refresh();
    },
    onError: (error: unknown) => {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    },
  });

  if (itemQuery.isLoading) {
    return (
      <div className="px-6 py-10 lg:px-10">
        <div className="mx-auto grid max-w-5xl gap-16 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <div className="h-6 w-24 animate-pulse bg-canvas-surface" />
            <div className="h-14 w-72 animate-pulse bg-canvas-surface" />
            <div className="h-6 w-48 animate-pulse bg-canvas-surface" />
            <div className="space-y-4 pt-8">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="h-14 animate-pulse border-b border-border-subtle bg-canvas-surface"
                />
              ))}
            </div>
          </div>
          <div className="aspect-square animate-pulse bg-canvas-surface" />
        </div>
      </div>
    );
  }

  if (!itemQuery.data) {
    return (
      <div className="px-6 py-10 lg:px-10">
        <div className="max-w-2xl border border-border-subtle bg-canvas-surface p-8 text-sm leading-6 text-status-archived">
          This item could not be loaded. It may have been removed or you may
          not have access to it.
        </div>
      </div>
    );
  }

  const item = itemQuery.data;
  const profit =
    (item.status === "Sold" && item.sale_price !== null
      ? item.sale_price
      : item.selling_price) - item.cost_price;
  const detailRows = buildDetailRows(item);

  return (
    <div className="px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <nav className="mb-8 text-xs uppercase tracking-[0.2em] text-ink-muted">
          <Link href="/inventory" className="transition-colors hover:text-ink-primary">
            Inventory
          </Link>
          <span className="mx-2">/</span>
          <span>{item.name}</span>
        </nav>

        <div className="grid gap-16 lg:grid-cols-[1fr_320px]">
          <div>
            <StatusBadge status={item.status} />
            <h1 className="mt-4 text-5xl leading-none text-ink-primary">
              {item.name}
            </h1>
            <p className="mt-3 text-lg text-ink-secondary">
              {item.brand ?? "Unbranded find"}
            </p>

            <dl className="mt-10 space-y-5">
              {detailRows.map((detail) => (
                <div
                  key={detail.label}
                  className="flex flex-col gap-2 border-b border-border-subtle pb-5 sm:flex-row sm:gap-6"
                >
                  <dt className="w-32 text-xs uppercase tracking-[0.24em] text-ink-muted">
                    {detail.label}
                  </dt>
                  <dd className="max-w-2xl text-sm leading-6 text-ink-primary">
                    {detail.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-10 flex flex-wrap gap-10">
              <div>
                <p className="mb-1 text-xs uppercase tracking-[0.24em] text-ink-muted">
                  Cost
                </p>
                <p className="text-3xl text-ink-primary">
                  {formatCurrency(item.cost_price)}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs uppercase tracking-[0.24em] text-ink-muted">
                  {item.status === "Sold" ? "Sold For" : "Listed At"}
                </p>
                <p className="text-3xl text-ink-primary">
                  {formatCurrency(
                    item.status === "Sold" && item.sale_price !== null
                      ? item.sale_price
                      : item.selling_price,
                  )}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs uppercase tracking-[0.24em] text-ink-muted">
                  Profit
                </p>
                <p
                  className={
                    profit >= 0
                      ? "text-3xl text-status-available"
                      : "text-3xl text-status-archived"
                  }
                >
                  {profit >= 0 ? "+" : ""}
                  {formatCurrency(profit)}
                </p>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-sm">
              <Link
                href={`/inventory/${item.id}/edit`}
                className="text-ink-secondary underline decoration-border-subtle underline-offset-4 transition-colors hover:text-ink-primary"
              >
                Edit
              </Link>

              {item.status === "Available" ? (
                <DetailSoldButton item={item} />
              ) : item.status === "Sold" || item.status === "Archived" ? (
                <button
                  type="button"
                  onClick={() => restoreMutation.mutate()}
                  className="text-status-available transition-colors hover:underline"
                  disabled={restoreMutation.isPending}
                >
                  {restoreMutation.isPending ? "Restoring..." : "Restore"}
                </button>
              ) : null}

              {item.status !== "Archived" ? (
                <button
                  type="button"
                  onClick={() => archiveMutation.mutate()}
                  className="text-status-archived transition-colors hover:underline"
                  disabled={archiveMutation.isPending}
                >
                  {archiveMutation.isPending ? "Archiving..." : "Archive"}
                </button>
              ) : null}
            </div>
          </div>

          <div className="h-fit w-full overflow-hidden bg-canvas-surface">
            {item.photo_url ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.photo_url}
                  alt={`${item.name} photo`}
                  className="aspect-square w-full object-cover"
                />
              </>
            ) : (
              <div className="flex aspect-square items-center justify-center text-ink-muted">
                <ImageIcon size={32} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailSoldButton({ item }: { item: Item }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-status-available transition-colors hover:underline"
      >
        Mark as sold
      </button>
      {open ? (
        <MarkAsSoldDialog item={item} open={open} onOpenChange={setOpen} />
      ) : null}
    </>
  );
}
