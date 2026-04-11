"use client";

import { usePathname } from "next/navigation";

import { logout } from "@/app/login/actions";

const routeTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/inventory": "Inventory",
  "/inventory/new": "Add Item",
};

function resolveTitle(pathname: string) {
  if (routeTitles[pathname]) {
    return routeTitles[pathname];
  }

  if (pathname.startsWith("/inventory/")) {
    return "Item Details";
  }

  return "Thrift IMS";
}

export function TopBar() {
  const pathname = usePathname();

  return (
    <header className="flex h-12 items-center justify-between border-b border-border-subtle px-6 lg:px-10">
      <h2 className="text-xl text-ink-primary">{resolveTitle(pathname)}</h2>
      <div className="flex items-center gap-4">
        <p className="hidden text-xs uppercase tracking-[0.22em] text-ink-muted sm:block">
          Inventory workspace
        </p>
        <form action={logout} className="lg:hidden">
          <button
            type="submit"
            className="text-[11px] uppercase tracking-[0.18em] text-ink-muted transition-colors hover:text-ink-primary"
          >
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
