import type { PaymentMethod } from "./common"

export interface ScanTicketRequest {
  qrPayload: string
  stationId: number
  gateId: string
  scanTime: string
}

export interface ScanTicketResult {
  accepted: boolean
  action?: "CHECK_IN" | "CHECK_OUT"
  journeyId?: string
  journeyStatus?: string
  gateOpen: boolean
  reason?: string
}

export interface IncidentQuery {
  cardUid: string
}

export interface IncidentResult {
  cardUid: string
  status: string
  journeyId: string
  incidentType: string
}

export interface FareAdjustmentRequest {
  cardUid: string
  journeyId: string
  actualExitStationId: number
  amount: number
  paymentMethod: Extract<PaymentMethod, "CASH">
  shiftId: string
  reason: string
}

export interface FareAdjustmentResult {
  journeyStatus: string
  transactionId: string
  transactionType: string
}

export interface UnlockRequest {
  cardUid: string
  journeyId: string
  amount?: number
  paymentMethod?: Extract<PaymentMethod, "CASH">
  shiftId: string
  reason: string
}

export interface UnlockResult {
  cardStatus: string
  journeyStatus: string
  transactionType?: string
}

export interface OpenShiftRequest {
  stationId: number
  openingCashAmount: number
}

export interface OpenShiftResult {
  shiftId: string
  status: string
}

export interface CloseShiftRequest {
  shiftId: string
  actualCashCounted: number
  discrepancyReason?: string
}

export interface CloseShiftResult {
  shiftId?: string
  status: string
  systemCashAmount?: number
  actualCashCounted?: number
  hasDiscrepancy?: boolean
}
