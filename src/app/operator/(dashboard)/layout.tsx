"use client"

import { AuthSessionProvider } from "@/components/auth/auth-session-provider"
import { PortalLayout } from "@/components/layouts/portal-layout"
import { AUTH_ROLE_LABELS, AUTH_ROLES } from "@/lib/auth/constants"
import { ROUTES } from "@/lib/routes"

const operatorNavItems = [
  { label: "Tài khoản nhân sự", href: ROUTES.operator.accounts },
  { label: "Audit và truy vết", href: ROUTES.operator.home },
]

export default function OperatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthSessionProvider>
      <PortalLayout
        portalName="AFC Ops"
        navItems={operatorNavItems}
        userName="admin01"
        userRole={AUTH_ROLE_LABELS[AUTH_ROLES.OPERATOR_ADMIN]}
      >
        {children}
      </PortalLayout>
    </AuthSessionProvider>
  )
}
