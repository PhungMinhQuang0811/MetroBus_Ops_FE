import { apiRequest } from "../client"
import { API_ENDPOINTS } from "../endpoints"
import type {
  AckControlPackageApplyRequest,
  AckControlPackageApplyResponse,
  ControlPackage,
  ControlPackageDetail,
  ControlPackageListResponse,
  ControlSyncDetail,
  ControlSyncListResponse,
  CreateControlPackageRequest,
  ListControlPackagesQuery,
  PendingControlPackage,
  PublishControlPackageRequest,
  PublishControlPackageResponse,
  PullPendingControlPackagesQuery,
  SearchControlSyncsQuery,
  UpdateControlPackageRequest,
} from "../dto/control-package"

export const controlPackageApi = {
  createPackage: (body: CreateControlPackageRequest) =>
    apiRequest<ControlPackage>(API_ENDPOINTS.controlPackage.createPackage, { service: "ops", method: "POST", body }),
  updatePackage: (packageId: number, body: UpdateControlPackageRequest) =>
    apiRequest<ControlPackage>(API_ENDPOINTS.controlPackage.updatePackage(packageId), { service: "ops", method: "POST", body }),
  getPackageDetail: (packageId: number) =>
    apiRequest<ControlPackageDetail>(API_ENDPOINTS.controlPackage.getPackageDetail, {
      service: "ops",
      method: "GET",
      query: { packageId },
    }),
  listPackages: (query: ListControlPackagesQuery) =>
    apiRequest<ControlPackageListResponse>(API_ENDPOINTS.controlPackage.listPackages, { service: "ops", method: "GET", query }),
  publishPackage: (packageId: number, body: PublishControlPackageRequest) =>
    apiRequest<PublishControlPackageResponse>(API_ENDPOINTS.controlPackage.publishPackage(packageId), {
      service: "ops",
      method: "POST",
      body,
    }),
  pullPending: (query: PullPendingControlPackagesQuery) =>
    apiRequest<PendingControlPackage[]>(API_ENDPOINTS.controlPackage.pullPending, { service: "ops", method: "GET", query }),
  ackApply: (syncId: number, body: AckControlPackageApplyRequest) =>
    apiRequest<AckControlPackageApplyResponse>(API_ENDPOINTS.controlPackage.ackApply(syncId), {
      service: "ops",
      method: "POST",
      body,
    }),
  searchSyncs: (query: SearchControlSyncsQuery) =>
    apiRequest<ControlSyncListResponse>(API_ENDPOINTS.controlPackage.searchSyncs, { service: "ops", method: "GET", query }),
  getSyncDetail: (syncId: number) =>
    apiRequest<ControlSyncDetail>(API_ENDPOINTS.controlPackage.getSyncDetail, {
      service: "ops",
      method: "GET",
      query: { syncId },
    }),
  triggerDeviceSync: (stationCode: string) =>
    apiRequest<Record<string, unknown>>(API_ENDPOINTS.controlPackage.triggerDeviceSync, {
      service: "ops",
      method: "POST",
      query: { stationCode },
    }),
}
