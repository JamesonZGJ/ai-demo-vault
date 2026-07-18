import type { Metadata } from "next"

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <main className="auth-shell" id="main-content" tabIndex={-1}>{children}</main>
}
