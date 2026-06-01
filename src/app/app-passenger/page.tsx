"use client"

import { PWALayout } from "@/components/layouts/pwa-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/status-badge"
import { 
  QrCode, 
  Plus, 
  RefreshCw, 
  CreditCard,
  ArrowRight,
  TrendingUp,
  Bus,
  MapPin,
  Calendar,
  AlertCircle
} from "lucide-react"
import Link from "next/link"
import { ROUTES } from "@/lib/routes"

// Mock data
const mockUser = {
  name: "Nguyễn Văn A",
  walletBalance: 150000,
  kycStatus: "VERIFIED" as const,
}

const mockCard = {
  uid: "VTC-2024-00001",
  type: "VIRTUAL",
  status: "ACTIVE" as const,
  subscription: {
    planName: "Vé tháng toàn tuyến",
    startDate: "01/01/2024",
    endDate: "31/01/2024",
    status: "ACTIVE" as const,
  }
}

const mockRecentJourneys = [
  {
    id: "1",
    route: "Tuyến 01",
    from: "Bến Thành",
    to: "Suối Tiên",
    date: "Hôm nay 08:30",
    fare: 7000,
    status: "COMPLETED"
  },
  {
    id: "2",
    route: "Tuyến 01",
    from: "Suối Tiên",
    to: "Bến Thành",
    date: "Hôm qua 17:45",
    fare: 7000,
    status: "COMPLETED"
  },
]

const mockRecentTransactions = [
  {
    id: "1",
    type: "TOP_UP",
    amount: 100000,
    date: "28/12/2024",
    status: "SUCCESS"
  },
  {
    id: "2",
    type: "SUBSCRIPTION",
    amount: -200000,
    date: "01/01/2024",
    status: "SUCCESS"
  },
]

export default function PassengerHomePage() {
  return (
    <PWALayout userName={mockUser.name} walletBalance={mockUser.walletBalance}>
      <div className="space-y-4 p-4">
        {/* KYC Warning Banner */}
        {mockUser.kycStatus !== "VERIFIED" && (
          <Card className="border-accent bg-accent/10">
            <CardContent className="flex items-center gap-3 p-4">
              <AlertCircle className="h-5 w-5 text-accent" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Hoàn tất hồ sơ</p>
                <p className="text-xs text-muted-foreground">
                  Xác thực thông tin để sử dụng đầy đủ tính năng
                </p>
              </div>
              <Link href={ROUTES.passenger.profile}>
                <Button size="sm" variant="outline">
                  Xác thực
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Active Card */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-primary to-primary-dark p-4 text-primary-foreground">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs opacity-80">Thẻ ảo</p>
                <p className="mt-1 font-mono text-sm">{mockCard.uid}</p>
              </div>
              <StatusBadge status={mockCard.status} />
            </div>
            
            <div className="mt-4 flex items-center gap-2">
              <Bus className="h-5 w-5" />
              <span className="font-medium">{mockCard.subscription.planName}</span>
            </div>
            
            <div className="mt-2 flex items-center gap-4 text-xs opacity-80">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {mockCard.subscription.startDate} - {mockCard.subscription.endDate}
              </span>
            </div>
          </div>
          
          <CardContent className="flex gap-2 p-3">
            <Link href={ROUTES.passenger.qr} className="flex-1">
              <Button className="w-full gap-2">
                <QrCode className="h-4 w-4" />
                Hiện QR
              </Button>
            </Link>
            <Link href={ROUTES.passenger.cardsRenew}>
              <Button variant="outline" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          <Link href={ROUTES.passenger.walletTopup}>
            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <CardContent className="flex flex-col items-center p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Plus className="h-5 w-5" />
                </div>
                <span className="mt-2 text-xs font-medium">Nạp tiền</span>
              </CardContent>
            </Card>
          </Link>
          
          <Link href={ROUTES.passenger.cardsNew}>
            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <CardContent className="flex flex-col items-center p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                  <CreditCard className="h-5 w-5" />
                </div>
                <span className="mt-2 text-xs font-medium">Mua vé</span>
              </CardContent>
            </Card>
          </Link>
          
          <Link href={ROUTES.passenger.cardsVirtualize}>
            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <CardContent className="flex flex-col items-center p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <span className="mt-2 text-xs font-medium">Ảo hóa thẻ</span>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Journeys */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Chuyến đi gần đây</CardTitle>
            <Link href={ROUTES.passenger.history} className="text-sm text-primary hover:underline">
              Xem tất cả
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockRecentJourneys.map((journey) => (
              <div 
                key={journey.id}
                className="flex items-center gap-3 rounded-lg border border-border p-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Bus className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{journey.route}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {journey.from}
                    <ArrowRight className="h-3 w-3" />
                    {journey.to}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-secondary">
                    {journey.fare.toLocaleString("vi-VN")}đ
                  </p>
                  <p className="text-xs text-muted-foreground">{journey.date}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Giao dịch gần đây</CardTitle>
            <Link href={ROUTES.passenger.historyTransactions} className="text-sm text-primary hover:underline">
              Xem tất cả
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockRecentTransactions.map((tx) => (
              <div 
                key={tx.id}
                className="flex items-center justify-between rounded-lg border border-border p-3"
              >
                <div>
                  <p className="text-sm font-medium">
                    {tx.type === "TOP_UP" ? "Nạp tiền" : "Mua vé tháng"}
                  </p>
                  <p className="text-xs text-muted-foreground">{tx.date}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${tx.amount > 0 ? "text-secondary" : "text-foreground"}`}>
                    {tx.amount > 0 ? "+" : ""}{tx.amount.toLocaleString("vi-VN")}đ
                  </p>
                  <StatusBadge status={tx.status} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PWALayout>
  )
}
