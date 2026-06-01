import { apiRequest } from "../client"
import { API_ENDPOINTS } from "../endpoints"
import type { ListResult } from "../dto/common"
import type {
  ApprovePayoutRequest,
  ClearingReport,
  ClearingReportsQuery,
  CreatePayoutRequest,
  CreateTopUpRequest,
  CreateTopUpResult,
  PayoutResult,
  RejectPayoutRequest,
  RunClearingRequest,
  RunClearingResult,
  TopUpCallbackRequest,
  TopUpCallbackResult,
  WalletResult,
  WithdrawWalletRequest,
} from "../dto/finance"

export const financeApi = {
  getMyWallet: () => apiRequest<WalletResult>(API_ENDPOINTS.wallets.me),
  createTopUp: (body: CreateTopUpRequest) => apiRequest<CreateTopUpResult>(API_ENDPOINTS.wallets.createTopUp, { method: "POST", body }),
  topUpCallback: (body: TopUpCallbackRequest) => apiRequest<TopUpCallbackResult>(API_ENDPOINTS.wallets.topUpCallback, { method: "POST", body }),
  withdrawWallet: (body: WithdrawWalletRequest) => apiRequest<null>(API_ENDPOINTS.wallets.withdraw, { method: "POST", body }),
  createPayout: (body: CreatePayoutRequest) => apiRequest<PayoutResult>(API_ENDPOINTS.payouts.root, { method: "POST", body }),
  approvePayout: (body: ApprovePayoutRequest) => apiRequest<PayoutResult>(API_ENDPOINTS.payouts.approve, { method: "POST", body }),
  rejectPayout: (body: RejectPayoutRequest) => apiRequest<PayoutResult>(API_ENDPOINTS.payouts.reject, { method: "POST", body }),
  runClearing: (body: RunClearingRequest) => apiRequest<RunClearingResult>(API_ENDPOINTS.clearing.run, { method: "POST", body }),
  getClearingReports: (query: ClearingReportsQuery) => apiRequest<ListResult<ClearingReport>>(API_ENDPOINTS.clearing.reports, { query }),
}
