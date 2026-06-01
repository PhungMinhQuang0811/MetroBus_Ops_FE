"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  Home, 
  CreditCard, 
  Wallet, 
  History, 
  User,
  Bell
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/lib/routes"

interface PWALayoutProps {
  children: React.ReactNode
  userName?: string
  walletBalance?: number
  showHeader?: boolean
}

const navItems = [
  { href: ROUTES.passenger.home, icon: Home, label: "Trang chủ" },
  { href: ROUTES.passenger.cards, icon: CreditCard, label: "Thẻ" },
  { href: ROUTES.passenger.wallet, icon: Wallet, label: "Ví" },
  { href: ROUTES.passenger.history, icon: History, label: "Lịch sử" },
  { href: ROUTES.passenger.profile, icon: User, label: "Hồ sơ" },
]

export function PWALayout({ 
  children, 
  userName = "Hành khách",
  walletBalance = 0,
  showHeader = true 
}: PWALayoutProps) {
  const pathname = usePathname()
  
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      {showHeader && (
        <header className="sticky top-0 z-50 border-b border-border bg-card px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Xin chào,</p>
              <p className="font-semibold text-foreground">{userName}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 px-3 py-1.5">
                <p className="text-xs text-muted-foreground">Số dư ví</p>
                <p className="font-semibold text-primary">
                  {walletBalance.toLocaleString("vi-VN")}đ
                </p>
              </div>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
                  3
                </span>
              </Button>
            </div>
          </div>
        </header>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-auto pb-20">
        {children}
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== ROUTES.passenger.home && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 text-xs transition-colors",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive && "stroke-[2.5]")} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
