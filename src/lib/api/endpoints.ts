export const API_ENDPOINTS = {
  auth: {
    requestOtp: "/auth/request-otp",
    verifyOtp: "/auth/verify-otp",
    resendOtp: "/auth/resend-otp",
    login: "/auth/login",
    logout: "/auth/logout",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
  },
  user: {
    me: "/user/me",
    changePassword: "/user/change-password",
    verifyEmail: "/user/verify-email",
  },
  orders: {
    physicalCard: "/orders/physical-card",
    updateStatus: "/orders/update-status",
  },
  payments: { callback: "/payments/callback" },
  cards: {
    createVirtual: "/cards/create-virtual-card",
    virtualize: "/cards/create-virtual-cardize-card",
    createPhysical: "/cards/create-physical-card",
    importPhysical: "/cards/import-physical-cards",
    revoke: "/cards/revoke-card",
  },
  subscriptions: {
    renew: "/subscriptions/renew-subscription",
    guestRenew: "/subscriptions/guest-renew-subscription",
  },
  validator: { scanTicket: "/validator/scan-ticket" },
  psc: {
    incidents: "/psc/incidents",
    fareAdjustment: "/psc/fare-adjustment",
    penaltyUnlock: "/psc/penalty-unlock",
    freeUnlock: "/psc/free-unlock",
  },
  shifts: {
    open: "/shifts/open-shift",
    close: "/shifts/close-shift",
  },
  wallets: {
    me: "/wallets/me",
    createTopUp: "/wallets/create-top-up",
    topUpCallback: "/wallets/top-up-callback",
    withdraw: "/wallets/withdraw-wallet",
  },
  payouts: {
    root: "/payouts",
    approve: "/payouts/approve-payout",
    reject: "/payouts/reject-payout",
  },
  clearing: {
    run: "/clearing/run-clearing",
    reports: "/clearing/reports",
  },
  staff: {
    root: "/staff",
    import: "/staff/import-staff",
    assignShift: "/staff/assign-shift",
  },
  routes: {
    root: "/routes",
    import: "/routes/import-routes",
  },
  stations: {
    root: "/stations",
    reorder: "/stations/reorder-stations",
  },
  farePolicies: {
    root: "/fare-policies",
    preview: "/fare-policies/preview-fare",
  },
  tenants: { root: "/tenants" },
  configs: { fareCeiling: "/configs/fare-ceiling" },
  admin: {
    banAccount: "/admin/ban-account",
    unbanAccount: "/admin/unban-account",
    rbac: "/admin/rbac",
    logs: "/admin/logs",
    exportLogs: "/admin/export-logs",
    simulateIncident: "/admin/simulate-incident",
  },
} as const
