"use client"

import { PortalLayout } from "@/components/layouts/portal-layout"
import {
  Banknote,
  BarChart3,
  CreditCard,
  DollarSign,
  LayoutDashboard,
  Map,
  Receipt,
  Users,
} from "lucide-react"
import { ROUTES } from "@/lib/routes"

const companyNavItems = [
  { label: "Dashboard", href: ROUTES.company.home, icon: LayoutDashboard },
  { label: "Nhân viên", href: ROUTES.company.employees, icon: Users },
  { label: "Tuyến & Trạm", href: ROUTES.company.routes, icon: Map },
  { label: "Biểu giá", href: ROUTES.company.farePolicies, icon: DollarSign },
  { label: "Thẻ doanh nghiệp", href: ROUTES.company.cards, icon: CreditCard },
  { label: "Giao dịch", href: ROUTES.company.transactions, icon: Receipt },
  { label: "Yêu cầu rút tiền", href: ROUTES.company.payouts, icon: Banknote },
  { label: "Báo cáo", href: ROUTES.company.reports, icon: BarChart3 },
]

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PortalLayout
      portalName="Company Portal"
      navItems={companyNavItems}
      userName="Nguyen Manager"
      userRole="Quản lý - Công ty ABC"
    >
      {children}
    </PortalLayout>
  )
}
