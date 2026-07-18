import type { APIRequestContext } from "@playwright/test"

export const mailpitOrigin = process.env.MAILPIT_URL ?? "http://127.0.0.1:54324"
export const supabaseOrigin =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://127.0.0.1:54321"

type MailpitAddress = {
  Address?: string
}

type MailpitMessageSummary = {
  ID?: string
  To?: MailpitAddress[]
}

type MailpitMessage = {
  HTML?: string
  Text?: string
}

function decodeHtmlUrl(value: string) {
  return value
    .replace(/&amp;/giu, "&")
    .replace(/&#(?:38|x26);/giu, "&")
    .replace(/&quot;/giu, '"')
    .replace(/&#(?:34|x22);/giu, '"')
}

function extractConfirmationUrl(message: MailpitMessage) {
  const bodies = [message.HTML ?? "", message.Text ?? ""]

  for (const body of bodies) {
    const hrefs = Array.from(
      body.matchAll(/\bhref\s*=\s*["']([^"']+)["']/giu),
      (match) => {
        const href = match[1]
        if (!href) throw new Error("Mailpit 邮件链接格式无效")
        return href
      },
    )
    const plainUrls = body.match(/https?:\/\/[^\s<>"']+/gu) ?? []

    for (const candidate of [...hrefs, ...plainUrls]) {
      try {
        const url = new URL(decodeHtmlUrl(candidate))
        if (url.pathname === "/auth/v1/verify") return url.toString()
      } catch {
        // 非 URL 文本不是确认链接，继续检查邮件中的下一个候选地址。
      }
    }
  }

  return null
}

export async function assertLocalAuthServices(request: APIRequestContext) {
  const health = await request.get(`${supabaseOrigin}/auth/v1/health`)
  if (!health.ok()) throw new Error("Supabase Local Auth 必须真实运行")

  const mailpitInfo = await request.get(`${mailpitOrigin}/api/v1/info`)
  if (!mailpitInfo.ok()) throw new Error("Mailpit 必须真实运行")
}

export async function findConfirmationUrl(
  request: APIRequestContext,
  email: string,
) {
  const response = await request.get(`${mailpitOrigin}/api/v1/messages?limit=50`)
  if (!response.ok()) {
    throw new Error(`Mailpit 消息列表读取失败：${response.status()}`)
  }

  const payload = (await response.json()) as {
    messages?: MailpitMessageSummary[]
  }
  if (!Array.isArray(payload.messages)) {
    throw new Error("Mailpit 消息列表格式无效")
  }

  const normalizedEmail = email.toLowerCase()
  const messages = payload.messages.filter((summary) =>
    summary.To?.some(({ Address }) => Address?.toLowerCase() === normalizedEmail),
  )

  for (const summary of messages) {
    if (!summary.ID) throw new Error("Mailpit 目标邮件缺少消息 ID")

    const detailResponse = await request.get(
      `${mailpitOrigin}/api/v1/message/${encodeURIComponent(summary.ID)}`,
    )
    if (!detailResponse.ok()) {
      throw new Error(`Mailpit 邮件正文读取失败：${detailResponse.status()}`)
    }

    const confirmation = extractConfirmationUrl(
      (await detailResponse.json()) as MailpitMessage,
    )
    if (confirmation) return confirmation
  }

  return null
}
