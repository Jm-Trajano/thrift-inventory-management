"use client";

import { formatDistanceToNow } from "date-fns";

import { useDashboardAnalytics } from "@/hooks/useDashboardAnalytics";

export function RecentActivity() {
  const { recentActivity, isLoading } = useDashboardAnalytics();

  return (
    <section className="border border-border-subtle bg-canvas-surface p-6">
      <div className="mb-6 space-y-2">
        <p className="text-xs uppercase tracking-[0.24em] text-ink-muted">
          Recent Activity
        </p>
        <h3 className="text-2xl text-ink-primary">The latest movement in the shop</h3>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-12 animate-pulse bg-background/70" />
          ))}
        </div>
      ) : recentActivity.length === 0 ? (
        <div className="text-sm text-ink-muted">
          Activity appears here after items are added or marked as sold.
        </div>
      ) : (
        <div className="space-y-4">
          {recentActivity.map((entry) => (
            <div key={entry.id} className="flex items-start justify-between gap-4 border-b border-border-subtle pb-4 last:border-b-0">
              <div>
                <p className="text-sm text-ink-primary">{entry.title}</p>
                <p className="text-xs uppercase tracking-[0.22em] text-ink-muted">
                  {entry.meta}
                </p>
              </div>
              <p className="text-xs text-ink-muted">
                {formatDistanceToNow(new Date(entry.timestamp), {
                  addSuffix: true,
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
