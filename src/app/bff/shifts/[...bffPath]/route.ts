import { NextRequest } from "next/server"

import { handleOpsBffRequest } from "@/lib/api/bff/ops/handler"

interface ShiftBffRouteContext {
  params: Promise<{ bffPath: string[] }>
}

async function handleShiftBffCatchAllRequest(request: NextRequest, context: ShiftBffRouteContext) {
  const { bffPath } = await context.params

  return handleOpsBffRequest(request, `/shifts/${bffPath.join("/")}`)
}

export {
  handleShiftBffCatchAllRequest as DELETE,
  handleShiftBffCatchAllRequest as GET,
  handleShiftBffCatchAllRequest as PATCH,
  handleShiftBffCatchAllRequest as POST,
  handleShiftBffCatchAllRequest as PUT,
}