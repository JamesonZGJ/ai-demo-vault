import Link from "next/link"

import { PasswordField } from "@/components/auth/password-field"
import { safeReturnTo } from "@/lib/auth/return-to"

import { login } from "../actions"

const ERROR_MESSAGES: Record<string, string> = {
  "missing-fields": "请输入邮箱和密码。",
  "invalid-credentials": "邮箱或密码不正确。",
  "confirmation-failed": "确认链接无效或已经过期，请重新注册或登录。",
}

type LoginPageProps = {
  searchParams: Promise<{ error?: string; returnTo?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams
  const returnTo = safeReturnTo(params.returnTo)
  const message = params.error ? ERROR_MESSAGES[params.error] : undefined
  const registerHref = `/register?${new URLSearchParams({ returnTo }).toString()}`

  return (
    <section className="auth-card" aria-labelledby="login-title">
      <p className="eyebrow">AI Build Blocks Library</p>
      <h1 id="login-title">登录后继续</h1>
      <p className="muted">用于保存收藏和后续个人资料；当前公开内容无需购买。</p>
      {message ? <p className="form-error" id="login-error" role="alert">{message}</p> : null}
      <form action={login} className="auth-form">
        <input type="hidden" name="returnTo" value={returnTo} />
        <label htmlFor="login-email">邮箱</label>
        <input id="login-email" name="email" type="email" autoComplete="email" aria-describedby={message ? "login-error" : undefined} aria-invalid={message ? true : undefined} required />
        <PasswordField id="login-password" name="password" label="密码" autoComplete="current-password" describedBy={message ? "login-error" : undefined} invalid={Boolean(message)} />
        <button type="submit" className="button button-primary">登录</button>
      </form>
      <p className="auth-switch">还没有账号？ <Link href={registerHref}>免费注册</Link></p>
    </section>
  )
}
