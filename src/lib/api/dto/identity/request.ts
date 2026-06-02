export interface PhoneCheckRequest {
  phoneNumber: string
}

export interface LoginRequest {
  identifier: string
  password: string
}

export interface VerifyOtpRequest {
  phoneNumber: string
  otp: string
}

export interface SetPasswordRequest {
  registrationToken: string
  password: string
}
