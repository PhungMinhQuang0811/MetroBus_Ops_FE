export interface AuthResponse {
  id: string
  username: string
  roles: string[]
  permissions: string[]
  mustChangePassword: boolean
}
