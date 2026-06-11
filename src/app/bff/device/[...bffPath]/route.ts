import { NextRequest } from "next/server"

import { handleOpsBffRequest } from "@/lib/api/bff/ops/handler"

interface DeviceBffRouteContext {
  params: Promise<{ bffPath: string[] }>
}

async function handleDeviceBffCatchAllRequest(request: NextRequest, context: DeviceBffRouteContext) {
  const { bffPath } = await context.params

  return handleOpsBffRequest(request, `/device/${bffPath.join("/")}`)
}

export {
  handleDeviceBffCatchAllRequest as DELETE,
  handleDeviceBffCatchAllRequest as GET,
  handleDeviceBffCatchAllRequest as PATCH,
  handleDeviceBffCatchAllRequest as POST,
  handleDeviceBffCatchAllRequest as PUT,
}
