import { NextRequest } from "next/server"

import { handleOpsBffRequest } from "@/lib/api/bff/ops/handler"

interface DashboardBffRouteContext {
  params: Promise<{ bffPath: string[] }>
}

async function handleDashboardBffCatchAllRequest(request: NextRequest, context: DashboardBffRouteContext) {
  const { bffPath } = await context.params

  return handleOpsBffRequest(request, `/dashboard/${bffPath.join("/")}`)
}

export {
  handleDashboardBffCatchAllRequest as DELETE,
  handleDashboardBffCatchAllRequest as GET,
  handleDashboardBffCatchAllRequest as PATCH,
  handleDashboardBffCatchAllRequest as POST,
  handleDashboardBffCatchAllRequest as PUT,
}
