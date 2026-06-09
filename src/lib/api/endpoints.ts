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
} as const
