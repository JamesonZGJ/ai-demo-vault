import { createBrowserClient } from "@supabase/ssr"

import { requireSupabaseConfig } from "@/lib/env"
import type { Database } from "@/types/database"

let client: ReturnType<typeof createBrowserClient<Database>> | undefined

export function createClient() {
  if (!client) {
    const { url, publishableKey } = requireSupabaseConfig()
    client = createBrowserClient<Database>(url, publishableKey)
  }

  return client
}
