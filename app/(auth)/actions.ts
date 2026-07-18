"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { safeReturnTo } from "@/lib/auth/return-to"
import { getSiteUrl } from "@/lib/env"
import { createClient } from "@/lib/supabase/server"

function stringField(formData: FormData, name: string): string {
  const value = formData.get(name)
  return typeof value === "string" ? value.trim() : ""
}

function authErrorUrl(path: "/login" | "/register", code: string, returnTo: string) {
  const params = new URLSearchParams({ error: code })
  if (returnTo !== "/") {
    params.set("returnTo", returnTo)
  }
  return `${path}?${params.toString()}`
}

export async function login(formData: FormData) {
  const email = stringField(formData, "email")
  const password = stringField(formData, "password")
  const returnTo = safeReturnTo(stringField(formData, "returnTo"))

  if (!email || !password) {
    redirect(authErrorUrl("/login", "missing-fields", returnTo))
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    redirect(authErrorUrl("/login", "invalid-credentials", returnTo))
  }

  revalidatePath("/", "layout")
  redirect(returnTo)
}

export async function register(formData: FormData) {
  const email = stringField(formData, "email")
  const password = stringField(formData, "password")
  const passwordConfirmation = stringField(formData, "passwordConfirmation")
  const returnTo = safeReturnTo(stringField(formData, "returnTo"))

  if (!email || password.length < 8) {
    redirect(authErrorUrl("/register", "invalid-fields", returnTo))
  }
  if (password !== passwordConfirmation) {
    redirect(authErrorUrl("/register", "password-mismatch", returnTo))
  }

  const confirmUrl = new URL("/auth/confirm", getSiteUrl())
  confirmUrl.searchParams.set("returnTo", returnTo)

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: confirmUrl.toString() },
  })

  if (error) {
    redirect(authErrorUrl("/register", "registration-failed", returnTo))
  }

  const [localPart = "", domain = ""] = email.split("@")
  const maskedRecipient =
    localPart && domain ? `${localPart.slice(0, 1)}***@${domain}` : ""
  const params = new URLSearchParams()
  if (maskedRecipient) params.set("recipient", maskedRecipient)
  redirect(`/auth/check-email?${params.toString()}`)
}
