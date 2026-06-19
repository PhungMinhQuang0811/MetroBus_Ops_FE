import { NextRequest } from "next/server"

import { handleOpsBffRequest } from "@/lib/api/bff/ops/handler"

interface AuditBffRouteContext {
  params: Promise<{ bffPath: string[] }>
}

async function handleAuditBffCatchAllRequest(request: NextRequest, context: AuditBffRouteContext) {
  const { bffPath } = await context.params

  return handleOpsBffRequest(request, `/audit/${bffPath.join("/")}`)
}

export {
  handleAuditBffCatchAllRequest as DELETE,
  handleAuditBffCatchAllRequest as GET,
  handleAuditBffCatchAllRequest as PATCH,
  handleAuditBffCatchAllRequest as POST,
  handleAuditBffCatchAllRequest as PUT,
}
