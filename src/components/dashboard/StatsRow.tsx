"use client";

import { useItemStats } from "@/hooks/useItemStats";
import { formatCurrency } from "@/lib/utils";

const statLabels = [
  "Total Items",
  "Available",
  "Sold",
  "Revenue",
  "Profit",
  "Avg Margin",
] as const;

export function StatsRow() {
  const statsQuery = useItemStats();
  const stats = statsQuery.data;

  const values = [
    stats?.totalItems ?? 0,
    stats?.availableItems ?? 0,
    stats?.soldItems ?? 0,
    formatCurrency(stats?.totalRevenue ?? 0),
    formatCurrency(stats?.totalProfit ?? 0),
    `${(stats?.avgMargin ?? 0).toFixed(1)}%`,
  ];

  return (
    <section className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
      {statLabels.map((label, index) => (
        <div key={label} className="border-b border-border-subtle pb-6">
          <p className="mb-2 text-xs uppercase tracking-[0.24em] text-ink-muted">
            {label}
          </p>
          <p className="font-display text-4xl text-ink-primary">
            {values[index]}
          </p>
        </div>
      ))}
    </section>
  );
}
