import { CategoryBreakdown } from "@/components/dashboard/CategoryBreakdown";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { StatsRow } from "@/components/dashboard/StatsRow";
import { PageShell } from "@/components/layout/PageShell";

export default function DashboardPage() {
  return (
    <PageShell
      title="A clear read on the floor."
      subtitle="The dashboard is now wired to the shared stats hook. Once Supabase is connected, these totals will reflect your live inventory and sales."
    >
      <div className="space-y-10">
        <StatsRow />
        <div className="grid gap-8 xl:grid-cols-[1.35fr_1fr]">
          <SalesChart />
          <CategoryBreakdown />
        </div>
        <RecentActivity />
      </div>
    </PageShell>
  );
}
