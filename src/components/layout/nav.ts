import {
  BarChart3,
  Package2,
  PlusCircle,
  type LucideIcon,
} from "lucide-react";

export interface AppNavLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const appNavLinks: AppNavLink[] = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/inventory", label: "Inventory", icon: Package2 },
  { href: "/inventory/new", label: "Add Item", icon: PlusCircle },
];

export function isNavLinkActive(pathname: string, href: string) {
  return pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
}
