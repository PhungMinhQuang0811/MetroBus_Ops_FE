export interface PhoneNumberRequest {
  phoneNumber: string
}

export interface VerifyOtpRequest extends PhoneNumberRequest {
  otp: string
}

export interface AccountResult {
  id: string
  username: string
  roles: string[]
  permissions: string[]
}

export interface LoginRequest {
  identifier: string
  password: string
}

export interface ChangePasswordRequest {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  resetToken: string
  newPassword: string
  confirmPassword: string
}

export interface ProfileResult {
  accountId: string
  phone: string
  email: string
  fullName: string
  roles: string[]
  kycStatus: string
}

export interface UpdateProfileRequest {
  fullName: string
  email: string
  dateOfBirth: string
  citizenId: string
  address: string
}

export interface UpdateProfileResult {
  accountId: string
  updated: boolean
}

export interface VerifyEmailRequest {
  email: string
  otp: string
}
