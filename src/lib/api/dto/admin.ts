export interface AccountActionRequest {
  accountId: string
  reason: string
}

export interface AccountActionResult {
  accountId: string
  isActive: boolean
}

export interface UpdateRbacRequest {
  role: string
  permissionsToAdd: string[]
  permissionsToRemove: string[]
}

export interface UpdateRbacResult {
  role: string
  permissions: string[]
  effectiveImmediately: boolean
}

export interface LogsQuery {
  from: string
  to: string
  severity?: string
  type?: string
}

export interface ExportLogsQuery extends LogsQuery {
  format: "CSV" | "XLSX"
}

export interface SystemLog {
  logId: string
  severity: string
  type: string
  message: string
}

export interface SimulateIncidentRequest {
  severity: string
  stationId: number
  message: string
}

export interface SimulateIncidentResult {
  incidentId: string
  alertTriggered: boolean
}
