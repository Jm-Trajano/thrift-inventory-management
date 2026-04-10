export const ITEM_STATUSES = ["Available", "Sold", "Archived"] as const;
export const ITEM_CONDITIONS = [
  "Good",
  "Very Good",
  "Excellent",
  "Like New",
] as const;
export const ITEM_CATEGORIES = [
  "Tops",
  "Bottoms",
  "Dresses",
  "Outerwear",
  "Shoes",
  "Accessories",
  "Others",
] as const;

export type ItemStatus = (typeof ITEM_STATUSES)[number];
export type ItemCondition = (typeof ITEM_CONDITIONS)[number];
export type ItemCategory = (typeof ITEM_CATEGORIES)[number];

export interface Item {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  name: string;
  brand: string | null;
  size: string | null;
  condition: ItemCondition | null;
  category: ItemCategory | null;
  cost_price: number;
  selling_price: number;
  sale_price: number | null;
  status: ItemStatus;
  date_sold: string | null;
  notes: string | null;
  photo_url: string | null;
}

export type NewItem = Omit<
  Item,
  "id" | "created_at" | "updated_at" | "user_id"
>;

export interface ItemStats {
  totalItems: number;
  availableItems: number;
  soldItems: number;
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  avgMargin: number;
}
