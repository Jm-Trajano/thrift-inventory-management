"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useDashboardAnalytics } from "@/hooks/useDashboardAnalytics";

export function SalesChart() {
  const { salesSeries, isLoading } = useDashboardAnalytics();

  return (
    <section className="border border-border-subtle bg-canvas-surface p-6">
      <div className="mb-6 space-y-2">
        <p className="text-xs uppercase tracking-[0.24em] text-ink-muted">
          Sales Over Time
        </p>
        <h3 className="text-2xl text-ink-primary">Momentum across recent months</h3>
      </div>

      {isLoading ? (
        <div className="h-64 animate-pulse bg-background/70" />
      ) : salesSeries.length === 0 ? (
        <div className="flex h-64 items-center justify-center text-sm text-ink-muted">
          No sold items yet. This chart will wake up after your first completed sale.
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesSeries} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
              <CartesianGrid stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="label" axisLine={false} tickLine={false} stroke="var(--ink-muted)" />
              <YAxis axisLine={false} tickLine={false} stroke="var(--ink-muted)" />
              <Tooltip
                cursor={{ fill: "rgba(200,169,110,0.08)" }}
                contentStyle={{
                  borderRadius: 0,
                  border: "1px solid var(--border-subtle)",
                  background: "var(--background)",
                }}
              />
              <Bar dataKey="sales" fill="var(--accent)" radius={0} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
