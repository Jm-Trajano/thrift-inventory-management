"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { logout } from "@/app/login/actions";
import { appNavLinks, isNavLinkActive } from "@/components/layout/nav";
import { cn } from "@/lib/utils";

export function Sidebar({ userEmail }: { userEmail?: string }) {
  const pathname = usePathname();

  return (
    <nav className="hidden min-h-screen w-60 flex-col border-r border-border-subtle px-8 py-10 lg:flex">
      <div className="mb-12">
        <span className="font-display text-lg text-ink-primary">
          Thread & Grain
        </span>
        <span className="mt-0.5 block text-xs uppercase tracking-[0.24em] text-ink-muted">
          IMS
        </span>
      </div>

      <ul className="flex-1 space-y-1">
        {appNavLinks.map((link) => {
          const isActive = isNavLinkActive(pathname, link.href);

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "flex items-center gap-3 border-l-2 py-2 pl-3 text-sm transition-colors",
                  isActive
                    ? "border-accent text-ink-primary"
                    : "border-transparent text-ink-secondary hover:text-ink-primary",
                )}
              >
                <link.icon size={15} />
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto border-t border-border-subtle pt-6">
        <p className="mb-3 truncate text-xs text-ink-muted">
          {userEmail ?? "Signed-in shop account"}
        </p>
        <form action={logout}>
          <button
            type="submit"
            className="text-xs text-ink-muted transition-colors hover:text-ink-primary"
          >
            Sign out
          </button>
        </form>
      </div>
    </nav>
  );
}
