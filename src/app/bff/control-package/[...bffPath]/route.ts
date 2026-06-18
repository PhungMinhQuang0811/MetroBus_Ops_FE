import { NextRequest } from "next/server"

import { handleOpsBffRequest } from "@/lib/api/bff/ops/handler"

interface ControlPackageBffRouteContext {
  params: Promise<{ bffPath: string[] }>
}

async function handleControlPackageBffCatchAllRequest(request: NextRequest, context: ControlPackageBffRouteContext) {
  const { bffPath } = await context.params

  return handleOpsBffRequest(request, `/control-package/${bffPath.join("/")}`)
}

export {
  handleControlPackageBffCatchAllRequest as DELETE,
  handleControlPackageBffCatchAllRequest as GET,
  handleControlPackageBffCatchAllRequest as PATCH,
  handleControlPackageBffCatchAllRequest as POST,
  handleControlPackageBffCatchAllRequest as PUT,
}
