export const AuthNextStep = {
  PASSWORD_LOGIN: "PASSWORD_LOGIN",
  REGISTER_OTP: "REGISTER_OTP",
  SET_PASSWORD: "SET_PASSWORD",
} as const

export type AuthNextStep = (typeof AuthNextStep)[keyof typeof AuthNextStep]
