export { authRouteGuard as proxy } from "@/lib/next/auth-route-guard"

export const config = {
  matcher: [
    "/admin/:path*",
    "/manager/:path*",
    "/operator/:path*",
    "/station/:path*",
  ],
}
