export const API_ENDPOINTS = {
  auth: {
    checkPhone: "/auth/phone/check",
    login: "/auth/login",
    refreshToken: "/auth/refresh-token",
    verifyOtp: "/auth/register/verify-otp",
    setPassword: "/auth/register/set-password",
  },
} as const
