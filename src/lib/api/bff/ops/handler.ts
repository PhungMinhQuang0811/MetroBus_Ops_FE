import { NextRequest, NextResponse } from "next/server"

import { AUTH_COOKIE_KEYS, AUTH_HEADER_KEYS } from "@/lib/auth/constants"

const OPS_API_BASE_URL = process.env.NEXT_PUBLIC_TICKET_API_BASE_URL || "http://localhost:8082/vdt"

function normalizePath(path: string) {
  return path.replace(/^\//, "")
}

function createBackendUrl(path: string, search: string) {
  const url = new URL(normalizePath(path), `${OPS_API_BASE_URL.replace(/\/$/, "")}/`)
  url.search = search

  return url
}

function createBackendHeaders(request: NextRequest) {
  const headers = new Headers()
  const contentType = request.headers.get("content-type")
  const accessToken = request.cookies.get(AUTH_COOKIE_KEYS.ACCESS_TOKEN)?.value
  const xsrfToken = request.cookies.get(AUTH_COOKIE_KEYS.XSRF_TOKEN)?.value
  const backendCookies: string[] = []

  if (contentType) headers.set("Content-Type", contentType)
  if (accessToken) backendCookies.push(`${AUTH_COOKIE_KEYS.ACCESS_TOKEN}=${accessToken}`)
  if (xsrfToken) backendCookies.push(`${AUTH_COOKIE_KEYS.XSRF_TOKEN}=${xsrfToken}`)
  if (backendCookies.length > 0) headers.set("Cookie", backendCookies.join("; "))
  if (xsrfToken) headers.set(AUTH_HEADER_KEYS.XSRF_TOKEN, xsrfToken)

  return headers
}

async function createBackendBody(request: NextRequest) {
  if (request.method === "GET" || request.method === "HEAD") return undefined

  const contentType = request.headers.get("content-type") || ""
  if (contentType.includes("multipart/form-data")) return await request.arrayBuffer()

  return await request.text()
}

export async function handleOpsBffRequest(request: NextRequest, path: string) {
  const body = await createBackendBody(request)
  const backendResponse = await fetch(createBackendUrl(path, request.nextUrl.search), {
    method: request.method,
    headers: createBackendHeaders(request),
    body,
    cache: "no-store",
  })
  const responseBody = await backendResponse.text()

  return new NextResponse(responseBody, {
    status: backendResponse.status,
    headers: {
      "Content-Type": backendResponse.headers.get("content-type") || "application/json",
    },
  })
}
