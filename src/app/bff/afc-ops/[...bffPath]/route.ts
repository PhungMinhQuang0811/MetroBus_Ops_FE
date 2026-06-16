import { NextRequest } from "next/server"

import { handleOpsBffRequest } from "@/lib/api/bff/ops/handler"

interface AfcOpsBffRouteContext {
  params: Promise<{ bffPath: string[] }>
}

async function handleAfcOpsBffCatchAllRequest(request: NextRequest, context: AfcOpsBffRouteContext) {
  const { bffPath } = await context.params

  return handleOpsBffRequest(request, `/afc-ops/${bffPath.join("/")}`)
}

export {
  handleAfcOpsBffCatchAllRequest as DELETE,
  handleAfcOpsBffCatchAllRequest as GET,
  handleAfcOpsBffCatchAllRequest as PATCH,
  handleAfcOpsBffCatchAllRequest as POST,
  handleAfcOpsBffCatchAllRequest as PUT,
}
