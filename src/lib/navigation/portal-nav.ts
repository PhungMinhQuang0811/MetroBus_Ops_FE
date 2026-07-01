import { AUTH_ROLES } from "@/lib/auth/constants"
import { ROUTES } from "@/lib/routes"

export interface PortalNavItem {
  href: string
  label: string
  children?: PortalNavItem[]
}

export const adminNavItems: PortalNavItem[] = [
  { label: "Tài khoản nhân sự", href: ROUTES.admin.accounts },
  { label: "Audit và truy vết", href: ROUTES.admin.audit },
]

export const managerNavItems: PortalNavItem[] = [
  { label: "Tổng quan", href: ROUTES.manager.home },
  {
    label: "Master data",
    href: ROUTES.manager.routes,
    children: [
      { label: "Tuyến", href: ROUTES.manager.routes },
      { label: "Ga/Trạm", href: ROUTES.manager.stations },
    ],
  },
  {
    label: "Thiết bị",
    href: ROUTES.manager.devices,
    children: [
      { label: "Quản lý thiết bị", href: ROUTES.manager.devices },
      { label: "Giám sát thiết bị", href: ROUTES.manager.deviceMonitoring },
      { label: "Sự cố thiết bị", href: ROUTES.manager.deviceIncidents },
    ],
  },
  { label: "Giao dịch", href: ROUTES.manager.transactions },
  {
    label: "Cấu hình vận hành",
    href: ROUTES.manager.controlPackages,
    children: [
      { label: "Gói cấu hình", href: ROUTES.manager.controlPackages },
      { label: "Trạng thái áp dụng", href: ROUTES.manager.controlSyncs },
    ],
  },
  { label: "Quản lý lô dữ liệu", href: ROUTES.manager.dataBatches },
  { label: "Đối soát doanh thu", href: ROUTES.manager.reconciliation },
  { label: "Ca trực", href: ROUTES.manager.shifts },
]

export const stationNavItems: PortalNavItem[] = [
  {
    label: "Thiết bị",
    href: ROUTES.station.deviceMonitoring,
    children: [
      { label: "Giám sát thiết bị", href: ROUTES.station.deviceMonitoring },
      { label: "Sự cố thiết bị", href: ROUTES.station.deviceIncidents },
    ],
  },
  { label: "Giao dịch", href: ROUTES.station.transactions },
  {
    label: "Ca trực",
    href: ROUTES.station.shifts,
    children: [
      { label: "Nhận ca / Kết ca", href: ROUTES.station.shifts },
    ],
  },
  {
    label: "Cấu hình vận hành",
    href: ROUTES.station.controlSyncs,
    children: [
      { label: "Trạng thái áp dụng", href: ROUTES.station.controlSyncs },
    ],
  },
]

export function getNavItemsForRole(role?: string) {
  if (role === AUTH_ROLES.OPERATOR_MANAGER) return managerNavItems
  if (role === AUTH_ROLES.STATION_OPERATOR) return stationNavItems

  return adminNavItems
}