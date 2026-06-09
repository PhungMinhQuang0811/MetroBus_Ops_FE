export interface ListAccountsQuery {
  keyword?: string
  role?: string
  isActive?: boolean
  passwordStatus?: string
  page?: number
  size?: number
}

export interface CreateAccountRequest {
  username: string
  roleNames: string[]
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface ResetAccountPasswordRequest {
  username: string
}
