export type TransportType = "METRO" | "BUS"
export type MasterDataStatus = "ACTIVE" | "DISABLED"

export interface ListRoutesQuery {
  keyword?: string
  transportType?: TransportType
  status?: MasterDataStatus
  page?: number
  size?: number
}

export interface RouteMutationRequest {
  routeName: string
  transportType: TransportType
}
