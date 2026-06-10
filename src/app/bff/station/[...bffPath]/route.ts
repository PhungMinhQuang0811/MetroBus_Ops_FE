import { NextRequest } from "next/server"

import { handleOpsBffRequest } from "@/lib/api/bff/ops/handler"

interface StationBffRouteContext {
  params: Promise<{ bffPath: string[] }>
}

async function handleStationBffCatchAllRequest(request: NextRequest, context: StationBffRouteContext) {
  const { bffPath } = await context.params

  return handleOpsBffRequest(request, `/station/${bffPath.join("/")}`)
}

export {
  handleStationBffCatchAllRequest as DELETE,
  handleStationBffCatchAllRequest as GET,
  handleStationBffCatchAllRequest as PATCH,
  handleStationBffCatchAllRequest as POST,
  handleStationBffCatchAllRequest as PUT,
}
