"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";

import type { ItemFilters } from "@/lib/items";
import {
  ITEM_CATEGORIES,
  ITEM_CONDITIONS,
  ITEM_STATUSES,
  type ItemCategory,
  type ItemCondition,
  type ItemStatus,
} from "@/types/item";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterBarProps {
  filters: ItemFilters;
  onChange: (patch: Partial<ItemFilters>) => void;
  onReset: () => void;
}

export function FilterBar({ filters, onChange, onReset }: FilterBarProps) {
  return (
    <section className="space-y-6 border-b border-border-subtle pb-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-ink-muted">
          <SlidersHorizontal size={14} />
          Inventory Filters
        </div>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 self-start text-xs uppercase tracking-[0.24em] text-ink-muted transition-colors hover:text-ink-primary"
        >
          <X size={12} />
          Reset
        </button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.8fr)_repeat(4,minmax(0,1fr))]">
        <label className="flex items-center gap-3 border-b border-ink-secondary pb-3 text-sm text-ink-secondary focus-within:border-ink-primary">
          <Search size={16} className="text-ink-muted" />
          <input
            value={filters.search ?? ""}
            onChange={(event) => onChange({ search: event.target.value })}
            placeholder="Search by item name, brand, or notes"
            className="w-full bg-transparent text-ink-primary outline-none placeholder:text-ink-muted"
          />
        </label>

        <FilterSelect
          value={filters.status ?? "All"}
          placeholder="Status"
          options={["All", ...ITEM_STATUSES]}
          onValueChange={(value) =>
            onChange({ status: value as ItemStatus | "All" })
          }
        />

        <FilterSelect
          value={filters.category ?? "All"}
          placeholder="Category"
          options={["All", ...ITEM_CATEGORIES]}
          onValueChange={(value) =>
            onChange({ category: value as ItemCategory | "All" })
          }
        />

        <FilterSelect
          value={filters.condition ?? "All"}
          placeholder="Condition"
          options={["All", ...ITEM_CONDITIONS]}
          onValueChange={(value) =>
            onChange({ condition: value as ItemCondition | "All" })
          }
        />

        <FilterSelect
          value={filters.sortBy ?? "created_at"}
          placeholder="Sort by"
          options={["created_at", "selling_price", "name", "profit"]}
          labels={{
            created_at: "Date Added",
            selling_price: "Selling Price",
            name: "Name",
            profit: "Profit",
          }}
          onValueChange={(value) =>
            onChange({ sortBy: value as ItemFilters["sortBy"] })
          }
        />

        <FilterSelect
          value={filters.sortOrder ?? "desc"}
          placeholder="Order"
          options={["desc", "asc"]}
          labels={{ desc: "Newest First", asc: "Oldest First" }}
          onValueChange={(value) =>
            onChange({ sortOrder: value as "asc" | "desc" })
          }
        />
      </div>
    </section>
  );
}

function FilterSelect({
  value,
  placeholder,
  options,
  labels,
  onValueChange,
}: {
  value: string;
  placeholder: string;
  options: readonly string[];
  labels?: Record<string, string>;
  onValueChange: (value: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="h-11 w-full rounded-none border-0 border-b border-ink-secondary px-0 text-left shadow-none focus-visible:ring-0">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="rounded-none border border-border-subtle bg-canvas-surface">
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {labels?.[option] ?? option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
