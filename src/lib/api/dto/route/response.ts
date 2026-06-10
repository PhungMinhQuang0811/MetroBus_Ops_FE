import type { MasterDataStatus, TransportType } from "./request"

export interface TransitRoute {
  id: number
  operatorId: number
  routeCode: string
  routeName: string
  transportType: TransportType
  status: MasterDataStatus
  createdAt?: string
  updatedAt?: string
}

export interface RouteDetailStation {
  id: number
  routeId: number
  routeCode: string
  stationCode: string
  stationName: string
  stationOrder: number
  status: MasterDataStatus
}

export interface RouteDetail extends TransitRoute {
  stationCount: number
  stations: RouteDetailStation[]
}

export interface RouteListResponse {
  items: TransitRoute[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface RouteImportError {
  row: number
  field: string
  message: string
}

export interface RouteImportPreviewItem {
  row: number
  routeName: string | null
  transportType: string | null
  valid: boolean
  errors: RouteImportError[]
}

export interface PreviewImportRoutesResponse {
  totalRows: number
  validRows: number
  invalidRows: number
  items: RouteImportPreviewItem[]
  errors: RouteImportError[]
}

export interface ConfirmImportRouteItem extends TransitRoute {
  row: number
}

export interface ConfirmImportRoutesResponse {
  imported: number
  items: ConfirmImportRouteItem[]
}
