import { z } from "zod";

import { ITEM_CATEGORIES, ITEM_CONDITIONS } from "@/types/item";

export const itemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  brand: z.string().optional(),
  size: z.string().optional(),
  condition: z.enum(ITEM_CONDITIONS).optional(),
  category: z.enum(ITEM_CATEGORIES).optional(),
  cost_price: z.coerce.number().min(0, "Cost must be 0 or more"),
  selling_price: z.coerce.number().min(0, "Price must be 0 or more"),
  notes: z.string().optional(),
});

export type ItemFormInput = z.input<typeof itemSchema>;
export type ItemFormData = z.output<typeof itemSchema>;
