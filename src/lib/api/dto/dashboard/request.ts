export type DashboardBucket = "hour" | "day"
export type DashboardSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"

export interface DashboardFilterQuery {
  from?: string
  to?: string
  routeId?: number
  stationId?: number
}

export interface DashboardTimelineQuery extends DashboardFilterQuery {
  bucket?: DashboardBucket
}

export interface DashboardRecentIncidentsQuery extends DashboardFilterQuery {
  severity?: DashboardSeverity
  limit?: number
}

export interface DashboardAlertsQuery extends DashboardFilterQuery {
  limit?: number
}
