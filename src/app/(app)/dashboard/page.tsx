import { PageShell } from "@/components/layout/PageShell";

const placeholderStats = [
  { label: "Total Items", value: "0" },
  { label: "Available", value: "0" },
  { label: "Sold", value: "0" },
  { label: "Revenue", value: "₱0.00" },
  { label: "Profit", value: "₱0.00" },
  { label: "Avg Margin", value: "0%" },
];

export default function DashboardPage() {
  return (
    <PageShell
      title="A clear read on the floor."
      subtitle="The shell for your analytics workspace is ready. Once Supabase is connected, this page will pull live item counts, revenue, and profit metrics."
    >
      <section className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
        {placeholderStats.map((stat) => (
          <div
            key={stat.label}
            className="border-b border-border-subtle pb-6"
          >
            <p className="mb-2 text-xs uppercase tracking-[0.24em] text-ink-muted">
              {stat.label}
            </p>
            <p className="font-display text-4xl text-ink-primary">
              {stat.value}
            </p>
          </div>
        ))}
      </section>
    </PageShell>
  );
}
