import Link from "next/link"
import { redirect } from "next/navigation"

import { FavoriteForm } from "@/components/demo/favorite-form"
import { createClient } from "@/lib/supabase/server"

export const metadata = { title: "我的收藏" }

export default async function FavoritesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?returnTo=%2Ffavorites")
  }

  const { data, error } = await supabase
    .from("favorites")
    .select("created_at, demos(id, slug, name, tagline, favorites_count)")
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error("收藏列表读取失败")
  }

  return (
    <main className="page-shell account-page" id="main-content" tabIndex={-1}>
      <header className="page-heading">
        <p className="eyebrow">个人收藏</p>
        <h1>准备复刻的案例</h1>
        <p className="muted">这里只有你的真实收藏记录。</p>
      </header>
      {data.length === 0 ? (
        <section className="empty-state">
          <h2>还没有收藏</h2>
          <p>先从案例库找到一个值得研究的方向。</p>
          <Link className="button button-primary" href="/demos">浏览案例库</Link>
        </section>
      ) : (
        <ul className="favorite-list">
          {data.map((item) => {
            const demo = item.demos
            if (!demo) return null
            return (
              <li key={demo.id} className="favorite-row">
                <div>
                  <Link href={`/demos/${demo.slug}`}><strong>{demo.name}</strong></Link>
                  <p>{demo.tagline}</p>
                </div>
                <FavoriteForm
                  demoId={demo.id}
                  demoName={demo.name}
                  isFavorited
                  returnTo="/favorites"
                  variant="quiet"
                />
              </li>
            )
          })}
        </ul>
      )}
    </main>
  )
}
