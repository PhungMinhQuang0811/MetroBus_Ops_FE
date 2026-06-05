import { apiRequest } from "../client"
import { API_ENDPOINTS } from "../endpoints"
import type { AuthResponse, LoginRequest } from "../dto/identity"

export const identityApi = {
  login: (body: LoginRequest) => apiRequest<AuthResponse>(API_ENDPOINTS.auth.login, { service: "auth", method: "POST", body }),
  logout: () => apiRequest<void>(API_ENDPOINTS.auth.logout, { service: "auth", method: "POST", skipAuthRefresh: true }),
  refreshToken: () => apiRequest<void>(API_ENDPOINTS.auth.refreshToken, { service: "auth", method: "POST", skipAuthRefresh: true }),
}
