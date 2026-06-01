import { apiRequest } from "../client"
import { API_ENDPOINTS } from "../endpoints"
import type { ListResult } from "../dto/common"
import type {
  AssignShiftRequest,
  AssignShiftResult,
  CreateStaffRequest,
  CreateStaffResult,
  CreateTenantRequest,
  CreateTenantResult,
  ImportResult,
  ImportRoutesRequest,
  ImportStaffRequest,
  PreviewFareRequest,
  PreviewFareResult,
  ReorderStationsRequest,
  StaffListQuery,
  StaffSummary,
  TenantSummary,
  UpdateFareCeilingRequest,
  UpdateFareCeilingResult,
  UpsertFarePolicyRequest,
  UpsertFarePolicyResult,
  UpsertRouteRequest,
  UpsertRouteResult,
  UpsertStationRequest,
  UpsertStationResult,
} from "../dto/management"

export const managementApi = {
  createStaff: (body: CreateStaffRequest) => apiRequest<CreateStaffResult>(API_ENDPOINTS.staff.root, { method: "POST", body }),
  importStaff: (body: ImportStaffRequest) => apiRequest<ImportResult>(API_ENDPOINTS.staff.import, { method: "POST", body }),
  assignShift: (body: AssignShiftRequest) => apiRequest<AssignShiftResult>(API_ENDPOINTS.staff.assignShift, { method: "POST", body }),
  getStaff: (query: StaffListQuery = {}) => apiRequest<ListResult<StaffSummary>>(API_ENDPOINTS.staff.root, { query }),
  upsertRoute: (body: UpsertRouteRequest) => apiRequest<UpsertRouteResult>(API_ENDPOINTS.routes.root, { method: "POST", body }),
  importRoutes: (body: ImportRoutesRequest) => apiRequest<ImportResult>(API_ENDPOINTS.routes.import, { method: "POST", body }),
  upsertStation: (body: UpsertStationRequest) => apiRequest<UpsertStationResult>(API_ENDPOINTS.stations.root, { method: "POST", body }),
  reorderStations: (body: ReorderStationsRequest) => apiRequest<null>(API_ENDPOINTS.stations.reorder, { method: "POST", body }),
  upsertFarePolicy: (body: UpsertFarePolicyRequest) => apiRequest<UpsertFarePolicyResult>(API_ENDPOINTS.farePolicies.root, { method: "POST", body }),
  previewFare: (body: PreviewFareRequest) => apiRequest<PreviewFareResult>(API_ENDPOINTS.farePolicies.preview, { method: "POST", body }),
  createTenant: (body: CreateTenantRequest) => apiRequest<CreateTenantResult>(API_ENDPOINTS.tenants.root, { method: "POST", body }),
  getTenants: () => apiRequest<ListResult<TenantSummary>>(API_ENDPOINTS.tenants.root),
  updateFareCeiling: (body: UpdateFareCeilingRequest) => apiRequest<UpdateFareCeilingResult>(API_ENDPOINTS.configs.fareCeiling, { method: "POST", body }),
}
