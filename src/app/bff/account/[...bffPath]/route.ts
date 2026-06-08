import { NextRequest } from "next/server"

import { handleAuthBffRequest } from "@/lib/api/bff/auth/handler"

interface AccountBffRouteContext {
  params: Promise<{ bffPath: string[] }>
}

async function handleAccountBffCatchAllRequest(request: NextRequest, context: AccountBffRouteContext) {
  const { bffPath } = await context.params

  return handleAuthBffRequest(request, `/account/${bffPath.join("/")}`)
}

export {
  handleAccountBffCatchAllRequest as DELETE,
  handleAccountBffCatchAllRequest as GET,
  handleAccountBffCatchAllRequest as PATCH,
  handleAccountBffCatchAllRequest as POST,
  handleAccountBffCatchAllRequest as PUT,
}
