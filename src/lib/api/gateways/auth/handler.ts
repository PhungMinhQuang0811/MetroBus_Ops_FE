import { NextRequest, NextResponse } from "next/server"

import { AUTH_COOKIE_KEYS, AUTH_HEADER_KEYS } from "@/lib/auth/constants"

const AUTH_API_BASE_URL = process.env.NEXT_PUBLIC_AUTH_API_BASE_URL || "http://localhost:8081/vdt"
const REFRESH_TOKEN_ALLOWED_PATHS = new Set(["auth/refresh-token", "auth/logout"])

function createBackendUrl(path: string, search: string) {
  const url = new URL(path.replace(/^\//, ""), `${AUTH_API_BASE_URL.replace(/\/$/, "")}/`)
  url.search = search

  return url
}

function splitSetCookieHeader(header: string) {
  return header.split(/,(?=\s*[^;,=\s]+=[^;,]+)/g).map((value) => value.trim())
}

function rewriteSetCookieHeader(header: string) {
  const parts = header.split(";").map((part) => part.trim()).filter(Boolean)
  const [cookiePair, ...attributes] = parts
  const rewrittenAttributes: string[] = []
  let hasSameSite = false

  attributes.forEach((attribute) => {
    const [rawName] = attribute.split("=")
    const name = rawName.toLowerCase()

    // Backend scopes cookies to /vdt. After this FE gateway, cookies are stored
    // on localhost:3000 and must cover app routes such as /app-passenger.
    if (name === "path") return
    if (name === "samesite") hasSameSite = true

    rewrittenAttributes.push(attribute)
  })

  rewrittenAttributes.push("Path=/")
  if (!hasSameSite) rewrittenAttributes.push("SameSite=Lax")

  return [cookiePair, ...rewrittenAttributes].join("; ")
}

function getCookieName(header: string) {
  return header.split("=", 1)[0]?.trim()
}

function canAcceptCookie(path: string, header: string) {
  const cookieName = getCookieName(header)

  if (cookieName === AUTH_COOKIE_KEYS.XSRF_TOKEN) return true
  if (cookieName === AUTH_COOKIE_KEYS.REFRESH_TOKEN) return REFRESH_TOKEN_ALLOWED_PATHS.has(path)

  return true
}

function appendSetCookieHeaders(target: NextResponse, source: Response, path: string) {
  const setCookieHeaders = source.headers.getSetCookie?.() || []

  if (setCookieHeaders.length > 0) {
    setCookieHeaders.forEach((header) => {
      if (canAcceptCookie(path, header)) {
        target.headers.append("Set-Cookie", rewriteSetCookieHeader(header))
      }
    })
    return
  }

  const setCookieHeader = source.headers.get("Set-Cookie")
  if (setCookieHeader) {
    splitSetCookieHeader(setCookieHeader).forEach((header) => {
      if (canAcceptCookie(path, header)) {
        target.headers.append("Set-Cookie", rewriteSetCookieHeader(header))
      }
    })
  }
}

function createBackendHeaders(request: NextRequest, path: string) {
  const headers = new Headers()
  const contentType = request.headers.get("content-type")
  const xsrfToken = request.cookies.get(AUTH_COOKIE_KEYS.XSRF_TOKEN)?.value

  if (contentType) headers.set("Content-Type", contentType)

  if (xsrfToken) {
    headers.set(AUTH_HEADER_KEYS.XSRF_TOKEN, xsrfToken)
    headers.set("Cookie", `${AUTH_COOKIE_KEYS.XSRF_TOKEN}=${xsrfToken}`)
  }

  if (REFRESH_TOKEN_ALLOWED_PATHS.has(path)) {
    headers.set("Cookie", request.headers.get("cookie") || "")
  }

  return headers
}

export async function handleAuthGatewayRequest(request: NextRequest, path: string) {
  const body = request.method === "GET" || request.method === "HEAD" ? undefined : await request.text()
  const backendResponse = await fetch(createBackendUrl(path, request.nextUrl.search), {
    method: request.method,
    headers: createBackendHeaders(request, path),
    body,
    cache: "no-store",
  })
  const responseBody = await backendResponse.text()
  const response = new NextResponse(responseBody, {
    status: backendResponse.status,
    headers: {
      "Content-Type": backendResponse.headers.get("content-type") || "application/json",
    },
  })

  appendSetCookieHeaders(response, backendResponse, path)

  return response
}

export interface AuthGatewayRouteContext {
  params: Promise<{ gatewayPath: string[] }>
}

export async function handleAuthGatewayCatchAllRequest(request: NextRequest, context: AuthGatewayRouteContext) {
  const { gatewayPath } = await context.params

  return handleAuthGatewayRequest(request, `/auth/${gatewayPath.join("/")}`)
}
