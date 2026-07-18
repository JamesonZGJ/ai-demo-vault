import { createBrowserClient } from "@supabase/ssr"

import { getSupabaseConfig } from "@/lib/env"
import type { Database } from "@/types/database"

let client: ReturnType<typeof createBrowserClient<Database>> | undefined

export function createClient() {
  if (!client) {
    const { url, publishableKey } = getSupabaseConfig()
    client = createBrowserClient<Database>(url, publishableKey)
  }

  return client
}
