import { NextRequest, NextResponse } from "next/server"

import { AUTH_COOKIE_KEYS, PUBLIC_PATHS } from "@/lib/auth/constants"
import { ROUTES } from "@/lib/routes"

export function authRouteGuard(request: NextRequest) {
  if (request.nextUrl.pathname === PUBLIC_PATHS.PASSENGER_LOGIN) {
    return NextResponse.next()
  }

  if (!request.cookies.has(AUTH_COOKIE_KEYS.ACCESS_TOKEN)) {
    return NextResponse.redirect(new URL(ROUTES.unauthorized, request.url))
  }

  return NextResponse.next()
}
