import { apiRequest } from "../client"
import { API_ENDPOINTS } from "../endpoints"
import type { SearchIncidentsQuery, IncidentListResponse, IncidentDetail } from "../dto/incident"

export const incidentApi = {
  searchIncidents: (query: SearchIncidentsQuery) =>
    apiRequest<IncidentListResponse>(API_ENDPOINTS.incident.searchIncidents, {
      service: "ops",
      method: "GET",
      query,
    }),
  getIncidentDetail: (incidentId: string) =>
    apiRequest<IncidentDetail>(API_ENDPOINTS.incident.getIncident(incidentId), {
      service: "ops",
      method: "GET",
    }),
}
