import type { PaymentProvider } from "./common"

export interface WalletResult {
  walletId: string
  walletType: string
  balance: number
  status: string
}

export interface CreateTopUpRequest {
  amount: number
  provider: PaymentProvider
}

export interface CreateTopUpResult {
  paymentUrl: string
  paymentRequestId: string
}

export interface TopUpCallbackRequest {
  provider: PaymentProvider
  providerTransactionId: string
  walletId: string
  amount: number
  status: "SUCCESS" | "CANCELLED" | "EXPIRED"
  signature: string
}

export interface TopUpCallbackResult {
  processed: boolean
  duplicate?: boolean
  walletId?: string
  balance?: number
  transactionId?: string
}

export interface WithdrawWalletRequest {
  amount: number
}

export interface CreatePayoutRequest {
  operatorWalletId: string
  amount: number
  bankAccountNo: string
  bankName: string
  note?: string
}

export interface PayoutResult {
  payoutId: string
  status: string
  transactionId?: string
}

export interface ApprovePayoutRequest {
  payoutId: string
  note?: string
}

export interface RejectPayoutRequest {
  payoutId: string
  reason: string
}

export interface RunClearingRequest {
  settlementDate: string
  rerun: boolean
}

export interface RunClearingResult {
  settlementId?: string
  settlementDate?: string
  processedJourneyCount?: number
  totalAmount?: number
  processed?: boolean
  duplicate?: boolean
}

export interface ClearingReportsQuery {
  fromDate: string
  toDate: string
  operatorId?: number
}

export interface ClearingReport {
  settlementId: string
  operatorId: number
  amount: number
  status: string
}
