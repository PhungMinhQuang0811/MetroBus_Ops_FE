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
import { ROUTES } from "@/lib/routes"
import { cn } from "@/lib/utils"

interface NavItem {
  href: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
}

interface PortalLayoutProps {
  children: React.ReactNode
  navItems: NavItem[]
  portalName: string
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
  userName = "user",
  userRole: _userRole,
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
      window.location.assign(ROUTES.login)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-6">
            <Link href={ROUTES.operator.home} className="flex shrink-0 items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <TrainFront className="h-5 w-5" />
              </div>
              <span className="text-sm font-semibold text-foreground">{portalName}</span>
            </Link>

            <nav className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => {
                const isActive = item.href === ROUTES.operator.home
                  ? pathname === item.href
                  : pathname === item.href || pathname.startsWith(`${item.href}/`)

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
