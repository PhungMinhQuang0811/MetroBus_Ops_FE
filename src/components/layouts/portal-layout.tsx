"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, LogOut, Settings, TrainFront } from "lucide-react"
import { useState } from "react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { identityApi } from "@/lib/api/services/identity"
import { clearStoredPasswordStatus } from "@/lib/auth/password-status"
import { clearStoredAuthSession } from "@/lib/auth/session"
import type { PortalNavItem } from "@/lib/navigation/portal-nav"
import { ROUTES } from "@/lib/routes"
import { cn } from "@/lib/utils"

interface PortalLayoutProps {
  children: React.ReactNode
  navItems: PortalNavItem[]
  portalName: string
  homeHref?: string
  userName?: string
  userRole?: string
  tenantName?: string
  shiftStatus?: "active" | "inactive"
  shiftStation?: string
}

export function PortalLayout({
  children,
  navItems,
  portalName,
  homeHref = ROUTES.admin.home,
  userName = "user",
  userRole,
  tenantName: _tenantName,
  shiftStatus: _shiftStatus,
  shiftStation: _shiftStation,
}: PortalLayoutProps) {
  const pathname = usePathname()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (isLoggingOut) return

    setIsLoggingOut(true)

    try {
      await identityApi.logout()
    } finally {
      clearStoredPasswordStatus()
      clearStoredAuthSession()
      window.location.assign(ROUTES.login)
    }
  }

  const isItemActive = (item: PortalNavItem) => {
    if (item.href === ROUTES.admin.home || item.href === ROUTES.manager.home || item.href === ROUTES.station.home || item.href === ROUTES.operator.home) {
      return pathname === item.href
    }

    return pathname === item.href || pathname.startsWith(`${item.href}/`) || item.children?.some(isItemActive)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-6">
            <Link href={homeHref} className="flex shrink-0 items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <TrainFront className="h-5 w-5" />
              </div>
              <span className="text-sm font-semibold text-foreground">{portalName}</span>
            </Link>

            <nav className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => {
                const isActive = isItemActive(item)

                if (item.children?.length) {
                  return (
                    <DropdownMenu key={item.href}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          className={cn(
                            "h-9 gap-1 rounded-md px-3 text-sm font-medium",
                            isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                          )}
                        >
                          {item.label}
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-52">
                        {item.children.map((child) => (
                          <DropdownMenuItem key={child.href} asChild>
                            <Link href={child.href}>{child.label}</Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 px-2">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                    {userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>{userName}</DropdownMenuLabel>
              {userRole && (
                <DropdownMenuLabel className="pt-0 text-xs font-normal text-muted-foreground">
                  {userRole}
                </DropdownMenuLabel>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={ROUTES.changePassword}>
                  <Settings className="mr-2 h-4 w-4" />
                  Đổi mật khẩu
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                disabled={isLoggingOut}
                onSelect={(event) => {
                  event.preventDefault()
                  void handleLogout()
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                {isLoggingOut ? "Đang đăng xuất..." : "Logout"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
