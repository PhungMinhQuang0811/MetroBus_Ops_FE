export type ControlPackageType = "DEVICE_CONFIG" | "MEDIA_ACCESS_RULES"
export type ControlPackageSourceType = "LEVEL4_CREATED" | "LEVEL5_SYNCED"
export type ControlPackageStatus = "CREATED" | "PUBLISHED" | "REVOKED"
export type ControlSyncStatus = "PENDING" | "APPLIED" | "FAILED"

export type ControlPackagePayload = Record<string, unknown>

export interface ListControlPackagesQuery {
  packageType?: ControlPackageType
  sourceType?: ControlPackageSourceType
  status?: ControlPackageStatus
  page?: number
  size?: number
}

export interface CreateControlPackageRequest {
  packageType: ControlPackageType
  payload: ControlPackagePayload
}

export interface UpdateControlPackageRequest {
  payload: ControlPackagePayload
}

export interface PublishControlPackageRequest {
  stationIds: number[]
}

export interface PullPendingControlPackagesQuery {
  stationCode: string
  currentVersion: number
}

export interface AckControlPackageApplyRequest {
  syncStatus: Extract<ControlSyncStatus, "APPLIED" | "FAILED">
  errorMessage?: string | null
}

export interface SearchControlSyncsQuery {
  packageType?: ControlPackageType
  version?: number
  stationId?: number
  status?: ControlSyncStatus
  page?: number
  size?: number
}
