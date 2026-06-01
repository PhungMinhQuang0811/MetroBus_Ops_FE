import { apiRequest } from "../client"
import { API_ENDPOINTS } from "../endpoints"
import type {
  AccountResult,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  PhoneNumberRequest,
  ProfileResult,
  ResetPasswordRequest,
  UpdateProfileRequest,
  UpdateProfileResult,
  VerifyEmailRequest,
  VerifyOtpRequest,
} from "../dto/identity"

export const identityApi = {
  requestOtp: (body: PhoneNumberRequest) => apiRequest<null>(API_ENDPOINTS.auth.requestOtp, { method: "POST", body }),
  verifyOtp: (body: VerifyOtpRequest) => apiRequest<AccountResult>(API_ENDPOINTS.auth.verifyOtp, { method: "POST", body }),
  resendOtp: (body: PhoneNumberRequest) => apiRequest<null>(API_ENDPOINTS.auth.resendOtp, { method: "POST", body }),
  login: (body: LoginRequest) => apiRequest<AccountResult>(API_ENDPOINTS.auth.login, { method: "POST", body }),
  logout: () => apiRequest<null>(API_ENDPOINTS.auth.logout, { method: "POST", body: {} }),
  changePassword: (body: ChangePasswordRequest) => apiRequest<null>(API_ENDPOINTS.user.changePassword, { method: "POST", body }),
  forgotPassword: (body: ForgotPasswordRequest) => apiRequest<null>(API_ENDPOINTS.auth.forgotPassword, { method: "POST", body }),
  resetPassword: (body: ResetPasswordRequest) => apiRequest<null>(API_ENDPOINTS.auth.resetPassword, { method: "POST", body }),
  getProfile: () => apiRequest<ProfileResult>(API_ENDPOINTS.user.me),
  updateProfile: (body: UpdateProfileRequest) => apiRequest<UpdateProfileResult>(API_ENDPOINTS.user.me, { method: "PUT", body }),
  verifyEmail: (body: VerifyEmailRequest) => apiRequest<null>(API_ENDPOINTS.user.verifyEmail, { method: "POST", body }),
}
