export type MediaType = "VIRTUAL_QR"
export type TapType = "TAP_IN" | "TAP_OUT" | "CHECK"
export type TransactionDecision = "OPEN_GATE" | "DENY" | "ACCEPTED_FOR_FORWARDING"
export type TransactionReason =
  | "VALID"
  | "DEVICE_DISABLED"
  | "INVALID_DIRECTION"
  | "MEDIA_BLACKLISTED"
  | "CARD_INACTIVE"
  | "CARD_CANCELLED"
  | "UNKNOWN_MEDIA"
  | "QR_EXPIRED"
  | "QR_INVALID_SIGNATURE"
  | "QR_REPLAYED"
  | "ENTITLEMENT_EXPIRED"
  | "ENTITLEMENT_INACTIVE"
  | "TICKET_INVALID"
  | "TICKET_EXPIRED"
  | "TICKET_ALREADY_USED"
  | "TICKET_SCOPE_INVALID"
  | "ACTIVE_PRODUCT_CONFLICT"
export type TransactionSyncStatus = "PENDING" | "SYNCED" | "FAILED"
export type TicketProcessingStatus = "PENDING" | "CONFIRMED" | "FAILED"
export type CardStatus = "ACTIVE" | "INACTIVE" | "CANCELLED" | "BLACKLISTED"
export type TicketUsageStatus = "UNUSED" | "IN_USE" | "USED" | "EXPIRED" | "CANCELLED"
export type EntitlementStatus = "ACTIVE" | "INACTIVE" | "CANCELLED" | "EXPIRED"

export interface ListTransactionsQuery {
  from?: string
  to?: string
  routeId?: number
  stationId?: number
  deviceId?: number
  cardId?: string
  ticketId?: string
  entitlementId?: string
  tapType?: TapType
  decision?: TransactionDecision
  reason?: TransactionReason
  syncStatus?: TransactionSyncStatus
  ticketProcessingStatus?: TicketProcessingStatus
  page?: number
  size?: number
}
