type RegistrationDestinationInput = {
  email: string
  hasSession: boolean
  returnTo: string
}

function maskedEmail(email: string) {
  const [localPart = "", domain = ""] = email.split("@")
  return localPart && domain ? `${localPart.slice(0, 1)}***@${domain}` : ""
}

export function registrationDestination({
  email,
  hasSession,
  returnTo,
}: RegistrationDestinationInput) {
  if (hasSession) {
    return registeredDestination(returnTo)
  }

  const params = new URLSearchParams()
  const recipient = maskedEmail(email)
  if (recipient) params.set("recipient", recipient)
  const query = params.toString()
  return `/auth/check-email${query ? `?${query}` : ""}`
}

export function registeredDestination(returnTo: string) {
  const params = new URLSearchParams()
  if (returnTo !== "/") params.set("returnTo", returnTo)
  const query = params.toString()
  return `/auth/registered${query ? `?${query}` : ""}`
}
