import type { MasterDataStatus } from "../route/request"

export interface ListStationsQuery {
  routeId?: number
  keyword?: string
  status?: MasterDataStatus
  page?: number
  size?: number
}

export interface StationMutationRequest {
  routeId: number
  stationName: string
  stationOrder: number
}
