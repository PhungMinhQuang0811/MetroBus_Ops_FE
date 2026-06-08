import type { PasswordStatus } from "../identity"

export interface Account {
  id: string
  username: string
  roles: string[]
  isActive: boolean
  passwordStatus: PasswordStatus
  createdAt: string
  updatedAt?: string
}

export interface AccountListResponse {
  items: Account[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface AccountMutationResponse {
  id: string
  username: string
  roles: string[]
  isActive: boolean
  passwordStatus: PasswordStatus
  temporaryPassword?: string
}

export interface ResetAccountPasswordResponse {
  accountId: string
  passwordStatus: PasswordStatus
}

export interface ImportAccountError {
  row: number
  field: string
  message: string
}

export interface ImportAccountPreviewItem {
  row: number
  username: string
  roleName: string
  valid: boolean
  errors: ImportAccountError[]
}

export interface PreviewImportAccountsResponse {
  totalRows: number
  validRows: number
  invalidRows: number
  items: ImportAccountPreviewItem[]
  errors: ImportAccountError[]
}

export interface ConfirmImportAccountItem {
  row: number
  id: string
  username: string
  roles: string[]
  isActive: boolean
  passwordStatus: PasswordStatus
  temporaryPassword: string
}

export interface ConfirmImportAccountsResponse {
  imported: number
  items: ConfirmImportAccountItem[]
}
