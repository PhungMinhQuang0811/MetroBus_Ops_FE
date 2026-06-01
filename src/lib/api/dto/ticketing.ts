import type { PaymentMethod, PaymentProvider } from "./common"

export interface CreatePhysicalCardOrderRequest {
  fullName: string
  phone: string
  email: string
  citizenId: string
  deliveryMethod: "PICKUP" | "SHIPPING"
  pickupStationId: number | null
  shippingAddress: string | null
  paymentProvider: PaymentProvider
}

export interface CreatePhysicalCardOrderResult {
  orderId: string
  orderStatus: string
  paymentUrl: string
}

export interface PaymentCallbackRequest {
  provider: PaymentProvider
  providerTransactionId: string
  orderId: string
  amount: number
  status: "SUCCESS" | "CANCELLED" | "EXPIRED"
  signature: string
}

export interface PaymentCallbackResult {
  processed: boolean
  duplicate?: boolean
  orderId?: string
  orderStatus?: string
  cardMedium?: "PHYSICAL"
  cardStatus?: string
}

export interface CreateVirtualCardRequest {
  subscriptionPlanId: string
  paymentMethod: Extract<PaymentMethod, "WALLET">
}

export interface CreateVirtualCardResult {
  cardId: string
  cardUid: string
  cardMedium: "VIRTUAL"
  status: string
  subscriptionId: string
}

export interface VirtualizeCardRequest {
  cardUid: string
  citizenId: string
}

export interface VirtualizeCardResult {
  physicalCardId: string
  physicalCardStatus: string
  virtualCardId: string
  virtualCardStatus: string
}

export interface RenewSubscriptionRequest {
  subscriptionId: string
  planId: string
  paymentMethod: Extract<PaymentMethod, "WALLET">
}

export interface RenewSubscriptionResult {
  subscriptionId: string
  startDate: string
  endDate: string
  transactionId: string
}

export interface GuestRenewSubscriptionRequest {
  cardUid: string
  planId: string
  paymentProvider: PaymentProvider
}

export interface GuestRenewSubscriptionResult {
  paymentUrl: string
  orderId: string
}

export interface CreatePhysicalCardRequest {
  cardUid: string
}

export interface PhysicalCardResult {
  cardId: string
  cardUid: string
  cardMedium: "PHYSICAL"
  status: string
}

export interface ImportPhysicalCardsRequest {
  cardUids: string[]
}

export interface ImportPhysicalCardsResult {
  createdCount: number
  duplicateCount: number
  duplicates: string[]
}

export interface RevokeCardRequest {
  cardUid: string
  reason: string
}

export interface RevokeCardResult {
  cardId: string
  status: string
}

export interface PrintableOrder {
  orderId: string
  orderStatus: string
  cardUid: string
}

export interface PhysicalCardOrderQuery {
  status: string
}

export interface UpdateOrderStatusRequest {
  orderId: string
  targetStatus: string
  note?: string
}

export interface UpdateOrderStatusResult {
  orderId: string
  orderStatus: string
}
