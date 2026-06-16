import type {
  CardStatus,
  EntitlementStatus,
  MediaType,
  TapType,
  TicketProcessingStatus,
  TicketUsageStatus,
  TransactionDecision,
  TransactionReason,
  TransactionSyncStatus,
} from "./request"
import type { DeviceDirection, DeviceType } from "../device"

export interface Transaction {
  id: string
  eventId: string
  routeId: number
  routeCode?: string | null
  routeName?: string | null
  stationId: number
  stationCode?: string | null
  stationName?: string | null
  deviceId: number
  deviceCode: string
  mediaType: MediaType
  cardId?: string | null
  ticketId?: string | null
  entitlementId?: string | null
  qrId?: string | null
  tapType: TapType
  occurredAt: string
  decision: TransactionDecision
  reason: TransactionReason
  syncStatus: TransactionSyncStatus
  ticketProcessingStatus?: TicketProcessingStatus | null
  batchId?: string | null
}

export interface TransactionListResponse {
  items: Transaction[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface TransactionDetail extends Transaction {
  operatorId?: number
  operatorCode?: string
  operatorName?: string
  deviceType?: DeviceType
  deviceDirection?: DeviceDirection
  cardUid?: string | null
  cardStatus?: CardStatus | null
  ticketUsageStatus?: TicketUsageStatus | null
  entitlementStatus?: EntitlementStatus | null
  qrPayloadHash?: string | null
  journeyRef?: string | null
  receivedAt?: string | null
  rawEventRef?: string | null
  rawEventAvailable?: boolean
  ticketUsageResultAvailable?: boolean
  auditAvailable?: boolean
  createdAt?: string
  updatedAt?: string
}
