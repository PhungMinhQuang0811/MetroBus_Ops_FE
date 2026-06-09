"use client"

import { useEffect } from "react"

import { getHomeRouteForRoles, getStoredAuthSession } from "@/lib/auth/session"
import { ROUTES } from "@/lib/routes"

export default function OperatorLayout() {
  useEffect(() => {
    const storedSession = getStoredAuthSession()

    if (!storedSession) {
      window.location.assign(ROUTES.login)
      return
    }

    window.location.replace(getHomeRouteForRoles(storedSession.roles))
  }, [])

  return null
}
