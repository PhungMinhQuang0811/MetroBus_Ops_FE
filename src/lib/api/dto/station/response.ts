import type { MasterDataStatus } from "../route/request"

export interface Station {
  id: number
  routeId: number
  routeCode: string
  stationCode: string
  stationName: string
  stationOrder: number
  status: MasterDataStatus
  createdAt?: string
  updatedAt?: string
}

export interface StationDeviceSummary {
  total: number
  active: number
  offline: number
  maintenance: number
  disabled: number
}

export interface StationDetailDevice {
  id: number
  deviceCode: string
  deviceType: string
  direction: string
  status: string
  firmwareVersion?: string | null
  lastSeenAt?: string | null
}

export interface StationDetail extends Station {
  routeName: string
  deviceSummary: StationDeviceSummary
  devices: StationDetailDevice[]
}

export interface StationListResponse {
  items: Station[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface StationImportError {
  row: number
  field: string
  message: string
}

export interface StationImportPreviewItem {
  row: number
  routeId: number | null
  routeCode: string | null
  stationName: string | null
  stationOrder: number | null
  valid: boolean
  errors: StationImportError[]
}

export interface PreviewImportStationsResponse {
  totalRows: number
  validRows: number
  invalidRows: number
  items: StationImportPreviewItem[]
  errors: StationImportError[]
}

export interface ConfirmImportStationItem extends Station {
  row: number
}

export interface ConfirmImportStationsResponse {
  imported: number
  items: ConfirmImportStationItem[]
}
