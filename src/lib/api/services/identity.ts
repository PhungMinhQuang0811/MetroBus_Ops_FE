import { apiRequest } from "../client"
import { API_ENDPOINTS } from "../endpoints"
import type { AuthResponse, ChangePasswordRequest, LoginRequest } from "../dto/identity"

export const identityApi = {
  login: (body: LoginRequest) => apiRequest<AuthResponse>(API_ENDPOINTS.auth.login, { service: "auth", method: "POST", body }),
  logout: () => apiRequest<void>(API_ENDPOINTS.auth.logout, { service: "auth", method: "POST", skipAuthRefresh: true }),
  refreshToken: () => apiRequest<void>(API_ENDPOINTS.auth.refreshToken, { service: "auth", method: "POST", skipAuthRefresh: true }),
  changePassword: (body: ChangePasswordRequest) =>
    apiRequest<{ passwordStatus: "NORMAL" | "NEED_TO_CHANGE" | "NEED_TO_RESET" }>(API_ENDPOINTS.auth.changePassword, { service: "auth", method: "POST", body }),
}
