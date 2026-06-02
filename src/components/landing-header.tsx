"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Bus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ROUTES } from "@/lib/routes"

export function LandingHeader() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    fetch("/gateways/auth/status", {
      credentials: "include",
      signal: controller.signal,
    })
      .then((response) => response.json())
      .then((data: { authenticated: boolean }) => setIsAuthenticated(data.authenticated))
      .catch(() => setIsAuthenticated(false))

    return () => controller.abort()
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={ROUTES.home} className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Bus className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">MetroBus</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href={ROUTES.homeFeatures} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Tính năng
          </Link>
          <Link href={ROUTES.homeSolutions} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Giải pháp
          </Link>
          <Link href={ROUTES.guest.physicalCardOrder} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Đặt thẻ
          </Link>
        </nav>

        <div className="flex min-h-8 min-w-48 items-center justify-end gap-3">
          {isAuthenticated === true && (
            <Button asChild size="sm">
              <Link href={ROUTES.passenger.home}>
                Vào ứng dụng
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}

          {isAuthenticated === false && (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href={ROUTES.login}>Đăng nhập</Link>
              </Button>
              <Button asChild size="sm">
                <Link href={ROUTES.download}>Tải ứng dụng</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
