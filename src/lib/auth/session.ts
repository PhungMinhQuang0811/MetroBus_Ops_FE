import type { AuthResponse } from "@/lib/api/dto/identity"
import { AUTH_ROLES } from "@/lib/auth/constants"
import { ROUTES } from "@/lib/routes"

const AUTH_SESSION_STORAGE_KEY = "afc_ops_auth_session"

export interface StoredAuthSession {
  username: string
  roles: string[]
  permissions: string[]
}

export type AuthRole = (typeof AUTH_ROLES)[keyof typeof AUTH_ROLES]

export function getPrimaryAuthRole(roles: string[] = []): AuthRole | undefined {
  if (roles.includes(AUTH_ROLES.OPERATOR_ADMIN)) return AUTH_ROLES.OPERATOR_ADMIN
  if (roles.includes(AUTH_ROLES.OPERATOR_MANAGER)) return AUTH_ROLES.OPERATOR_MANAGER
  if (roles.includes(AUTH_ROLES.STATION_OPERATOR)) return AUTH_ROLES.STATION_OPERATOR

  return undefined
}

export function getHomeRouteForRole(role?: string) {
  if (role === AUTH_ROLES.STATION_OPERATOR) return ROUTES.station.deviceMonitoring
  if (role === AUTH_ROLES.OPERATOR_ADMIN) return ROUTES.admin.home
  if (role === AUTH_ROLES.OPERATOR_MANAGER) return ROUTES.manager.home

  return ROUTES.forbidden
}

export function getHomeRouteForRoles(roles: string[] = []) {
  return getHomeRouteForRole(getPrimaryAuthRole(roles))
}

export function storeAuthSession(auth: Pick<AuthResponse, "username" | "roles" | "permissions">) {
  if (typeof window === "undefined") return

  const session: StoredAuthSession = {
    username: auth.username,
    roles: auth.roles,
    permissions: auth.permissions,
  }

  window.localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session))
}

export function getStoredAuthSession() {
  if (typeof window === "undefined") return null

  const rawSession = window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY)
  if (!rawSession) return null

  try {
    const session = JSON.parse(rawSession) as StoredAuthSession

    if (!session.username || !Array.isArray(session.roles) || !Array.isArray(session.permissions)) {
      return null
    }

    return session
  } catch {
    return null
  }
}

export function clearStoredAuthSession() {
  if (typeof window === "undefined") return

  window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY)
}

export function isAdminWorkspaceRole(role?: string) {
  return role === AUTH_ROLES.OPERATOR_ADMIN
}

export function isManagerWorkspaceRole(role?: string) {
  return role === AUTH_ROLES.OPERATOR_MANAGER
}
