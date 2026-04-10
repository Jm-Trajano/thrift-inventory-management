"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/components/providers/AuthProvider";
import { getItemStats } from "@/lib/items";
import { hasSupabaseEnv } from "@/lib/supabase/config";

export function useItemStats() {
  const { supabase } = useAuth();

  return useQuery({
    queryKey: ["item-stats"],
    enabled: hasSupabaseEnv() && !!supabase,
    queryFn: async () => {
      if (!supabase) {
        return getItemStats();
      }

      return getItemStats(supabase);
    },
  });
}
