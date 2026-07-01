import { apiRequest } from "../client"
import { API_ENDPOINTS } from "../endpoints"
import type { CheckInRequest } from "../dto/shift/check-in-request"
import type { CheckInResponse } from "../dto/shift/check-in-response"
import type { CheckOutResponse } from "../dto/shift/check-out-response"
import type { ShiftListResponse } from "../dto/shift/shift-response"

export const shiftApi = {
  checkIn: (body: CheckInRequest) =>
    apiRequest<CheckInResponse>(API_ENDPOINTS.shift.checkIn, { service: "ops", method: "POST", body }),
  checkOut: () =>
    apiRequest<CheckOutResponse>(API_ENDPOINTS.shift.checkOut, { service: "ops", method: "POST" }),
  listShifts: (page = 0, size = 20, status?: string) =>
    apiRequest<ShiftListResponse>(API_ENDPOINTS.shift.listShifts, {
      service: "ops",
      method: "GET",
      query: { page, size, status },
    }),
  listAllShifts: (page = 0, size = 20, stationId?: number, status?: string) =>
    apiRequest<ShiftListResponse>(API_ENDPOINTS.shift.listAllShifts, {
      service: "ops",
      method: "GET",
      query: { page, size, stationId, status },
    }),
}
