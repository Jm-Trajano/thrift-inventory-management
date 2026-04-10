"use client";

import { usePathname } from "next/navigation";

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
      <p className="text-xs uppercase tracking-[0.22em] text-ink-muted">
        Inventory workspace
      </p>
    </header>
  );
}
