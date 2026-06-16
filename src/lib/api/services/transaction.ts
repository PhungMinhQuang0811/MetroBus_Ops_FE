import { apiRequest } from "../client"
import { API_ENDPOINTS } from "../endpoints"
import type { ListTransactionsQuery, TransactionDetail, TransactionListResponse } from "../dto/transaction"

export const transactionApi = {
  searchTransactions: (query: ListTransactionsQuery) =>
    apiRequest<TransactionListResponse>(API_ENDPOINTS.transaction.searchTransactions, {
      service: "ops",
      method: "GET",
      query,
    }),
  getTransactionDetail: (transactionId: string) =>
    apiRequest<TransactionDetail>(API_ENDPOINTS.transaction.getTransactionDetail, {
      service: "ops",
      method: "GET",
      query: { transactionId },
    }),
}
