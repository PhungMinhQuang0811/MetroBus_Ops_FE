import type { PasswordStatus } from "@/lib/api/dto/identity"

const PASSWORD_STATUS_STORAGE_KEY = "afc.auth.passwordStatus"

export function getStoredPasswordStatus(): PasswordStatus | null {
  if (typeof window === "undefined") return null

  const status = window.localStorage.getItem(PASSWORD_STATUS_STORAGE_KEY)

  if (status === "NORMAL" || status === "NEED_TO_CHANGE" || status === "NEED_TO_RESET") {
    return status
  }

  return null
}

export function storePasswordStatus(status: PasswordStatus) {
  if (typeof window === "undefined") return

  if (status === "NEED_TO_CHANGE") {
    window.localStorage.setItem(PASSWORD_STATUS_STORAGE_KEY, status)
    return
  }

  window.localStorage.removeItem(PASSWORD_STATUS_STORAGE_KEY)
}

export function clearStoredPasswordStatus() {
  if (typeof window === "undefined") return

  window.localStorage.removeItem(PASSWORD_STATUS_STORAGE_KEY)
}

export function requiresPasswordChange(status: PasswordStatus | null | undefined) {
  return status === "NEED_TO_CHANGE"
}
