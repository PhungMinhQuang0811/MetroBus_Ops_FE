import type { Route } from "next"

export const ROUTES = {
  home: "/",
  homeFeatures: "/#features",
  homeSolutions: "/#solutions",
  download: "/download",
  login: "/login",
  forgotPassword: "/forgot-password",
  terms: "/terms",
  privacy: "/privacy",
  unauthorized: "/401",
  forbidden: "/403",

  passenger: {
    home: "/app-passenger",
    login: "/app-passenger/login",
    cards: "/app-passenger/cards",
    cardsNew: "/app-passenger/cards/new",
    cardsRenew: "/app-passenger/cards/renew",
    cardsVirtualize: "/app-passenger/cards/virtualize",
    history: "/app-passenger/history",
    historyTransactions: "/app-passenger/history?tab=transactions",
    profile: "/app-passenger/profile",
    qr: "/app-passenger/qr",
    wallet: "/app-passenger/wallet",
    walletTopup: "/app-passenger/wallet/topup",
  },

  guest: {
    physicalCardOrder: "/guest/physical-card-order",
    renewSubscription: "/guest/renew-subscription",
  },

  validator: "/validator",

  admin: {
    home: "/admin",
    accounts: "/admin/accounts",
    logs: "/admin/logs",
    rbac: "/admin/rbac",
  },

  company: {
    home: "/company",
    billing: "/company/billing",
    cards: "/company/cards",
    cardsTopup: "/company/cards/topup",
    employees: "/company/employees",
    employeesAdd: "/company/employees/add",
    farePolicies: "/company/fare-policies",
    payouts: "/company/payouts",
    reports: "/company/reports",
    routes: "/company/routes",
    transactions: "/company/transactions",
  },

  platform: {
    home: "/platform",
    fareCeiling: "/platform/fare-ceiling",
    payouts: "/platform/payouts",
    reports: "/platform/reports",
    settlement: "/platform/settlement",
    tenants: "/platform/tenants",
  },

  staff: {
    home: "/staff",
    cards: "/staff/cards",
    orders: "/staff/orders",
    psc: "/staff/psc",
    reports: "/staff/reports",
    shift: "/staff/shift",
    support: "/staff/support",
  },
} as const satisfies Record<string, unknown>

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
export const passengerPwaUrl = new URL(ROUTES.passenger.login, siteUrl).toString()

export type AppRoute = Route
