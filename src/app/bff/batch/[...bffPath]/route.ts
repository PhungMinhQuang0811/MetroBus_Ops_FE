import { NextRequest } from "next/server"

import { handleOpsBffRequest } from "@/lib/api/bff/ops/handler"

interface BatchBffRouteContext {
  params: Promise<{ bffPath: string[] }>
}

async function handleBatchBffCatchAllRequest(request: NextRequest, context: BatchBffRouteContext) {
  const { bffPath } = await context.params

  return handleOpsBffRequest(request, `/batch/${bffPath.join("/")}`)
}

export {
  handleBatchBffCatchAllRequest as DELETE,
  handleBatchBffCatchAllRequest as GET,
  handleBatchBffCatchAllRequest as PATCH,
  handleBatchBffCatchAllRequest as POST,
  handleBatchBffCatchAllRequest as PUT,
}
