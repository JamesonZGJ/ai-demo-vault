"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { safeReturnTo } from "@/lib/auth/return-to"
import { createClient } from "@/lib/supabase/server"

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu

export type FavoriteActionState = {
  error: string | null
}

export async function setFavoriteAction(
  demoId: string,
  favorited: boolean,
  returnTarget: string,
  _previousState: FavoriteActionState,
  _formData: FormData,
): Promise<FavoriteActionState> {
  void _previousState
  void _formData

  if (!UUID_PATTERN.test(demoId)) {
    return { error: "收藏失败，请重试。" }
  }

  const returnTo = safeReturnTo(returnTarget)
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?${new URLSearchParams({ returnTo }).toString()}`)
  }

  const { error } = await supabase.rpc("set_favorite", {
    p_demo_id: demoId,
    p_favorited: favorited,
  })

  if (error) {
    return { error: "收藏失败，请重试。" }
  }

  revalidatePath(returnTo)
  revalidatePath("/favorites")
  return { error: null }
}
