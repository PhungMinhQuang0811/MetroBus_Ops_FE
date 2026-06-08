import type { ApiResponse } from "./dto/common"
import { API_ENDPOINTS } from "./endpoints"

export const API_BASE_URLS = {
  auth: "/bff",
  ticket: process.env.NEXT_PUBLIC_TICKET_API_BASE_URL || "http://localhost:8080/vdt",
} as const

export type ApiService = keyof typeof API_BASE_URLS

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown
  query?: object
  service?: ApiService
  skipAuthRefresh?: boolean
}

function appendQuery(url: string, query?: object) {
  if (!query) return url

  const searchParams = new URLSearchParams()

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null) searchParams.set(key, String(value))
  })

  const queryString = searchParams.toString()
  if (!queryString) return url

  return `${url}${url.includes("?") ? "&" : "?"}${queryString}`
}

function createUrl(path: string, query?: object, service: ApiService = "ticket") {
  const apiBaseUrl = API_BASE_URLS[service]
  const normalizedPath = path.replace(/^\//, "")

  if (apiBaseUrl.startsWith("/")) {
    return appendQuery(`${apiBaseUrl.replace(/\/$/, "")}/${normalizedPath}`, query)
  }

  const url = new URL(normalizedPath, `${apiBaseUrl.replace(/\/$/, "")}/`)
  return appendQuery(url.toString(), query)
}

function isFormDataBody(body: unknown): body is FormData {
  return typeof FormData !== "undefined" && body instanceof FormData
}

function createInit({ body, query: _query, service: _service, skipAuthRefresh: _skipAuthRefresh, headers, ...init }: RequestOptions): RequestInit {
  const isFormData = isFormDataBody(body)

  return {
    credentials: "include",
    ...init,
    headers: {
      ...(body === undefined || isFormData ? {} : { "Content-Type": "application/json" }),
      ...headers,
    },
    body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
  }
}

export class ApiError<T = unknown> extends Error {
  constructor(
    public readonly status: number,
    public readonly response: ApiResponse<T>,
  ) {
    super(response.message)
    this.name = "ApiError"
  }
}

async function parseApiResponse<T>(response: Response) {
  const contentType = response.headers.get("content-type") || ""

  if (contentType.includes("application/json")) {
    return (await response.json()) as ApiResponse<T>
  }

  const message = (await response.text()) || response.statusText || "Request failed"

  return {
    code: response.status,
    message,
    result: null as T,
  }
}

function redirectTo(path: string) {
  if (typeof window !== "undefined") window.location.href = path
}

function shouldRedirectForbidden(payload: ApiResponse<unknown>) {
  return payload.code !== 4010 && payload.code !== 4011
}

let refreshTokenPromise: Promise<boolean> | null = null

async function refreshAccessToken() {
  if (!refreshTokenPromise) {
    refreshTokenPromise = fetch(createUrl(API_ENDPOINTS.auth.refreshToken, undefined, "auth"), {
      method: "POST",
      credentials: "include",
    })
      .then((response) => response.ok)
      .catch(() => false)
      .finally(() => {
        refreshTokenPromise = null
      })
  }

  return refreshTokenPromise
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}) {
  const response = await fetch(createUrl(path, options.query, options.service), createInit(options))
  const payload = await parseApiResponse<T>(response)

  if (response.status === 401 && !options.skipAuthRefresh) {
    const refreshed = await refreshAccessToken()

    if (refreshed) {
      return apiRequest<T>(path, { ...options, skipAuthRefresh: true })
    }

    redirectTo("/401")
  }

  if (response.status === 401) redirectTo("/401")
  if (response.status === 403 && shouldRedirectForbidden(payload)) redirectTo("/403")

  if (!response.ok) throw new ApiError(response.status, payload)

  return payload
}

export async function apiRequestRaw(path: string, options: RequestOptions = {}) {
  const response = await fetch(createUrl(path, options.query, options.service), createInit(options))
  let payload: ApiResponse<unknown> | null = null

  const getPayload = async () => {
    payload ??= await parseApiResponse<unknown>(response.clone())

    return payload
  }

  if (response.status === 401 && !options.skipAuthRefresh) {
    const refreshed = await refreshAccessToken()

    if (refreshed) {
      return apiRequestRaw(path, { ...options, skipAuthRefresh: true })
    }

    redirectTo("/401")
  }

  if (response.status === 401) redirectTo("/401")
  if (response.status === 403 && shouldRedirectForbidden(await getPayload())) redirectTo("/403")

  if (!response.ok) {
    throw new ApiError(response.status, await getPayload())
  }

  return response
}
