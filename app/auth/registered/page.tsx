import type { Metadata } from "next"
import Link from "next/link"

import { safeReturnTo } from "@/lib/auth/return-to"

export const metadata: Metadata = {
  title: "账号创建成功",
  robots: { index: false, follow: false },
}

export default async function RegisteredPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string }>
}) {
  const { returnTo: rawReturnTo } = await searchParams
  const returnTo = safeReturnTo(rawReturnTo)

  return (
    <main className="auth-shell" id="main-content" tabIndex={-1}>
      <section className="auth-card" aria-labelledby="registered-title">
        <p className="eyebrow">注册完成</p>
        <h1 id="registered-title">账号创建成功</h1>
        <p className="muted">你已经登录，可以保存收藏并继续浏览免费 Build Blocks。</p>
        <Link className="button button-primary" href={returnTo}>继续浏览</Link>
      </section>
    </main>
  )
}
