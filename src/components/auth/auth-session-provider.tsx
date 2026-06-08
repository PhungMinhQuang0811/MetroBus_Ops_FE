"use client"

import { ReactNode, useEffect } from "react"
import { usePathname } from "next/navigation"

import { identityApi } from "@/lib/api"
import { getStoredPasswordStatus, requiresPasswordChange } from "@/lib/auth/password-status"
import { ROUTES } from "@/lib/routes"

const DEFAULT_REFRESH_INTERVAL_MS = 55 * 60 * 1000
const MIN_REFRESH_INTERVAL_MS = 5 * 1000

function getRefreshInterval() {
  const configuredInterval = Number(process.env.NEXT_PUBLIC_ACCESS_TOKEN_REFRESH_INTERVAL_MS)

  if (!Number.isFinite(configuredInterval) || configuredInterval <= 0) {
    return DEFAULT_REFRESH_INTERVAL_MS
  }

  return Math.max(configuredInterval, MIN_REFRESH_INTERVAL_MS)
}

async function refreshSession() {
  try {
    await identityApi.refreshToken()
  } catch {
    window.location.assign(ROUTES.unauthorized)
  }
}

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname === ROUTES.login) return

    if (pathname !== ROUTES.changePassword && requiresPasswordChange(getStoredPasswordStatus())) {
      window.location.assign(ROUTES.changePassword)
      return
    }

    const intervalId = window.setInterval(refreshSession, getRefreshInterval())

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void refreshSession()
      }
    }

    window.addEventListener("focus", refreshSession)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      window.clearInterval(intervalId)
      window.removeEventListener("focus", refreshSession)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [pathname])

  return children
}
