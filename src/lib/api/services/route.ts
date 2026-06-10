import { apiRequest } from "../client"
import { API_ENDPOINTS } from "../endpoints"
import type {
  ConfirmImportRoutesResponse,
  ListRoutesQuery,
  PreviewImportRoutesResponse,
  RouteListResponse,
  RouteMutationRequest,
  TransitRoute,
} from "../dto/route"

function createImportFormData(file: File) {
  const formData = new FormData()
  formData.set("file", file)

  return formData
}

export const routeApi = {
  listRoutes: (query: ListRoutesQuery) =>
    apiRequest<RouteListResponse>(API_ENDPOINTS.route.listRoutes, { service: "ops", method: "GET", query }),
  createRoute: (body: RouteMutationRequest) =>
    apiRequest<TransitRoute>(API_ENDPOINTS.route.createRoute, { service: "ops", method: "POST", body }),
  updateRoute: (routeId: number, body: RouteMutationRequest) =>
    apiRequest<TransitRoute>(API_ENDPOINTS.route.updateRoute(routeId), { service: "ops", method: "POST", body }),
  enableRoute: (routeId: number) =>
    apiRequest<TransitRoute>(API_ENDPOINTS.route.enableRoute(routeId), { service: "ops", method: "POST" }),
  disableRoute: (routeId: number) =>
    apiRequest<TransitRoute>(API_ENDPOINTS.route.disableRoute(routeId), { service: "ops", method: "POST" }),
  previewImportRoutes: (file: File) =>
    apiRequest<PreviewImportRoutesResponse>(API_ENDPOINTS.route.previewImportRoutes, {
      service: "ops",
      method: "POST",
      body: createImportFormData(file),
    }),
  confirmImportRoutes: (file: File) =>
    apiRequest<ConfirmImportRoutesResponse>(API_ENDPOINTS.route.confirmImportRoutes, {
      service: "ops",
      method: "POST",
      body: createImportFormData(file),
    }),
}
