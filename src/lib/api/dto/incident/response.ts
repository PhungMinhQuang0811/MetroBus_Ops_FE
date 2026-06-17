export interface Incident {
  id: string
  deviceId: number
  deviceCode: string
  stationId: number
  incidentType: string
  severity: string
  message: string
  occurredAt: string
  receivedAt: string
  resolvedAt?: string | null
}

export interface IncidentDetail extends Incident {
  deviceType: string
  deviceStatus: string
  stationCode: string
  stationName: string
  routeId: number
  routeCode: string
  routeName: string
  payload?: Record<string, unknown> | null
}

export interface IncidentListResponse {
  items: Incident[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}
