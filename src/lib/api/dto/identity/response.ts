export type PasswordStatus = "NORMAL" | "NEED_TO_CHANGE" | "NEED_TO_RESET"

export interface AuthResponse {
  id: string
  username: string
  roles: string[]
  permissions: string[]
  passwordStatus: PasswordStatus
}
