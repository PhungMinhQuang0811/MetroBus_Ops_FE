export { authRouteGuard as proxy } from "@/lib/next/auth-route-guard"

export const config = {
  matcher: [
    "/app-passenger/:path*",
    "/staff/:path*",
    "/company/:path*",
    "/platform/:path*",
    "/admin/:path*",
    "/validator/:path*",
  ],
}
