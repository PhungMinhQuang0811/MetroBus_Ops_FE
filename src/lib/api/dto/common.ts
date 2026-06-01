export interface ApiResponse<T> {
  code: number
  message: string
  result: T
}

export interface ListResult<T> {
  items: T[]
}

export interface DuplicateResult {
  processed: false
  duplicate: true
}

export type PaymentProvider = "VNPAY_SANDBOX"
export type PaymentMethod = "WALLET" | "CASH"
export type TransportType = "METRO" | "BUS"
