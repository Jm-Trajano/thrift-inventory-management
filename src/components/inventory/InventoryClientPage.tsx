"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import { Download, Plus } from "lucide-react";
import { toast } from "sonner";

import { FilterBar } from "@/components/inventory/FilterBar";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/button";
import { useItems } from "@/hooks/useItems";
import { exportItemsToCSV } from "@/lib/export";
import type { ItemFilters } from "@/lib/items";
import { hasSupabaseEnv } from "@/lib/supabase/config";

const defaultFilters: ItemFilters = {
  search: "",
  status: "All",
  category: "All",
  condition: "All",
  sortBy: "created_at",
  sortOrder: "desc",
};

export function InventoryClientPage() {
  const [filters, setFilters] = useState<ItemFilters>(defaultFilters);
  const deferredSearch = useDeferredValue(filters.search ?? "");

  const queryFilters = useMemo(
    () => ({
      ...filters,
      search: deferredSearch,
    }),
    [deferredSearch, filters],
  );

  const itemsQuery = useItems(queryFilters);
  const filteredItems = itemsQuery.data ?? [];
  const canExport =
    filteredItems.length > 0 && !itemsQuery.isLoading && !itemsQuery.isFetching;

  return (
    <PageShell
      title="Inventory, arranged for browsing."
      subtitle="Search the floor, filter by status or condition, and scan margins without collapsing into a cramped admin grid."
      action={
        <div className="flex flex-wrap items-center gap-5">
          <button
            type="button"
            onClick={() => {
              if (!canExport) {
                toast.message("Nothing to export yet.", {
                  description:
                    "Use the filters to scope the list, then export when items are visible.",
                });
                return;
              }

              exportItemsToCSV(filteredItems);
              toast.success("CSV export started.");
            }}
            className="inline-flex items-center gap-2 text-sm text-ink-secondary underline decoration-border-subtle underline-offset-4 transition-colors hover:text-ink-primary disabled:cursor-not-allowed disabled:no-underline disabled:opacity-45"
            disabled={!canExport}
          >
            <Download size={15} />
            Export CSV
          </button>

          <Button
            asChild
            className="rounded-none bg-ink-primary px-5 text-canvas hover:bg-ink-primary/90"
          >
            <Link href="/inventory/new">
              <Plus size={15} />
              Add Item
            </Link>
          </Button>
        </div>
      }
    >
      {!hasSupabaseEnv() ? (
        <div className="border border-border-subtle bg-canvas-surface p-6 text-sm leading-6 text-ink-secondary">
          Add your Supabase URL and anon key to `.env.local`, then reload the app
          to turn on live inventory queries.
        </div>
      ) : null}

      <div className="space-y-8">
        <FilterBar
          filters={filters}
          onChange={(patch) =>
            setFilters((current) => ({
              ...current,
              ...patch,
            }))
          }
          onReset={() => setFilters(defaultFilters)}
        />

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-ink-muted">
              Current View
            </p>
            <p className="mt-2 text-sm text-ink-secondary">
              {filteredItems.length} item
              {filteredItems.length === 1 ? "" : "s"} in scope
            </p>
          </div>

          {itemsQuery.error ? (
            <p className="max-w-md text-right text-sm text-status-archived">
              {(itemsQuery.error as Error).message}
            </p>
          ) : null}
        </div>

        <InventoryTable
          items={filteredItems}
          isLoading={itemsQuery.isLoading || itemsQuery.isFetching}
        />
      </div>
    </PageShell>
  );
}
