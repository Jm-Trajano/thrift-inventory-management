"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/components/providers/AuthProvider";
import { getItemById } from "@/lib/items";
import { hasSupabaseEnv } from "@/lib/supabase/config";

export function useItem(id?: string) {
  const { supabase } = useAuth();

  return useQuery({
    queryKey: ["item", id],
    enabled: hasSupabaseEnv() && !!supabase && !!id,
    queryFn: async () => {
      if (!supabase || !id) {
        return null;
      }

      return getItemById(id, supabase);
    },
  });
}
