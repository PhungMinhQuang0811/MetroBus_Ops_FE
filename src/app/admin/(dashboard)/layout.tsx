"use client";

import { PortalLayout } from "@/components/layouts/portal-layout";
import { Users, Shield, FileText, LayoutDashboard } from "lucide-react";
import { ROUTES } from "@/lib/routes";

const adminNavItems = [
  { href: ROUTES.admin.home, label: "Dashboard", icon: LayoutDashboard },
  { href: ROUTES.admin.accounts, label: "Quản lý tài khoản", icon: Users },
  { href: ROUTES.admin.rbac, label: "Phân quyền RBAC", icon: Shield },
  { href: ROUTES.admin.logs, label: "System Logs", icon: FileText },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortalLayout
      portalName="Admin Portal"
      navItems={adminNavItems}
      userRole="ADMIN"
      userName="System Admin"
    >
      {children}
    </PortalLayout>
  );
}
