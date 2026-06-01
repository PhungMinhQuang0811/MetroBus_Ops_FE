import type { ApiResponse } from "./dto/common"

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/vdt"

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown
  query?: object
}

function createUrl(path: string, query?: object) {
  const url = new URL(path.replace(/^\//, ""), `${apiBaseUrl.replace(/\/$/, "")}/`)

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) url.searchParams.set(key, String(value))
    })
  }

  return url
}

function createInit({ body, query: _query, headers, ...init }: RequestOptions): RequestInit {
  return {
    credentials: "include",
    ...init,
    headers: {
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
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

export async function apiRequest<T>(path: string, options: RequestOptions = {}) {
  const response = await fetch(createUrl(path, options.query), createInit(options))
  const payload = (await response.json()) as ApiResponse<T>

  if (!response.ok) throw new ApiError(response.status, payload)

  return payload
}

export async function apiRequestRaw(path: string, options: RequestOptions = {}) {
  const response = await fetch(createUrl(path, options.query), createInit(options))

  if (!response.ok) {
    const payload = (await response.json()) as ApiResponse<unknown>
    throw new ApiError(response.status, payload)
  }

  return response
}
