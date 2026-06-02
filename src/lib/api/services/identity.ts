import { apiRequest } from "../client"
import { API_ENDPOINTS } from "../endpoints"
import type {
  AuthResponse,
  LoginRequest,
  PhoneCheckRequest,
  PhoneCheckResponse,
  RegistrationOtpResponse,
  SetPasswordRequest,
  VerifyOtpRequest,
} from "../dto/identity"

export const identityApi = {
  checkPhone: (body: PhoneCheckRequest) => apiRequest<PhoneCheckResponse>(API_ENDPOINTS.auth.checkPhone, { service: "auth", method: "POST", body }),
  login: (body: LoginRequest) => apiRequest<AuthResponse>(API_ENDPOINTS.auth.login, { service: "auth", method: "POST", body }),
  refreshToken: () => apiRequest<void>(API_ENDPOINTS.auth.refreshToken, { service: "auth", method: "POST", skipAuthRefresh: true }),
  verifyOtp: (body: VerifyOtpRequest) => apiRequest<RegistrationOtpResponse>(API_ENDPOINTS.auth.verifyOtp, { service: "auth", method: "POST", body }),
  setPassword: (body: SetPasswordRequest) => apiRequest<AuthResponse>(API_ENDPOINTS.auth.setPassword, { service: "auth", method: "POST", body }),
}
