import { apiRequest } from "../client"
import { API_ENDPOINTS } from "../endpoints"
import type {
  AccountListResponse,
  AccountMutationResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  ConfirmImportAccountsResponse,
  CreateAccountRequest,
  ListAccountsQuery,
  PreviewImportAccountsResponse,
  ResetAccountPasswordRequest,
  ResetAccountPasswordResponse,
} from "../dto/account"

export const accountApi = {
  listAccounts: (query: ListAccountsQuery) =>
    apiRequest<AccountListResponse>(API_ENDPOINTS.account.listAccounts, { service: "auth", method: "GET", query }),
  createAccount: (body: CreateAccountRequest) =>
    apiRequest<AccountMutationResponse>(API_ENDPOINTS.account.createAccount, { service: "auth", method: "POST", body }),
  changePassword: (body: ChangePasswordRequest) =>
    apiRequest<ChangePasswordResponse>(API_ENDPOINTS.account.changePassword, { service: "auth", method: "POST", body }),
  disableAccount: (accountId: string) =>
    apiRequest<AccountMutationResponse>(API_ENDPOINTS.account.disableAccount(accountId), { service: "auth", method: "POST" }),
  enableAccount: (accountId: string) =>
    apiRequest<AccountMutationResponse>(API_ENDPOINTS.account.enableAccount(accountId), { service: "auth", method: "POST" }),
  previewImportAccounts: (file: File) => {
    const formData = new FormData()
    formData.set("file", file)

    return apiRequest<PreviewImportAccountsResponse>(API_ENDPOINTS.account.previewImportAccounts, { service: "auth", method: "POST", body: formData })
  },
  confirmImportAccounts: (file: File) => {
    const formData = new FormData()
    formData.set("file", file)

    return apiRequest<ConfirmImportAccountsResponse>(API_ENDPOINTS.account.confirmImportAccounts, { service: "auth", method: "POST", body: formData })
  },
  resetAccountPassword: (body: ResetAccountPasswordRequest) =>
    apiRequest<ResetAccountPasswordResponse>(API_ENDPOINTS.account.resetAccountPassword, { service: "auth", method: "POST", body }),
}
