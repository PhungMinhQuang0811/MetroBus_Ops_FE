import { NextRequest, NextResponse } from "next/server"

import { AUTH_COOKIE_KEYS, PUBLIC_PATHS } from "@/lib/auth/constants"
import { ROUTES } from "@/lib/routes"

function appendSetCookieHeaders(target: NextResponse, source: Response) {
  const setCookieHeaders = source.headers.getSetCookie?.() || []

  if (setCookieHeaders.length > 0) {
    setCookieHeaders.forEach((header) => target.headers.append("Set-Cookie", header))
    return
  }

  const setCookieHeader = source.headers.get("Set-Cookie")
  if (setCookieHeader) target.headers.append("Set-Cookie", setCookieHeader)
}

async function refreshAccessToken(request: NextRequest) {
  const response = await fetch(new URL("/bff/auth/refresh-token", request.url), {
    method: "POST",
    headers: {
      Cookie: request.headers.get("cookie") || "",
    },
  })

  if (!response.ok) return null

  const nextResponse = NextResponse.next()
  appendSetCookieHeaders(nextResponse, response)

  return nextResponse
}

export async function authRouteGuard(request: NextRequest) {
  if (request.nextUrl.pathname === PUBLIC_PATHS.PASSENGER_LOGIN) {
    return NextResponse.next()
  }

  const hasAccessToken = request.cookies.has(AUTH_COOKIE_KEYS.ACCESS_TOKEN)
  const hasRefreshToken = request.cookies.has(AUTH_COOKIE_KEYS.REFRESH_TOKEN)

  if (!hasAccessToken && hasRefreshToken) {
    const refreshedResponse = await refreshAccessToken(request)
    if (refreshedResponse) return refreshedResponse
  }

  if (!hasAccessToken) {
    return NextResponse.redirect(new URL(ROUTES.unauthorized, request.url))
  }

  return NextResponse.next()
}
