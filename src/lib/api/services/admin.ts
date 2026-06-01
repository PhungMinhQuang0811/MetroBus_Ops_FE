import { apiRequest, apiRequestRaw } from "../client"
import { API_ENDPOINTS } from "../endpoints"
import type { ListResult } from "../dto/common"
import type {
  AccountActionRequest,
  AccountActionResult,
  ExportLogsQuery,
  LogsQuery,
  SimulateIncidentRequest,
  SimulateIncidentResult,
  SystemLog,
  UpdateRbacRequest,
  UpdateRbacResult,
} from "../dto/admin"

export const adminApi = {
  banAccount: (body: AccountActionRequest) => apiRequest<AccountActionResult>(API_ENDPOINTS.admin.banAccount, { method: "POST", body }),
  unbanAccount: (body: AccountActionRequest) => apiRequest<AccountActionResult>(API_ENDPOINTS.admin.unbanAccount, { method: "POST", body }),
  updateRbac: (body: UpdateRbacRequest) => apiRequest<UpdateRbacResult>(API_ENDPOINTS.admin.rbac, { method: "POST", body }),
  getLogs: (query: LogsQuery) => apiRequest<ListResult<SystemLog>>(API_ENDPOINTS.admin.logs, { query }),
  exportLogs: (query: ExportLogsQuery) => apiRequestRaw(API_ENDPOINTS.admin.exportLogs, { query }),
  simulateIncident: (body: SimulateIncidentRequest) => apiRequest<SimulateIncidentResult>(API_ENDPOINTS.admin.simulateIncident, { method: "POST", body }),
}
