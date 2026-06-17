export type DeviceType = "QR_SCANNER_SIMULATOR"
export type DeviceDirection = "ENTRY" | "EXIT" | "BOTH"
export type DeviceStatus = "ACTIVE" | "OFFLINE" | "MAINTENANCE" | "DISABLED"
export type DeviceEditableStatus = Exclude<DeviceStatus, "OFFLINE">

export interface ListDevicesQuery {
  stationId?: number
  deviceType?: DeviceType
  status?: DeviceStatus
  keyword?: string
  page?: number
  size?: number
}

export interface DeviceCreateRequest {
  stationId: number
  deviceType: DeviceType
  direction: DeviceDirection
  firmwareVersion?: string
}

export interface DeviceUpdateRequest extends DeviceCreateRequest {
  status: DeviceEditableStatus
}

export interface GetDeviceStatusQuery {
  routeId?: number
  stationId?: number
  status?: string
  page?: number
  size?: number
}

export interface GetDeviceHeartbeatsQuery {
  deviceId: number
  page?: number
  size?: number
}

