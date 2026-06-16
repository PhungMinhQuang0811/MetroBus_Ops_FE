import { NextRequest } from "next/server"

import { handleOpsBffRequest } from "@/lib/api/bff/ops/handler"

interface TransactionBffRouteContext {
  params: Promise<{ bffPath: string[] }>
}

async function handleTransactionBffCatchAllRequest(request: NextRequest, context: TransactionBffRouteContext) {
  const { bffPath } = await context.params

  return handleOpsBffRequest(request, `/transaction/${bffPath.join("/")}`)
}

export {
  handleTransactionBffCatchAllRequest as DELETE,
  handleTransactionBffCatchAllRequest as GET,
  handleTransactionBffCatchAllRequest as PATCH,
  handleTransactionBffCatchAllRequest as POST,
  handleTransactionBffCatchAllRequest as PUT,
}
