import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "检查邮箱",
  robots: { index: false, follow: false },
}

export default async function CheckEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ recipient?: string }>
}) {
  const { recipient: rawRecipient } = await searchParams
  const recipient =
    rawRecipient && rawRecipient.length <= 254 && /^[^\s@]+\*{3}@[^\s@]+$/u.test(rawRecipient)
      ? rawRecipient
      : null

  return (
    <main className="auth-shell" id="main-content" tabIndex={-1}>
      <section className="auth-card" aria-labelledby="check-email-title">
        <p className="eyebrow">还差一步</p>
        <h1 id="check-email-title">请检查确认邮件</h1>
        <p className="muted">
          {recipient ? `确认邮件已发送到 ${recipient}。` : "确认邮件已经发送。"}
          打开邮件中的确认链接后，账号才会激活。没有收到时请检查垃圾邮件。
        </p>
        <Link className="button" href="/login">返回登录</Link>
      </section>
    </main>
  )
}
