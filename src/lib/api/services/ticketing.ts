import { apiRequest } from "../client"
import { API_ENDPOINTS } from "../endpoints"
import type { ListResult } from "../dto/common"
import type {
  CreatePhysicalCardOrderRequest,
  CreatePhysicalCardOrderResult,
  CreatePhysicalCardRequest,
  CreateVirtualCardRequest,
  CreateVirtualCardResult,
  GuestRenewSubscriptionRequest,
  GuestRenewSubscriptionResult,
  ImportPhysicalCardsRequest,
  ImportPhysicalCardsResult,
  PaymentCallbackRequest,
  PaymentCallbackResult,
  PhysicalCardOrderQuery,
  PhysicalCardResult,
  PrintableOrder,
  RenewSubscriptionRequest,
  RenewSubscriptionResult,
  RevokeCardRequest,
  RevokeCardResult,
  UpdateOrderStatusRequest,
  UpdateOrderStatusResult,
  VirtualizeCardRequest,
  VirtualizeCardResult,
} from "../dto/ticketing"

export const ticketingApi = {
  createPhysicalCardOrder: (body: CreatePhysicalCardOrderRequest) => apiRequest<CreatePhysicalCardOrderResult>(API_ENDPOINTS.orders.physicalCard, { method: "POST", body }),
  paymentCallback: (body: PaymentCallbackRequest) => apiRequest<PaymentCallbackResult>(API_ENDPOINTS.payments.callback, { method: "POST", body }),
  createVirtualCard: (body: CreateVirtualCardRequest) => apiRequest<CreateVirtualCardResult>(API_ENDPOINTS.cards.createVirtual, { method: "POST", body }),
  virtualizeCard: (body: VirtualizeCardRequest) => apiRequest<VirtualizeCardResult>(API_ENDPOINTS.cards.virtualize, { method: "POST", body }),
  renewSubscription: (body: RenewSubscriptionRequest) => apiRequest<RenewSubscriptionResult>(API_ENDPOINTS.subscriptions.renew, { method: "POST", body }),
  guestRenewSubscription: (body: GuestRenewSubscriptionRequest) => apiRequest<GuestRenewSubscriptionResult>(API_ENDPOINTS.subscriptions.guestRenew, { method: "POST", body }),
  createPhysicalCard: (body: CreatePhysicalCardRequest) => apiRequest<PhysicalCardResult>(API_ENDPOINTS.cards.createPhysical, { method: "POST", body }),
  importPhysicalCards: (body: ImportPhysicalCardsRequest) => apiRequest<ImportPhysicalCardsResult>(API_ENDPOINTS.cards.importPhysical, { method: "POST", body }),
  revokeCard: (body: RevokeCardRequest) => apiRequest<RevokeCardResult>(API_ENDPOINTS.cards.revoke, { method: "POST", body }),
  getPrintableOrders: (query: PhysicalCardOrderQuery) => apiRequest<ListResult<PrintableOrder>>(API_ENDPOINTS.orders.physicalCard, { query }),
  updateOrderStatus: (body: UpdateOrderStatusRequest) => apiRequest<UpdateOrderStatusResult>(API_ENDPOINTS.orders.updateStatus, { method: "POST", body }),
}
