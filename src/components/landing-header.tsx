"use client"

import Link from "next/link"
import { Bus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ROUTES } from "@/lib/routes"

export function LandingHeader() {
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

        <div className="flex items-center gap-3">
          <Link href={ROUTES.login}>
            <Button variant="ghost" size="sm">Đăng nhập</Button>
          </Link>
          <Link href={ROUTES.download}>
            <Button size="sm">Tải ứng dụng</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
