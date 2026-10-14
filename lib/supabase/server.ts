import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Cliente com service role: uso exclusivo em server actions / route handlers.
// Nunca importar em componentes client.
let cached: SupabaseClient | null = null;

export function getServiceClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null; // dev sem backend: actions degradam com log
  if (!cached) cached = createClient(url, key, { auth: { persistSession: false } });
  return cached;
}
