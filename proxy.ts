import { NextResponse, type NextRequest } from "next/server"

import { canonicalStaticCatalogQueryString } from "@/lib/catalog/search-params"
import { getSupabaseConfig, isStaticPreviewMode } from "@/lib/env"
import { refreshSession } from "@/lib/supabase/proxy"

async function catalogSlugExists(
  table: "categories" | "tools",
  slug: string,
) {
  const { publishableKey, url } = getSupabaseConfig()
  const endpoint = new URL(`/rest/v1/${table}`, url)
  endpoint.searchParams.set("select", "slug")
  endpoint.searchParams.set("slug", `eq.${slug}`)
  endpoint.searchParams.set("limit", "1")

  const response = await fetch(endpoint, {
    cache: "no-store",
    headers: {
      apikey: publishableKey,
      Authorization: `Bearer ${publishableKey}`,
    },
  })
  if (!response.ok) throw new Error("案例筛选入口校验失败")

  const rows = (await response.json()) as Array<{ slug?: unknown }>
  return rows.length === 1 && rows[0]?.slug === slug
}

export async function proxy(request: NextRequest) {
  if (isStaticPreviewMode()) return NextResponse.next()

  if (request.nextUrl.pathname === "/demos") {
    const canonicalQuery = canonicalStaticCatalogQueryString(
      request.nextUrl.searchParams,
    )
    if (canonicalQuery !== request.nextUrl.searchParams.toString()) {
      const canonicalUrl = request.nextUrl.clone()
      canonicalUrl.search = canonicalQuery
      return NextResponse.redirect(canonicalUrl)
    }

    const category = request.nextUrl.searchParams.get("category")
    const tool = request.nextUrl.searchParams.get("tool")
    const [categoryExists, toolExists] = await Promise.all([
      category ? catalogSlugExists("categories", category) : true,
      tool ? catalogSlugExists("tools", tool) : true,
    ])
    if (!categoryExists || !toolExists) {
      const canonicalUrl = request.nextUrl.clone()
      if (!categoryExists) canonicalUrl.searchParams.delete("category")
      if (!toolExists) canonicalUrl.searchParams.delete("tool")
      canonicalUrl.search = canonicalStaticCatalogQueryString(
        canonicalUrl.searchParams,
      )
      return NextResponse.redirect(canonicalUrl)
    }
  }

  return refreshSession(request)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif)$).*)",
  ],
}
