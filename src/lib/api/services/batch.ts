import { apiRequest } from "../client"
import { API_ENDPOINTS } from "../endpoints"
import type { Batch, BatchListResponse, CreateBatchRequest, ListBatchesQuery } from "../dto/batch"

export const batchApi = {
  listBatches: (query: ListBatchesQuery) =>
    apiRequest<BatchListResponse>(API_ENDPOINTS.batch.listBatches, { service: "ops", method: "GET", query }),
  createBatch: (body: CreateBatchRequest) =>
    apiRequest<Batch>(API_ENDPOINTS.batch.createBatch, { service: "ops", method: "POST", body }),
  submitBatchToLevel5: (batchId: string) =>
    apiRequest<Batch>(API_ENDPOINTS.batch.submitBatchToLevel5(batchId), { service: "ops", method: "POST" }),
}
