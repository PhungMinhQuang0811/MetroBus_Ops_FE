"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/status-badge"
import { 
  Clock, 
  AlertTriangle, 
  CreditCard, 
  Package,
  TrendingUp,
  Users
} from "lucide-react"
import Link from "next/link"
import { ROUTES } from "@/lib/routes"

// Mock data
const mockStats = {
  shiftStatus: "ACTIVE",
  shiftStartTime: "08:00",
  station: "Bến Thành",
  pscPending: 3,
  ordersToProcess: 5,
  cardsIssued: 12,
  todayPassengers: 156,
}

const mockRecentPSC = [
  { id: "1", cardUid: "VTC-2024-00001", type: "OVER_RIDING", time: "10:30" },
  { id: "2", cardUid: "PHY-2023-00542", type: "MISSING_CHECKOUT", time: "09:45" },
]

const mockRecentOrders = [
  { id: "ORD-001", customer: "Nguyễn Văn A", status: "PRINTING" },
  { id: "ORD-002", customer: "Trần Thị B", status: "READY_FOR_PICKUP" },
]

export default function StaffDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tổng quan</h1>
        <p className="text-muted-foreground">Xin chào, Nguyễn Văn B</p>
      </div>

      {/* Current Shift Info */}
      <Card className="border-primary">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Clock className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold">Ca làm việc hiện tại</p>
              <StatusBadge status={mockStats.shiftStatus} />
            </div>
            <p className="text-sm text-muted-foreground">
              Bắt đầu: {mockStats.shiftStartTime} | Trạm: {mockStats.station}
            </p>
          </div>
          <Link href={ROUTES.staff.shift}>
            <button className="text-sm text-primary hover:underline">
              Quản lý ca
            </button>
          </Link>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              PSC chờ xử lý
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{mockStats.pscPending}</p>
            <Link href={ROUTES.staff.psc} className="text-xs text-primary hover:underline">
              Xem danh sách
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Đơn hàng cần xử lý
            </CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{mockStats.ordersToProcess}</p>
            <Link href={ROUTES.staff.orders} className="text-xs text-primary hover:underline">
              Xem danh sách
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Thẻ đã phát hôm nay
            </CardTitle>
            <CreditCard className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{mockStats.cardsIssued}</p>
            <p className="text-xs text-muted-foreground">+3 so với hôm qua</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Hành khách hôm nay
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{mockStats.todayPassengers}</p>
            <div className="flex items-center gap-1 text-xs text-secondary">
              <TrendingUp className="h-3 w-3" />
              +12% so với hôm qua
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent PSC */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>PSC gần đây</CardTitle>
            <Link href={ROUTES.staff.psc} className="text-sm text-primary hover:underline">
              Xem tất cả
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockRecentPSC.map((psc) => (
              <div key={psc.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="font-mono text-sm font-medium">{psc.cardUid}</p>
                  <p className="text-xs text-muted-foreground">
                    {psc.type === "OVER_RIDING" ? "Vượt quá thời gian" : "Thiếu checkout"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm">{psc.time}</p>
                  <StatusBadge status="PENDING" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Đơn hàng gần đây</CardTitle>
            <Link href={ROUTES.staff.orders} className="text-sm text-primary hover:underline">
              Xem tất cả
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockRecentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="font-mono text-sm font-medium">{order.id}</p>
                  <p className="text-xs text-muted-foreground">{order.customer}</p>
                </div>
                <StatusBadge status={order.status} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
