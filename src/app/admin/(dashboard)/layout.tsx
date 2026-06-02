"use client"

import { FileText, LayoutDashboard, Shield, Users } from "lucide-react"

import { AuthSessionProvider } from "@/components/auth/auth-session-provider"
import { PortalLayout } from "@/components/layouts/portal-layout"
import { ROUTES } from "@/lib/routes"

const adminNavItems = [
  { href: ROUTES.admin.home, label: "Dashboard", icon: LayoutDashboard },
  { href: ROUTES.admin.accounts, label: "Quản lý tài khoản", icon: Users },
  { href: ROUTES.admin.rbac, label: "Phân quyền RBAC", icon: Shield },
  { href: ROUTES.admin.logs, label: "System Logs", icon: FileText },
]

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthSessionProvider>
      <PortalLayout
        portalName="Admin Portal"
        navItems={adminNavItems}
        userRole="ADMIN"
        userName="System Admin"
      >
        {children}
      </PortalLayout>
    </AuthSessionProvider>
  )
}
