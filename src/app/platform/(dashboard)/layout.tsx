"use client"

import { PortalLayout } from "@/components/layouts/portal-layout"
import {
  Banknote,
  BarChart3,
  Building2,
  FileSpreadsheet,
  LayoutDashboard,
  TrendingUp,
} from "lucide-react"
import { ROUTES } from "@/lib/routes"

const platformNavItems = [
  { label: "Dashboard", href: ROUTES.platform.home, icon: LayoutDashboard },
  { label: "Tenants", href: ROUTES.platform.tenants, icon: Building2 },
  { label: "Khung giá trần", href: ROUTES.platform.fareCeiling, icon: TrendingUp },
  { label: "Đối soát", href: ROUTES.platform.settlement, icon: FileSpreadsheet },
  { label: "Duyệt rút tiền", href: ROUTES.platform.payouts, icon: Banknote },
  { label: "Báo cáo", href: ROUTES.platform.reports, icon: BarChart3 },
]

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PortalLayout
      portalName="Platform Manager"
      navItems={platformNavItems}
      userName="Admin Platform"
      userRole="Quản lý nền tảng"
    >
      {children}
    </PortalLayout>
  )
}
