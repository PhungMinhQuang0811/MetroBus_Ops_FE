import { apiRequest } from "../client"
import { API_ENDPOINTS } from "../endpoints"
import type {
  CloseShiftRequest,
  CloseShiftResult,
  FareAdjustmentRequest,
  FareAdjustmentResult,
  IncidentQuery,
  IncidentResult,
  OpenShiftRequest,
  OpenShiftResult,
  ScanTicketRequest,
  ScanTicketResult,
  UnlockRequest,
  UnlockResult,
} from "../dto/operations"

export const operationsApi = {
  scanTicket: (body: ScanTicketRequest) => apiRequest<ScanTicketResult>(API_ENDPOINTS.validator.scanTicket, { method: "POST", body }),
  getIncident: (query: IncidentQuery) => apiRequest<IncidentResult>(API_ENDPOINTS.psc.incidents, { query }),
  adjustFare: (body: FareAdjustmentRequest) => apiRequest<FareAdjustmentResult>(API_ENDPOINTS.psc.fareAdjustment, { method: "POST", body }),
  penaltyUnlock: (body: UnlockRequest) => apiRequest<UnlockResult>(API_ENDPOINTS.psc.penaltyUnlock, { method: "POST", body }),
  freeUnlock: (body: UnlockRequest) => apiRequest<UnlockResult>(API_ENDPOINTS.psc.freeUnlock, { method: "POST", body }),
  openShift: (body: OpenShiftRequest) => apiRequest<OpenShiftResult>(API_ENDPOINTS.shifts.open, { method: "POST", body }),
  closeShift: (body: CloseShiftRequest) => apiRequest<CloseShiftResult>(API_ENDPOINTS.shifts.close, { method: "POST", body }),
}
