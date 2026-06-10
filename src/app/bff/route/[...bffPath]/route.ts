import { NextRequest } from "next/server"

import { handleOpsBffRequest } from "@/lib/api/bff/ops/handler"

interface RouteBffRouteContext {
  params: Promise<{ bffPath: string[] }>
}

async function handleRouteBffCatchAllRequest(request: NextRequest, context: RouteBffRouteContext) {
  const { bffPath } = await context.params

  return handleOpsBffRequest(request, `/route/${bffPath.join("/")}`)
}

export {
  handleRouteBffCatchAllRequest as DELETE,
  handleRouteBffCatchAllRequest as GET,
  handleRouteBffCatchAllRequest as PATCH,
  handleRouteBffCatchAllRequest as POST,
  handleRouteBffCatchAllRequest as PUT,
}
