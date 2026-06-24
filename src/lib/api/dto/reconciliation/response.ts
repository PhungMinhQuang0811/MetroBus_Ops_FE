export interface Settlement {
  id: number
  settlementId: string
  period: string
  operatorCode: string
  allocatedAmount: number
  totalKm: number
  totalTrips: number
  kmRatio: number
  createdAt: string
}

export interface SettlementListResponse {
  items: Settlement[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}