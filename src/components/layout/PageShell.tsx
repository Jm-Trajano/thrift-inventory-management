import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface PageShellProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function PageShell({
  title,
  subtitle,
  action,
  children,
  className,
}: PageShellProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <div className="border-b border-border-subtle px-6 pb-8 pt-12 lg:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl text-ink-primary lg:text-4xl">{title}</h1>
            {subtitle ? (
              <p className="max-w-2xl text-sm leading-6 text-ink-secondary">
                {subtitle}
              </p>
            ) : null}
          </div>
          {action ? <div>{action}</div> : null}
        </div>
      </div>

      <div className="flex-1 px-6 py-10 lg:px-10">{children}</div>
    </div>
  );
}
