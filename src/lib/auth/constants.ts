export const AUTH_COOKIE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  XSRF_TOKEN: "XSRF-TOKEN",
} as const

export const AUTH_HEADER_KEYS = {
  XSRF_TOKEN: "X-CSRF-TOKEN",
} as const

export const PUBLIC_PATHS = {
  PASSENGER_LOGIN: "/app-passenger/login",
} as const
