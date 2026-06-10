import { apiRequest } from "../client"
import { API_ENDPOINTS } from "../endpoints"
import type {
  ConfirmImportStationsResponse,
  ListStationsQuery,
  PreviewImportStationsResponse,
  Station,
  StationDetail,
  StationListResponse,
  StationMutationRequest,
} from "../dto/station"

function createImportFormData(file: File) {
  const formData = new FormData()
  formData.set("file", file)

  return formData
}

export const stationApi = {
  listStations: (query: ListStationsQuery) =>
    apiRequest<StationListResponse>(API_ENDPOINTS.station.listStations, { service: "ops", method: "GET", query }),
  getStation: (stationId: number) =>
    apiRequest<StationDetail>(API_ENDPOINTS.station.getStation(stationId), { service: "ops", method: "GET" }),
  createStation: (body: StationMutationRequest) =>
    apiRequest<Station>(API_ENDPOINTS.station.createStation, { service: "ops", method: "POST", body }),
  updateStation: (stationId: number, body: StationMutationRequest) =>
    apiRequest<Station>(API_ENDPOINTS.station.updateStation(stationId), { service: "ops", method: "POST", body }),
  enableStation: (stationId: number) =>
    apiRequest<Station>(API_ENDPOINTS.station.enableStation(stationId), { service: "ops", method: "POST" }),
  disableStation: (stationId: number) =>
    apiRequest<Station>(API_ENDPOINTS.station.disableStation(stationId), { service: "ops", method: "POST" }),
  previewImportStations: (file: File) =>
    apiRequest<PreviewImportStationsResponse>(API_ENDPOINTS.station.previewImportStations, {
      service: "ops",
      method: "POST",
      body: createImportFormData(file),
    }),
  confirmImportStations: (file: File) =>
    apiRequest<ConfirmImportStationsResponse>(API_ENDPOINTS.station.confirmImportStations, {
      service: "ops",
      method: "POST",
      body: createImportFormData(file),
    }),
}
