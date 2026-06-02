import { NextRequest, NextResponse } from "next/server"

import { AUTH_COOKIE_KEYS } from "@/lib/auth/constants"

export function GET(request: NextRequest) {
  return NextResponse.json({
    authenticated: request.cookies.has(AUTH_COOKIE_KEYS.ACCESS_TOKEN),
  })
}
