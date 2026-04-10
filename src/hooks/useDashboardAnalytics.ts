"use client";

import { useMemo } from "react";
import { format } from "date-fns";

import { useItems } from "@/hooks/useItems";
import type { Item } from "@/types/item";

interface SalesPoint {
  label: string;
  sales: number;
  revenue: number;
}

interface CategoryPoint {
  category: string;
  profit: number;
  count: number;
}

interface ActivityItem {
  id: string;
  title: string;
  meta: string;
  timestamp: string;
  type: "sold" | "added";
}

function buildSalesSeries(items: Item[]): SalesPoint[] {
  const sold = items.filter((item) => item.status === "Sold");
  const grouped = new Map<string, SalesPoint>();

  sold.forEach((item) => {
    const soldDate = item.date_sold ?? item.updated_at ?? item.created_at;
    const date = new Date(soldDate);

    if (Number.isNaN(date.getTime())) {
      return;
    }

    const key = format(date, "yyyy-MM");
    const existing = grouped.get(key) ?? {
      label: format(date, "MMM yyyy"),
      sales: 0,
      revenue: 0,
    };

    existing.sales += 1;
    existing.revenue += item.sale_price ?? item.selling_price;
    grouped.set(key, existing);
  });

  return [...grouped.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .slice(-6)
    .map(([, value]) => value);
}

function buildCategorySeries(items: Item[]): CategoryPoint[] {
  const grouped = new Map<string, CategoryPoint>();

  items.forEach((item) => {
    const category = item.category ?? "Others";
    const existing = grouped.get(category) ?? {
      category,
      profit: 0,
      count: 0,
    };

    const realizedProfit =
      item.status === "Sold" && item.sale_price !== null
        ? item.sale_price - item.cost_price
        : item.selling_price - item.cost_price;

    existing.profit += realizedProfit;
    existing.count += 1;
    grouped.set(category, existing);
  });

  return [...grouped.values()]
    .sort((left, right) => right.profit - left.profit)
    .slice(0, 5);
}

function buildRecentActivity(items: Item[]): ActivityItem[] {
  const soldActivities = items
    .filter((item) => item.status === "Sold")
    .map((item) => ({
      id: `${item.id}-sold`,
      title: `${item.name} sold`,
      meta: item.brand ?? "No brand",
      timestamp: item.date_sold ?? item.updated_at,
      type: "sold" as const,
    }));

  const addedActivities = items.map((item) => ({
    id: `${item.id}-added`,
    title: `${item.name} added`,
    meta: item.category ?? "Uncategorized",
    timestamp: item.created_at,
    type: "added" as const,
  }));

  return [...soldActivities, ...addedActivities]
    .sort(
      (left, right) =>
        new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime(),
    )
    .slice(0, 6);
}

export function useDashboardAnalytics() {
  const itemsQuery = useItems({
    status: "All",
    sortBy: "created_at",
    sortOrder: "desc",
  });

  const analytics = useMemo(() => {
    const items = itemsQuery.data ?? [];

    return {
      salesSeries: buildSalesSeries(items),
      categorySeries: buildCategorySeries(items),
      recentActivity: buildRecentActivity(items),
    };
  }, [itemsQuery.data]);

  return {
    ...itemsQuery,
    ...analytics,
  };
}
