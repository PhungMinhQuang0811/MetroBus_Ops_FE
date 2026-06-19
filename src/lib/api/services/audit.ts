import { apiRequest } from "../client"
import { API_ENDPOINTS } from "../endpoints"
import type { AfcAuditSearchQuery, AuditLog, AuditLogListResponse, AuthAuditSearchQuery } from "../dto/audit"

export const auditApi = {
  searchAuthAuditLogs: (query: AuthAuditSearchQuery) =>
    apiRequest<AuditLogListResponse>(API_ENDPOINTS.audit.searchAuthAuditLogs, {
      service: "auth",
      method: "GET",
      query,
    }),
  getAuthAuditLog: (auditId: string) =>
    apiRequest<AuditLog>(API_ENDPOINTS.audit.getAuthAuditLog(auditId), {
      service: "auth",
      method: "GET",
    }),
  searchAfcAuditLogs: (query: AfcAuditSearchQuery) =>
    apiRequest<AuditLogListResponse>(API_ENDPOINTS.audit.searchAfcAuditLogs, {
      service: "ops",
      method: "GET",
      query,
    }),
  getAfcAuditLog: (auditId: string) =>
    apiRequest<AuditLog>(API_ENDPOINTS.audit.getAfcAuditLog(auditId), {
      service: "ops",
      method: "GET",
    }),
}
