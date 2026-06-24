import { apiRequest } from "../client"
import { API_ENDPOINTS } from "../endpoints"
import type { SettlementListResponse } from "../dto/reconciliation"

export const settlementApi = {
  listSettlements: (page = 0, size = 20) =>
    apiRequest<SettlementListResponse>(API_ENDPOINTS.reconciliation.settlements, {
      service: "ops",
      method: "GET",
      query: { page, size },
    }),
}