export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
    refreshToken: "/auth/refresh-token",
    changePassword: "/auth/change-password",
  },
  account: {
    listAccounts: "/account/list-accounts",
    createAccount: "/account/create-account",
    disableAccount: (accountId: string) => `/account/disable-account/${accountId}`,
    enableAccount: (accountId: string) => `/account/enable-account/${accountId}`,
    previewImportAccounts: "/account/preview-import-accounts",
    confirmImportAccounts: "/account/confirm-import-accounts",
    resetAccountPassword: (accountId: string) => `/account/reset-account-password/${accountId}`,
  },
} as const
