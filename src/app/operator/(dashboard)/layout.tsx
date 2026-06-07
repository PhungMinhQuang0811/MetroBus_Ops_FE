"use client"

import { LayoutDashboard } from "lucide-react"

import { AuthSessionProvider } from "@/components/auth/auth-session-provider"
import { PortalLayout } from "@/components/layouts/portal-layout"
import { AUTH_ROLE_LABELS, AUTH_ROLES } from "@/lib/auth/constants"
import { ROUTES } from "@/lib/routes"

const operatorNavItems = [
  { label: "Tổng quan", href: ROUTES.operator.home, icon: LayoutDashboard },
]

export default function OperatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthSessionProvider>
      <PortalLayout
        portalName="Operator Back Office"
        navItems={operatorNavItems}
        userName="Quản lý vận hành"
        userRole={AUTH_ROLE_LABELS[AUTH_ROLES.OPERATOR_MANAGER]}
      >
        {children}
      </PortalLayout>
    </AuthSessionProvider>
  )
}
