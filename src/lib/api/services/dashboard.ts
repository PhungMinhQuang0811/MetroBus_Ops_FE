import { apiRequest } from "../client"
import { API_ENDPOINTS } from "../endpoints"
import type {
  DashboardAlertResponse,
  DashboardAlertsQuery,
  DashboardFilterQuery,
  DashboardRecentIncidentResponse,
  DashboardRecentIncidentsQuery,
  DashboardRouteStationSummaryResponse,
  DashboardSummaryResponse,
  DashboardTimelineQuery,
  DashboardTransactionTimelineResponse,
} from "../dto/dashboard"

export const dashboardApi = {
  getSummary: (query: DashboardFilterQuery) =>
    apiRequest<DashboardSummaryResponse>(API_ENDPOINTS.dashboard.summary, {
      service: "ops",
      method: "GET",
      query,
    }),
  getTransactionTimeline: (query: DashboardTimelineQuery) =>
    apiRequest<DashboardTransactionTimelineResponse>(API_ENDPOINTS.dashboard.transactionTimeline, {
      service: "ops",
      method: "GET",
      query,
    }),
  getRouteStationSummaries: (query: DashboardFilterQuery) =>
    apiRequest<DashboardRouteStationSummaryResponse>(API_ENDPOINTS.dashboard.routeStationSummaries, {
      service: "ops",
      method: "GET",
      query,
    }),
  getRecentIncidents: (query: DashboardRecentIncidentsQuery) =>
    apiRequest<DashboardRecentIncidentResponse>(API_ENDPOINTS.dashboard.recentIncidents, {
      service: "ops",
      method: "GET",
      query,
    }),
  getAlerts: (query: DashboardAlertsQuery) =>
    apiRequest<DashboardAlertResponse>(API_ENDPOINTS.dashboard.alerts, {
      service: "ops",
      method: "GET",
      query,
    }),
}
