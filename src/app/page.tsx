import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getOptionalSupabaseEnv } from "@/lib/supabase/config";

export default async function Home() {
  if (!getOptionalSupabaseEnv()) {
    redirect("/status");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  redirect(user ? "/dashboard" : "/login");
}
