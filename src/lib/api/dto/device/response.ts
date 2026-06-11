import type { DeviceDirection, DeviceStatus, DeviceType } from "./request"

export interface Device {
  id: number
  routeId: number
  routeCode: string
  stationId: number
  stationCode: string
  stationName: string
  deviceCode: string
  deviceType: DeviceType
  direction: DeviceDirection
  status: DeviceStatus
  firmwareVersion?: string | null
  lastSeenAt?: string | null
  createdAt?: string
  updatedAt?: string
}

export interface DeviceLatestIncident {
  incidentId: string
  incidentType: string
  severity: string
  message: string
  occurredAt: string
}

export interface DeviceDetail extends Device {
  routeName: string
  latestIncident: DeviceLatestIncident | null
}

export interface DeviceMutationResponse extends Device {
  deviceSecret?: string
}

export interface DeviceListResponse {
  items: Device[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface DeviceImportError {
  row: number
  field: string
  message: string
}

export interface DeviceImportPreviewItem {
  row: number
  stationId: number | null
  stationCode: string | null
  stationName: string | null
  deviceType: DeviceType | string | null
  direction: DeviceDirection | string | null
  firmwareVersion: string | null
  valid: boolean
  errors: DeviceImportError[]
}

export interface PreviewImportDevicesResponse {
  totalRows: number
  validRows: number
  invalidRows: number
  items: DeviceImportPreviewItem[]
  errors: DeviceImportError[]
}

export interface ConfirmImportDeviceItem extends DeviceMutationResponse {
  row: number
}

export interface ConfirmImportDevicesResponse {
  imported: number
  items: ConfirmImportDeviceItem[]
}
