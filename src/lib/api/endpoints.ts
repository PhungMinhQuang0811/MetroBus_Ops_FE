export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    forgotPassword: "/auth/forgot-password",
    logout: "/auth/logout",
    refreshToken: "/auth/refresh-token",
  },
  account: {
    listAccounts: "/account/list-accounts",
    createAccount: "/account/create-account",
    changePassword: "/account/change-password",
    disableAccount: (accountId: string) => `/account/disable-account/${accountId}`,
    enableAccount: (accountId: string) => `/account/enable-account/${accountId}`,
    previewImportAccounts: "/account/preview-import-accounts",
    confirmImportAccounts: "/account/confirm-import-accounts",
    resetAccountPassword: "/account/reset-password",
  },
  route: {
    listRoutes: "/route/list-routes",
    createRoute: "/route/create-route",
    updateRoute: (routeId: number) => `/route/update-route/${routeId}`,
    enableRoute: (routeId: number) => `/route/enable-route/${routeId}`,
    disableRoute: (routeId: number) => `/route/disable-route/${routeId}`,
    previewImportRoutes: "/route/preview-import-routes",
    confirmImportRoutes: "/route/confirm-import-routes",
  },
} as const
