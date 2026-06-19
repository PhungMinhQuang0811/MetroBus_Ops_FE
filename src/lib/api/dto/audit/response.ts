export interface AuditLog {
  id: string
  operatorCode?: string | null
  accountId?: string | null
  username?: string | null
  action: string
  module?: string | null
  resourceType?: string | null
  resourceId?: string | null
  resourceName?: string | null
  result: string
  requestId?: string | null
  ipAddress?: string | null
  userAgent?: string | null
  httpMethod?: string | null
  requestPath?: string | null
  requestData?: unknown
  responseData?: unknown
  before?: unknown
  after?: unknown
  metadata?: unknown
  errorMessage?: string | null
  createdAt: string
}

export interface AuditLogListResponse {
  items: AuditLog[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}
