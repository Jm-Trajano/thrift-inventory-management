import type { ReactNode } from "react";

interface AuthSplitLayoutProps {
  children: ReactNode;
  description: string;
  footer?: ReactNode;
  title: string;
}

export function AuthSplitLayout({
  children,
  description,
  footer,
  title,
}: AuthSplitLayoutProps) {
  return (
    <main className="min-h-screen lg:grid lg:grid-cols-2">
      <section className="hidden bg-ink-primary px-16 py-14 text-canvas lg:flex lg:flex-col lg:justify-between">
        <span className="text-sm uppercase tracking-[0.3em] text-accent">
          Thread & Grain
        </span>

        <div className="space-y-6">
          <h1 className="text-6xl leading-none text-canvas">
            Every piece
            <br />
            has a story.
          </h1>
          <p className="max-w-xs text-lg leading-8 text-canvas/70">
            Track it from rack to receipt with an inventory system built for
            one-of-one finds.
          </p>
        </div>

        <p className="text-xs uppercase tracking-[0.24em] text-canvas/55">
          Inventory Management System
        </p>
      </section>

      <section className="flex min-h-screen flex-col justify-center px-8 py-16 sm:px-12 lg:px-24">
        <div className="mb-14 space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-accent-dark lg:hidden">
            Thread & Grain
          </p>
          <h2 className="text-4xl text-ink-primary">{title}</h2>
          <p className="max-w-md text-sm leading-6 text-ink-secondary">
            {description}
          </p>
        </div>

        <div className="max-w-md space-y-8">
          {children}
          {footer ? <div className="pt-2">{footer}</div> : null}
        </div>
      </section>
    </main>
  );
}
