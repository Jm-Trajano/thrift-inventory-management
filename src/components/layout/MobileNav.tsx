"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { appNavLinks, isNavLinkActive } from "@/components/layout/nav";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border-subtle bg-background/95 px-3 py-2 backdrop-blur lg:hidden">
      <ul className="grid grid-cols-3 gap-2">
        {appNavLinks.map((link) => {
          const isActive = isNavLinkActive(pathname, link.href);

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-sm px-2 py-2 text-[11px] uppercase tracking-[0.18em] transition-colors",
                  isActive
                    ? "bg-canvas-surface text-ink-primary"
                    : "text-ink-secondary",
                )}
              >
                <link.icon size={18} />
                <span>{link.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
