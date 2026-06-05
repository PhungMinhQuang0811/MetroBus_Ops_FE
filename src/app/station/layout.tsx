"use client"

import { ReactNode } from "react"
import { AlertTriangle, BarChart3, LayoutDashboard, RadioTower, Receipt } from "lucide-react"

import { AuthSessionProvider } from "@/components/auth/auth-session-provider"
import { PortalLayout } from "@/components/layouts/portal-layout"
import { AUTH_ROLE_LABELS, AUTH_ROLES } from "@/lib/auth/constants"
import { ROUTES } from "@/lib/routes"

const navItems = [
  { href: ROUTES.station.home, icon: LayoutDashboard, label: "Tổng quan" },
  { href: ROUTES.station.deviceStatus, icon: RadioTower, label: "Trạng thái thiết bị" },
  { href: ROUTES.station.transactions, icon: Receipt, label: "Giao dịch" },
  { href: ROUTES.station.incidents, icon: AlertTriangle, label: "Sự cố" },
  { href: ROUTES.station.reports, icon: BarChart3, label: "Báo cáo" },
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
