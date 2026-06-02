import type { AuthNextStep } from "./constants"

export interface AuthResponse {
  id: string
  phoneNumber?: string
  roles: string[]
  permissions: string[]
}

export interface PhoneCheckResponse {
  exists: boolean
  nextStep: Extract<AuthNextStep, "PASSWORD_LOGIN" | "REGISTER_OTP">
  phoneNumber: string
}

export interface RegistrationOtpResponse {
  registrationToken: string
  nextStep: Extract<AuthNextStep, "SET_PASSWORD">
}
