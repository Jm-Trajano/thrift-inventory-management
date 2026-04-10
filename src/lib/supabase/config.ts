const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function readRequiredEnv(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(
      `Missing ${name}. Copy .env.example to .env.local and fill in your Supabase credentials.`,
    );
  }

  return value;
}

export function getSupabaseEnv() {
  return {
    url: readRequiredEnv("NEXT_PUBLIC_SUPABASE_URL", supabaseUrl),
    anonKey: readRequiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", supabaseAnonKey),
  };
}

export function getOptionalSupabaseEnv() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return {
    url: supabaseUrl,
    anonKey: supabaseAnonKey,
  };
}

export function hasSupabaseEnv() {
  return getOptionalSupabaseEnv() !== null;
}
