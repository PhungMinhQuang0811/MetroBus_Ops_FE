import type { DashboardBucket, DashboardSeverity } from "./request"

export interface DashboardDeviceSummary {
  active: number
  offline: number
  maintenance: number
  disabled: number
}

export interface DashboardTransactionSummary {
  total: number
  openGate: number
  deny: number
  acceptedForForwarding: number
  denyRate: number
}

export interface DashboardIncidentSummary {
  total: number
  open: number
  high: number
}

export interface DashboardBatchSummary {
  total: number
  created: number
  submitted: number
  accepted: number
  rejected: number
  failed: number
}

export interface DashboardControlSyncSummary {
  total: number
  pending: number
  applied: number
  failed: number
}

export interface DashboardSummaryResponse {
  deviceSummary: DashboardDeviceSummary
  transactionSummary: DashboardTransactionSummary
  incidentSummary: DashboardIncidentSummary
  batchSummary: DashboardBatchSummary
  controlSyncSummary: DashboardControlSyncSummary
}

export interface DashboardTransactionTimelineItem {
  timePoint: string
  total: number
  openGate: number
  deny: number
  acceptedForForwarding: number
}

export interface DashboardTransactionTimelineResponse {
  bucket: DashboardBucket
  items: DashboardTransactionTimelineItem[]
}

export interface DashboardRouteStationSummaryItem {
  routeId: number
  routeCode?: string | null
  routeName?: string | null
  stationId: number
  stationCode?: string | null
  stationName?: string | null
  total: number
  openGate: number
  deny: number
}

export interface DashboardRouteStationSummaryResponse {
  items: DashboardRouteStationSummaryItem[]
}

export interface DashboardRecentIncidentItem {
  incidentId: string
  occurredAt: string
  stationId?: number | null
  stationCode?: string | null
  deviceId?: number | null
  deviceCode?: string | null
  severity: DashboardSeverity | string
  incidentType: string
  resolved: boolean
}

export interface DashboardRecentIncidentResponse {
  items: DashboardRecentIncidentItem[]
}

export interface DashboardAlertItem {
  type: string
  severity: DashboardSeverity | string
  message: string
  resourceType?: string | null
  resourceId?: string | number | null
}

export interface DashboardAlertResponse {
  items: DashboardAlertItem[]
}
