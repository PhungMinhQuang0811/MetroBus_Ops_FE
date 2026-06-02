"use client"

import { ReactNode } from "react"
import { AlertTriangle, Clock, CreditCard, LayoutDashboard, Package } from "lucide-react"

import { AuthSessionProvider } from "@/components/auth/auth-session-provider"
import { PortalLayout } from "@/components/layouts/portal-layout"
import { ROUTES } from "@/lib/routes"

const navItems = [
  { href: ROUTES.staff.home, icon: LayoutDashboard, label: "Tổng quan" },
  { href: ROUTES.staff.shift, icon: Clock, label: "Quản lý ca" },
  { href: ROUTES.staff.psc, icon: AlertTriangle, label: "Xử lý PSC" },
  { href: ROUTES.staff.cards, icon: CreditCard, label: "Phôi thẻ" },
  { href: ROUTES.staff.orders, icon: Package, label: "Đơn hàng" },
]

export default function StaffLayout({ children }: { children: ReactNode }) {
  return (
    <AuthSessionProvider>
      <PortalLayout
        navItems={navItems}
        portalName="Staff Portal"
        userName="Nguyễn Văn B"
        userRole="Nhân viên"
        tenantName="Metro Line 1 Co."
        shiftStatus="active"
        shiftStation="Bến Thành"
      >
        {children}
      </PortalLayout>
    </AuthSessionProvider>
  )
}
