const completedSteps = [
  "Step 0.1: Next.js app scaffolded in the repository root.",
  "Step 0.2: Core packages installed for Supabase, forms, charts, and utilities.",
  "Step 0.3: shadcn/ui initialized with the base component set used by the plan.",
  "Step 0.4-0.6: Fonts, editorial theme tokens, and global CSS foundation applied.",
  "Step 1.5-1.7: Env template, Supabase helper modules, and shared item types added.",
  "Repo prep: the tracked SQL migration for the initial Supabase schema is in place.",
  "Step 2.2-2.4: Login UI, auth server actions, and the app provider are implemented.",
  "Step 3.1-3.4: The protected app shell now has a sidebar, top bar, page shell, and dashboard stub.",
];

const nextSteps = [
  "Step 1.1: Create the Supabase project.",
  "Step 1.2-1.4: Run the checked-in SQL migration in Supabase to create the table, RLS rules, and photo bucket policies.",
  "Step 2.1: Confirm route protection with live Supabase credentials and a real account.",
  "Phase 4: Start the item data layer once the database is live.",
];

export default function Home() {
  return (
    <main className="flex-1">
      <section className="page-frame grid min-h-screen gap-16 py-16 lg:grid-cols-[minmax(0,1.1fr)_420px] lg:items-center lg:py-24">
        <div className="flex flex-col justify-between gap-12">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.32em] text-accent-dark">
              Thrift Shop IMS
            </p>
            <h1 className="max-w-3xl text-5xl leading-none text-ink-primary sm:text-6xl lg:text-7xl">
              Every piece has a story. This build now has its foundation.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-ink-secondary">
              The project shell is in place with the editorial type system,
              color palette, Tailwind v4 design tokens, and the shadcn/ui base
              components needed for inventory, dashboard, and auth work.
            </p>
          </div>

          <div className="grid gap-8 border-t border-border-subtle pt-8 text-sm text-ink-secondary md:grid-cols-3">
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.24em] text-ink-muted">
                Current Phase
              </p>
              <p className="font-display text-2xl text-ink-primary">
                Phase 3 shell ready
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.24em] text-ink-muted">
                Design Direction
              </p>
              <p>Editorial, open, typographic, and warm.</p>
            </div>
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.24em] text-ink-muted">
                Next Build Slice
              </p>
              <p>Live Supabase setup, then the item data layer and inventory views.</p>
            </div>
          </div>
        </div>

        <aside
          id="phase-status"
          className="space-y-8 border border-border-subtle bg-canvas-surface p-8"
        >
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.24em] text-ink-muted">
              Build Status
            </p>
            <h2 className="text-3xl text-ink-primary">Completed now</h2>
          </div>

          <ol className="space-y-4">
            {completedSteps.map((step) => (
              <li
                key={step}
                className="flex items-start gap-3 border-b border-border-subtle pb-4 last:border-b-0 last:pb-0"
              >
                <span className="mt-1 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-status-available/12 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-status-available">
                  Done
                </span>
                <span className="text-sm leading-6 text-ink-secondary">
                  {step}
                </span>
              </li>
            ))}
          </ol>

          <div className="space-y-3 border-t border-border-subtle pt-8">
            <p className="text-xs uppercase tracking-[0.24em] text-ink-muted">
              Up next
            </p>
            <ul className="space-y-3 text-sm leading-6 text-ink-secondary">
              {nextSteps.map((step) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </main>
  );
}
