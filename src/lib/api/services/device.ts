import { apiRequest } from "../client"
import { API_ENDPOINTS } from "../endpoints"
import type {
  ConfirmImportDevicesResponse,
  DeviceCreateRequest,
  DeviceDetail,
  DeviceListResponse,
  DeviceMutationResponse,
  DeviceUpdateRequest,
  ListDevicesQuery,
  PreviewImportDevicesResponse,
} from "../dto/device"

function createImportFormData(file: File) {
  const formData = new FormData()
  formData.set("file", file)

  return formData
}

export const deviceApi = {
  listDevices: (query: ListDevicesQuery) =>
    apiRequest<DeviceListResponse>(API_ENDPOINTS.device.listDevices, { service: "ops", method: "GET", query }),
  getDevice: (deviceId: number) =>
    apiRequest<DeviceDetail>(API_ENDPOINTS.device.getDevice(deviceId), { service: "ops", method: "GET" }),
  createDevice: (body: DeviceCreateRequest) =>
    apiRequest<DeviceMutationResponse>(API_ENDPOINTS.device.createDevice, { service: "ops", method: "POST", body }),
  updateDevice: (deviceId: number, body: DeviceUpdateRequest) =>
    apiRequest<DeviceMutationResponse>(API_ENDPOINTS.device.updateDevice(deviceId), { service: "ops", method: "POST", body }),
  enableDevice: (deviceId: number) =>
    apiRequest<DeviceMutationResponse>(API_ENDPOINTS.device.enableDevice(deviceId), { service: "ops", method: "POST" }),
  disableDevice: (deviceId: number) =>
    apiRequest<DeviceMutationResponse>(API_ENDPOINTS.device.disableDevice(deviceId), { service: "ops", method: "POST" }),
  previewImportDevices: (file: File) =>
    apiRequest<PreviewImportDevicesResponse>(API_ENDPOINTS.device.previewImportDevices, {
      service: "ops",
      method: "POST",
      body: createImportFormData(file),
    }),
  confirmImportDevices: (file: File) =>
    apiRequest<ConfirmImportDevicesResponse>(API_ENDPOINTS.device.confirmImportDevices, {
      service: "ops",
      method: "POST",
      body: createImportFormData(file),
    }),
}
