export interface ListAccountsQuery {
  keyword?: string
  role?: string
  isActive?: boolean
  page?: number
  size?: number
}

export interface CreateAccountRequest {
  username: string
  roleNames: string[]
}

export interface ResetAccountPasswordRequest {
  temporaryPassword: string
}
