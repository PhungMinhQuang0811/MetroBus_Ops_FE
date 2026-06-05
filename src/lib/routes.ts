import type { Route } from "next"

export const ROUTES = {
  home: "/",
  homeFeatures: "/#features",
  homeSolutions: "/#solutions",
  login: "/login",
  unauthorized: "/401",
  forbidden: "/403",

  operator: {
    home: "/operator",
    employees: "/operator/employees",
    employeesAdd: "/operator/employees/add",
    reports: "/operator/reports",
    routes: "/operator/routes",
    transactions: "/operator/transactions",
    devices: "/operator/devices",
    deviceStatus: "/operator/device-status",
    incidents: "/operator/incidents",
    controlPackages: "/operator/control-packages",
    batches: "/operator/batches",
    audit: "/operator/audit",
  },

  station: {
    home: "/station",
    deviceStatus: "/station/device-status",
    incidents: "/station/incidents",
    reports: "/station/reports",
    transactions: "/station/transactions",
  },
} as const satisfies Record<string, unknown>

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

export type AppRoute = Route
