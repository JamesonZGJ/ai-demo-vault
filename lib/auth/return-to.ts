const LOCAL_ORIGIN = "https://ai-demo-vault.invalid"

export function safeReturnTo(value: unknown, fallback = "/"): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return fallback
  }

  if (value.includes("\\") || /[\u0000-\u001f\u007f]/u.test(value)) {
    return fallback
  }

  try {
    const decoded = decodeURIComponent(value)
    if (decoded.startsWith("//") || decoded.includes("\\")) {
      return fallback
    }

    const parsed = new URL(value, LOCAL_ORIGIN)
    if (parsed.origin !== LOCAL_ORIGIN) {
      return fallback
    }

    return `${parsed.pathname}${parsed.search}${parsed.hash}`
  } catch {
    return fallback
  }
}
