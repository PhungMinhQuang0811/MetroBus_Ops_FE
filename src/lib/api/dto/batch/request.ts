export type BatchStatus = "CREATED" | "SUBMITTED" | "ACCEPTED" | "REJECTED" | "FAILED"

export interface CreateBatchRequest {
  fromTime: string
  toTime: string
}

export interface ListBatchesQuery {
  status?: BatchStatus
  from?: string
  to?: string
  page?: number
  size?: number
}
