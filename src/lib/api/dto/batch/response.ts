import type { BatchStatus } from "./request"

export interface Batch {
  id: string
  batchCode: string
  fromTime: string
  toTime: string
  transactionCount: number
  status: BatchStatus
  submittedAt?: string | null
  createdAt?: string
  updatedAt?: string
}

export interface BatchListResponse {
  items: Batch[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}
