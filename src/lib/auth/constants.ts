export const AUTH_COOKIE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  XSRF_TOKEN: "XSRF-TOKEN",
} as const

export const AUTH_HEADER_KEYS = {
  XSRF_TOKEN: "X-CSRF-TOKEN",
} as const

export const AUTH_ROLES = {
  OPERATOR_ADMIN: "OPERATOR_ADMIN",
  OPERATOR_MANAGER: "OPERATOR_MANAGER",
  STATION_OPERATOR: "STATION_OPERATOR",
} as const

export const AUTH_ROLE_LABELS = {
  [AUTH_ROLES.OPERATOR_ADMIN]: "Admin đơn vị",
  [AUTH_ROLES.OPERATOR_MANAGER]: "Quản lý đơn vị",
  [AUTH_ROLES.STATION_OPERATOR]: "Nhân viên vận hành đơn vị",
} as const

export const PUBLIC_PATHS = {
  LOGIN: "/login",
} as const
