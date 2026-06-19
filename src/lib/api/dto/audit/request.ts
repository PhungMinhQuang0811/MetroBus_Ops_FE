export interface AuditPageQuery {
  from?: string
  to?: string
  page?: number
  size?: number
}

export interface AuthAuditSearchQuery extends AuditPageQuery {
  accountId?: string
  username?: string
  action?: string
  result?: string
}

export interface AfcAuditSearchQuery extends AuditPageQuery {
  username?: string
  action?: string
  resourceType?: string
  resourceId?: string
}
