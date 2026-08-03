import type { EmailOtpType } from "@supabase/supabase-js"
import { NextResponse, type NextRequest } from "next/server"

import { registeredDestination } from "@/lib/auth/registration-destination"
import { safeReturnTo } from "@/lib/auth/return-to"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code")
  const tokenHash = request.nextUrl.searchParams.get("token_hash")
  const type = request.nextUrl.searchParams.get("type") as EmailOtpType | null
  const returnTo = safeReturnTo(request.nextUrl.searchParams.get("returnTo"))
  const supabase = await createClient()

  let error: Error | null = null
  if (code) {
    ;({ error } = await supabase.auth.exchangeCodeForSession(code))
  } else if (tokenHash && type) {
    ;({ error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash }))
  } else {
    error = new Error("缺少确认参数")
  }

  if (error) {
    const failed = new URL("/login", request.nextUrl.origin)
    failed.searchParams.set("error", "confirmation-failed")
    return NextResponse.redirect(failed)
  }

  return NextResponse.redirect(
    new URL(registeredDestination(returnTo), request.nextUrl.origin),
  )
}
