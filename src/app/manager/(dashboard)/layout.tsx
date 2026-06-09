"use client"

import { useEffect, useState } from "react"

import { AuthSessionProvider } from "@/components/auth/auth-session-provider"
import { PortalLayout } from "@/components/layouts/portal-layout"
import { AUTH_ROLE_LABELS, AUTH_ROLES } from "@/lib/auth/constants"
import { getHomeRouteForRoles, getPrimaryAuthRole, getStoredAuthSession, type StoredAuthSession } from "@/lib/auth/session"
import { managerNavItems } from "@/lib/navigation/portal-nav"
import { ROUTES } from "@/lib/routes"

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<StoredAuthSession | null>(null)
  const [checkedSession, setCheckedSession] = useState(false)

  useEffect(() => {
    const storedSession = getStoredAuthSession()
    const role = getPrimaryAuthRole(storedSession?.roles)

    if (!storedSession || !role) {
      window.location.assign(ROUTES.login)
      return
    }

    if (role !== AUTH_ROLES.OPERATOR_MANAGER) {
      window.location.assign(getHomeRouteForRoles(storedSession.roles))
      return
    }

    setSession(storedSession)
    setCheckedSession(true)
  }, [])

  if (!checkedSession || !session) return null

  return (
    <AuthSessionProvider>
      <PortalLayout
        portalName="AFC Ops"
        homeHref={ROUTES.manager.home}
        navItems={managerNavItems}
        userName={session.username}
        userRole={AUTH_ROLE_LABELS[AUTH_ROLES.OPERATOR_MANAGER]}
      >
        {children}
      </PortalLayout>
    </AuthSessionProvider>
  )
}
