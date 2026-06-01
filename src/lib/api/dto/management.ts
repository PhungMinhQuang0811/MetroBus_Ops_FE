import type { TransportType } from "./common"

export interface CreateStaffRequest {
  username: string
  email: string
  fullName: string
  stationId: number
}

export interface CreateStaffResult {
  accountId: string
  role: "STAFF"
  operatorId: number
}

export interface ImportStaffRequest {
  items: CreateStaffRequest[]
}

export interface ImportResult {
  importedCount: number
  failedCount: number
  errors: string[]
}

export interface AssignShiftRequest {
  staffId: string
  stationId: number
  shiftStart: string
  shiftEnd: string
}

export interface AssignShiftResult {
  shiftId: string
  staffId: string
}

export interface StaffListQuery {
  operatorId?: number
}

export interface StaffSummary extends CreateStaffResult {
  username: string
  email: string
  fullName: string
}

export interface UpsertRouteRequest {
  routeCode: string
  routeName: string
  transportType: TransportType
}

export interface UpsertRouteResult {
  routeId: number
  operatorId: number
}

export interface UpsertStationRequest {
  routeId: number
  stationCode: string
  stationName: string
  stationOrder: number
}

export interface UpsertStationResult {
  stationId: number
  routeId: number
}

export interface ReorderStationsRequest {
  routeId: number
  stationOrders: Array<{ stationId: number; stationOrder: number }>
}

export interface ImportRoutesRequest {
  items: Array<{ routeCode: string; stationCode: string; stationOrder: number }>
}

export interface UpsertFarePolicyRequest {
  policyId: string
  transportType: TransportType
  calculationModel: string
  baseFare: number
  stepFare: number
  maxFare: number
  effectiveFrom: string
}

export interface UpsertFarePolicyResult {
  policyId: string
  cacheUpdated: boolean
}

export interface PreviewFareRequest {
  policyId: string
  entryStationId: number
  exitStationId: number
}

export interface PreviewFareResult {
  fare: number
  currency: string
}

export interface CreateTenantRequest {
  companyCode: string
  companyName: string
  taxCode: string
  managerEmail: string
  managerUsername: string
}

export interface CreateTenantResult {
  tenantId: string
  operatorId: number
  companyManagerAccountId: string
  operatorWalletId: string
}

export interface TenantSummary {
  tenantId: string
  operatorId: number
  companyName: string
  status: string
}

export interface UpdateFareCeilingRequest {
  transportType: TransportType
  maxSingleJourneyFare: number
  maxMonthlyPassFare: number
  effectiveFrom: string
}

export interface UpdateFareCeilingResult {
  configKey: string
  cacheUpdated: boolean
}
