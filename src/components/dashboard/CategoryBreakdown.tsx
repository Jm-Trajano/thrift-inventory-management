"use client";

import { useDashboardAnalytics } from "@/hooks/useDashboardAnalytics";
import { formatCurrency } from "@/lib/utils";

export function CategoryBreakdown() {
  const { categorySeries, isLoading } = useDashboardAnalytics();

  return (
    <section className="border border-border-subtle bg-canvas-surface p-6">
      <div className="mb-6 space-y-2">
        <p className="text-xs uppercase tracking-[0.24em] text-ink-muted">
          Category Breakdown
        </p>
        <h3 className="text-2xl text-ink-primary">Where the strongest margins sit</h3>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-12 animate-pulse bg-background/70" />
          ))}
        </div>
      ) : categorySeries.length === 0 ? (
        <div className="text-sm text-ink-muted">
          Category performance will appear once inventory records are available.
        </div>
      ) : (
        <div className="space-y-4">
          {categorySeries.map((entry) => (
            <div key={entry.category} className="border-b border-border-subtle pb-4 last:border-b-0">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-ink-primary">{entry.category}</p>
                  <p className="text-xs uppercase tracking-[0.22em] text-ink-muted">
                    {entry.count} item{entry.count === 1 ? "" : "s"}
                  </p>
                </div>
                <p className="font-price text-sm text-ink-primary">
                  {formatCurrency(entry.profit)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
