import { revalidatePath } from "next/cache"
import { NextResponse, type NextRequest } from "next/server"

import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    return NextResponse.json({ error: "退出失败" }, { status: 500 })
  }

  revalidatePath("/", "layout")
  return NextResponse.redirect(new URL("/", request.nextUrl.origin), 303)
}
