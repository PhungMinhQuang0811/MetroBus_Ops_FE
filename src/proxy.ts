export { authRouteGuard as proxy } from "@/lib/next/auth-route-guard"

export const config = {
  matcher: [
    "/operator/:path*",
    "/station/:path*",
  ],
}
