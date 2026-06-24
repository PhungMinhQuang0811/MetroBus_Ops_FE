import { NextRequest } from "next/server"

import { handleOpsBffRequest } from "@/lib/api/bff/ops/handler"

interface ReconciliationBffRouteContext {
  params: Promise<{ bffPath: string[] }>
}

async function handleReconciliationBffCatchAllRequest(request: NextRequest, context: ReconciliationBffRouteContext) {
  const { bffPath } = await context.params

  return handleOpsBffRequest(request, `/reconciliation/${bffPath.join("/")}`)
}

export {
  handleReconciliationBffCatchAllRequest as DELETE,
  handleReconciliationBffCatchAllRequest as GET,
  handleReconciliationBffCatchAllRequest as PATCH,
  handleReconciliationBffCatchAllRequest as POST,
  handleReconciliationBffCatchAllRequest as PUT,
}