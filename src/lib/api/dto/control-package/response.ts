import type {
  ControlPackagePayload,
  ControlPackageSourceType,
  ControlPackageStatus,
  ControlPackageType,
  ControlSyncStatus,
} from "./request"

export interface ControlPackage {
  id: number
  version: number
  packageType: ControlPackageType
  sourceType: ControlPackageSourceType
  status: ControlPackageStatus
  createdByAccountId?: string | null
  createdAt?: string | null
  updatedAt?: string | null
  publishedAt?: string | null
}

export interface ControlPackageDetail extends ControlPackage {
  payload: ControlPackagePayload
}

export interface ControlPackageListResponse {
  items: ControlPackage[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface PublishedStationSync {
  stationId: number
  syncStatus: ControlSyncStatus
}

export interface PublishControlPackageResponse {
  packageId: number
  status: ControlPackageStatus
  stationSyncs: PublishedStationSync[]
}

export interface PendingControlPackage {
  syncId: number
  packageId: number
  version: number
  packageType: ControlPackageType
  sourceType: ControlPackageSourceType
  payload: ControlPackagePayload
}

export interface AckControlPackageApplyResponse {
  syncId: number
  syncStatus: ControlSyncStatus
}

export interface ControlSync {
  syncId: number
  stationId: number
  stationCode: string
  stationName: string
  packageId: number
  packageType: ControlPackageType
  version: number
  syncStatus: ControlSyncStatus
  retryCount: number
  lastAttemptAt?: string | null
  appliedAt?: string | null
  updatedAt?: string | null
  errorMessage?: string | null
}

export interface ControlSyncListResponse {
  items: ControlSync[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface ControlSyncDetail extends ControlSync {
  routeId?: number | null
  routeName?: string | null
  sourceType: ControlPackageSourceType
  packageStatus: ControlPackageStatus
  createdAt?: string | null
}
