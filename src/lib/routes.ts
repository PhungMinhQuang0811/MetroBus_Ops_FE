import type { Route } from "next"

export const ROUTES = {
  home: "/",
  homeFeatures: "/#features",
  homeSolutions: "/#solutions",
  login: "/login",
  forgotPassword: "/forgot-password",
  changePassword: "/change-password",
  unauthorized: "/401",
  forbidden: "/403",

  admin: {
    home: "/admin",
    accounts: "/admin/accounts",
    audit: "/admin",
  },

  manager: {
    home: "/manager",
    routes: "/manager/routes",
    stations: "/manager/stations",
    devices: "/manager/devices",
    deviceMonitoring: "/manager/devices/monitoring",
    deviceIncidents: "/manager/devices/incidents",
    transactions: "/manager/transactions",
    ticketData: "/manager/ticket-data",
    controlPackages: "/manager/control-packages",
    controlSyncs: "/manager/control-syncs",
    dataBatches: "/manager/data-batches",
    reconciliation: "/manager/reconciliation",
  },

  operator: {
    home: "/operator",
  },

  station: {
    home: "/station",
    deviceMonitoring: "/station/devices/monitoring",
    deviceIncidents: "/station/devices/incidents",
    transactions: "/station/transactions",
    controlSyncs: "/station/control-syncs",
  },
} as const satisfies Record<string, unknown>

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

export type AppRoute = Route