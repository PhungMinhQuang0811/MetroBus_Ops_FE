import type { Route } from "next"

export const ROUTES = {
  home: "/",
  homeFeatures: "/#features",
  homeSolutions: "/#solutions",
  login: "/login",
  changePassword: "/change-password",
  unauthorized: "/401",
  forbidden: "/403",

  operator: {
    home: "/operator",
    accounts: "/operator/accounts",
  },

  station: {
    home: "/station",
  },
} as const satisfies Record<string, unknown>

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

export type AppRoute = Route
