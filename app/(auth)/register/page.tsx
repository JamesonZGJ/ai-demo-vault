import Link from "next/link"

import { PasswordField } from "@/components/auth/password-field"
import { safeReturnTo } from "@/lib/auth/return-to"

import { register } from "../actions"

const ERROR_MESSAGES: Record<string, string> = {
  "invalid-fields": "请输入邮箱，密码至少 8 位。",
  "password-mismatch": "两次输入的密码不一致。",
  "registration-failed": "注册没有完成，请检查邮箱或稍后重试。",
}

type RegisterPageProps = {
  searchParams: Promise<{ error?: string; returnTo?: string }>
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams
  const returnTo = safeReturnTo(params.returnTo)
  const message = params.error ? ERROR_MESSAGES[params.error] : undefined
  const loginHref = `/login?${new URLSearchParams({ returnTo }).toString()}`

  return (
    <section className="auth-card" aria-labelledby="register-title">
      <p className="eyebrow">AI Product Blueprint Marketplace</p>
      <h1 id="register-title">创建免费账号</h1>
      <p className="muted">确认邮箱后即可保存 Demo 收藏与 Blueprint 资料访问。</p>
      {message ? <p className="form-error" id="register-error" role="alert">{message}</p> : null}
      <form action={register} className="auth-form">
        <input type="hidden" name="returnTo" value={returnTo} />
        <label htmlFor="register-email">邮箱</label>
        <input id="register-email" name="email" type="email" autoComplete="email" aria-describedby={message ? "register-error" : undefined} aria-invalid={message ? true : undefined} required />
        <PasswordField id="register-password" name="password" label="密码（至少 8 位）" autoComplete="new-password" minLength={8} describedBy={message ? "register-error" : undefined} invalid={Boolean(message)} />
        <PasswordField id="register-password-confirmation" name="passwordConfirmation" label="确认密码" autoComplete="new-password" minLength={8} describedBy={message ? "register-error" : undefined} invalid={Boolean(message)} />
        <button type="submit" className="button button-primary">注册并发送确认邮件</button>
      </form>
      <p className="auth-switch">已有账号？ <Link href={loginHref}>去登录</Link></p>
    </section>
  )
}
