"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/components/providers/AuthProvider";
import { getItems, type ItemFilters } from "@/lib/items";
import { hasSupabaseEnv } from "@/lib/supabase/config";

export function useItems(filters: ItemFilters) {
  const { supabase } = useAuth();

  return useQuery({
    queryKey: ["items", filters],
    enabled: hasSupabaseEnv() && !!supabase,
    queryFn: async () => {
      if (!supabase) {
        return [];
      }

      return getItems(filters, supabase);
    },
    placeholderData: (previousData) => previousData,
  });
}
