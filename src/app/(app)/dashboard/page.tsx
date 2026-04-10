import { StatsRow } from "@/components/dashboard/StatsRow";
import { PageShell } from "@/components/layout/PageShell";

export default function DashboardPage() {
  return (
    <PageShell
      title="A clear read on the floor."
      subtitle="The dashboard is now wired to the shared stats hook. Once Supabase is connected, these totals will reflect your live inventory and sales."
    >
      <StatsRow />
    </PageShell>
  );
}
