import { createClient } from "@supabase/supabase-js";

import { getSupabaseConfig } from "../env";
import type { Database } from "../../types/database";

export function createPublicClient() {
  const { publishableKey, url } = getSupabaseConfig();
  return createClient<Database>(url, publishableKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}
