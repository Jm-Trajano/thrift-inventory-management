import Papa from "papaparse";

import type { Item } from "@/types/item";

function formatCsvDate(value: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function exportItemsToCSV(items: Item[]) {
  const rows = items.map((item) => ({
    Name: item.name,
    Brand: item.brand ?? "",
    Size: item.size ?? "",
    Category: item.category ?? "",
    Condition: item.condition ?? "",
    "Cost Price": item.cost_price,
    "Selling Price": item.selling_price,
    "Sale Price": item.sale_price ?? "",
    Status: item.status,
    "Date Sold": item.date_sold ?? "",
    Profit:
      item.status === "Sold" && item.sale_price !== null
        ? (item.sale_price - item.cost_price).toFixed(2)
        : "",
    Notes: item.notes ?? "",
    "Date Added": formatCsvDate(item.created_at),
  }));

  const csv = Papa.unparse(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `inventory-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();

  URL.revokeObjectURL(url);
}
