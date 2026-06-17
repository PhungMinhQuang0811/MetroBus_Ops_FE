export interface SearchIncidentsQuery {
  from?: string
  to?: string
  stationId?: number
  deviceId?: number
  severity?: string
  incidentType?: string
  resolved?: boolean
  page?: number
  size?: number
}
