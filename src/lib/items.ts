import type { SupabaseClient } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/client";
import { hasSupabaseEnv } from "@/lib/supabase/config";
import type {
  Item,
  ItemCategory,
  ItemCondition,
  ItemStats,
  ItemStatus,
  NewItem,
} from "@/types/item";

export interface ItemFilters {
  search?: string;
  status?: ItemStatus | "All";
  category?: ItemCategory | "All";
  condition?: ItemCondition | "All";
  sortBy?: "created_at" | "selling_price" | "name" | "profit";
  sortOrder?: "asc" | "desc";
  dateFrom?: string;
  dateTo?: string;
}

interface ItemRecord {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  name: string;
  brand: string | null;
  size: string | null;
  condition: ItemCondition | null;
  category: ItemCategory | null;
  cost_price: number | string;
  selling_price: number | string;
  sale_price: number | string | null;
  status: ItemStatus;
  date_sold: string | null;
  notes: string | null;
  photo_url: string | null;
}

const emptyStats: ItemStats = {
  totalItems: 0,
  availableItems: 0,
  soldItems: 0,
  totalRevenue: 0,
  totalCost: 0,
  totalProfit: 0,
  avgMargin: 0,
};

function getClient(client?: SupabaseClient) {
  return client ?? createClient();
}

function toNumber(value: number | string | null | undefined) {
  return Number(value ?? 0);
}

function normalizeItem(record: ItemRecord): Item {
  return {
    ...record,
    cost_price: toNumber(record.cost_price),
    selling_price: toNumber(record.selling_price),
    sale_price:
      record.sale_price === null || record.sale_price === undefined
        ? null
        : toNumber(record.sale_price),
  };
}

function getProfit(item: Pick<Item, "cost_price" | "selling_price" | "sale_price">) {
  return (item.sale_price ?? item.selling_price) - item.cost_price;
}

function sortItems(items: Item[], sortBy: ItemFilters["sortBy"], sortOrder: "asc" | "desc") {
  const direction = sortOrder === "asc" ? 1 : -1;

  return [...items].sort((left, right) => {
    switch (sortBy) {
      case "name":
        return left.name.localeCompare(right.name) * direction;
      case "selling_price":
        return (left.selling_price - right.selling_price) * direction;
      case "profit":
        return (getProfit(left) - getProfit(right)) * direction;
      case "created_at":
      default:
        return (
          (new Date(left.created_at).getTime() - new Date(right.created_at).getTime()) *
          direction
        );
    }
  });
}

export async function getItems(
  filters: ItemFilters = {},
  client?: SupabaseClient,
): Promise<Item[]> {
  if (!hasSupabaseEnv()) {
    return [];
  }

  const supabase = getClient(client);
  const sortBy = filters.sortBy ?? "created_at";
  const sortOrder = filters.sortOrder ?? "desc";

  let query = supabase.from("items").select("*").neq("status", "Archived");

  if (filters.search) {
    const search = filters.search.trim();

    if (search) {
      query = query.or(
        `name.ilike.%${search}%,brand.ilike.%${search}%,notes.ilike.%${search}%`,
      );
    }
  }

  if (filters.status && filters.status !== "All") {
    query = query.eq("status", filters.status);
  }

  if (filters.category && filters.category !== "All") {
    query = query.eq("category", filters.category);
  }

  if (filters.condition && filters.condition !== "All") {
    query = query.eq("condition", filters.condition);
  }

  if (filters.dateFrom) {
    query = query.gte("created_at", filters.dateFrom);
  }

  if (filters.dateTo) {
    query = query.lte("created_at", `${filters.dateTo}T23:59:59`);
  }

  const orderColumn = sortBy === "profit" ? "created_at" : sortBy;
  const { data, error } = await query.order(orderColumn, {
    ascending: sortOrder === "asc",
  });

  if (error) {
    throw error;
  }

  const items = ((data ?? []) as ItemRecord[]).map(normalizeItem);

  return sortBy === "profit" ? sortItems(items, sortBy, sortOrder) : items;
}

export async function getItemById(id: string, client?: SupabaseClient): Promise<Item | null> {
  if (!hasSupabaseEnv()) {
    return null;
  }

  const supabase = getClient(client);
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? normalizeItem(data as ItemRecord) : null;
}

export async function createItem(data: NewItem, client?: SupabaseClient): Promise<Item> {
  const supabase = getClient(client);
  const { data: created, error } = await supabase
    .from("items")
    .insert(data)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return normalizeItem(created as ItemRecord);
}

export async function updateItem(
  id: string,
  data: Partial<NewItem>,
  client?: SupabaseClient,
): Promise<Item> {
  const supabase = getClient(client);
  const { data: updated, error } = await supabase
    .from("items")
    .update(data)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return normalizeItem(updated as ItemRecord);
}

export async function softDeleteItem(id: string, client?: SupabaseClient): Promise<void> {
  const supabase = getClient(client);
  const { error } = await supabase.from("items").update({ status: "Archived" }).eq("id", id);

  if (error) {
    throw error;
  }
}

export async function markAsSold(
  id: string,
  salePrice: number,
  dateSold: string,
  client?: SupabaseClient,
): Promise<Item> {
  const supabase = getClient(client);
  const { data: updated, error } = await supabase
    .from("items")
    .update({
      status: "Sold",
      sale_price: salePrice,
      date_sold: dateSold,
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return normalizeItem(updated as ItemRecord);
}

export async function restoreItem(id: string, client?: SupabaseClient): Promise<Item> {
  const supabase = getClient(client);
  const { data: updated, error } = await supabase
    .from("items")
    .update({
      status: "Available",
      sale_price: null,
      date_sold: null,
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return normalizeItem(updated as ItemRecord);
}

export async function getItemStats(client?: SupabaseClient): Promise<ItemStats> {
  if (!hasSupabaseEnv()) {
    return emptyStats;
  }

  const supabase = getClient(client);
  const { data, error } = await supabase
    .from("items")
    .select("status, cost_price, selling_price, sale_price")
    .neq("status", "Archived");

  if (error) {
    throw error;
  }

  const items = (data ?? []).map((record) => ({
    status: record.status as ItemStatus,
    cost_price: toNumber(record.cost_price),
    selling_price: toNumber(record.selling_price),
    sale_price:
      record.sale_price === null || record.sale_price === undefined
        ? null
        : toNumber(record.sale_price),
  }));

  const sold = items.filter((item) => item.status === "Sold");
  const totalRevenue = sold.reduce(
    (sum, item) => sum + (item.sale_price ?? item.selling_price),
    0,
  );
  const totalCost = sold.reduce((sum, item) => sum + item.cost_price, 0);
  const totalProfit = totalRevenue - totalCost;
  const margins = sold
    .map((item) => {
      const soldFor = item.sale_price ?? item.selling_price;
      return soldFor > 0 ? ((soldFor - item.cost_price) / soldFor) * 100 : 0;
    })
    .filter((margin) => Number.isFinite(margin));

  return {
    totalItems: items.length,
    availableItems: items.filter((item) => item.status === "Available").length,
    soldItems: sold.length,
    totalRevenue,
    totalCost,
    totalProfit,
    avgMargin:
      margins.length > 0
        ? margins.reduce((sum, margin) => sum + margin, 0) / margins.length
        : 0,
  };
}

export async function uploadItemPhoto(
  file: File,
  itemId: string,
  client?: SupabaseClient,
): Promise<string> {
  const supabase = getClient(client);
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("You must be signed in to upload a photo.");
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "-").toLowerCase();
  const filePath = `${user.id}/${itemId}-${Date.now()}-${safeName}`;

  const { error } = await supabase.storage
    .from("item-photos")
    .upload(filePath, file, { upsert: true });

  if (error) {
    throw error;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("item-photos").getPublicUrl(filePath);

  return publicUrl;
}
