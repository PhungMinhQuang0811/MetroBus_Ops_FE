"use client"

import {
  AlertTriangle,
  BarChart3,
  Boxes,
  LayoutDashboard,
  Map,
  RadioTower,
  Receipt,
  Users,
} from "lucide-react"

import { AuthSessionProvider } from "@/components/auth/auth-session-provider"
import { PortalLayout } from "@/components/layouts/portal-layout"
import { AUTH_ROLE_LABELS, AUTH_ROLES } from "@/lib/auth/constants"
import { ROUTES } from "@/lib/routes"

const operatorNavItems = [
  { label: "Dashboard", href: ROUTES.operator.home, icon: LayoutDashboard },
  { label: "Nhân sự", href: ROUTES.operator.employees, icon: Users },
  { label: "Tuyến và trạm", href: ROUTES.operator.routes, icon: Map },
  { label: "Thiết bị AFC", href: ROUTES.operator.devices, icon: RadioTower },
  { label: "Giao dịch vận hành", href: ROUTES.operator.transactions, icon: Receipt },
  { label: "Sự cố", href: ROUTES.operator.incidents, icon: AlertTriangle },
  { label: "Gói cấu hình", href: ROUTES.operator.controlPackages, icon: Boxes },
  { label: "Báo cáo", href: ROUTES.operator.reports, icon: BarChart3 },
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
