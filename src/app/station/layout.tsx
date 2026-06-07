"use client"

import { ReactNode } from "react"
import { LayoutDashboard } from "lucide-react"

import { AuthSessionProvider } from "@/components/auth/auth-session-provider"
import { PortalLayout } from "@/components/layouts/portal-layout"
import { AUTH_ROLE_LABELS, AUTH_ROLES } from "@/lib/auth/constants"
import { ROUTES } from "@/lib/routes"

const navItems = [
  { href: ROUTES.station.home, icon: LayoutDashboard, label: "Tổng quan" },
]

export default function StationLayout({ children }: { children: ReactNode }) {
  return (
    <AuthSessionProvider>
      <PortalLayout
        navItems={navItems}
        portalName="Vận hành tại trạm"
        userName="Nhân viên vận hành"
        userRole={AUTH_ROLE_LABELS[AUTH_ROLES.STATION_OPERATOR]}
        tenantName="Metro Line 1 Co."
        shiftStatus="active"
        shiftStation="Bến Thành"
      >
        {children}
      </PortalLayout>
    </AuthSessionProvider>
  )
}
