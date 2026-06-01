"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Building2, 
  ArrowUpRight,
  TrendingUp,
  FileSpreadsheet,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react"
import Link from "next/link"
import { ROUTES } from "@/lib/routes"

// Mock data
const stats = {
  totalTenants: 12,
  activeTenants: 10,
  pendingSettlement: "2,450,000,000",
  completedThisMonth: "18,750,000,000",
  pendingPeriods: 3,
  lastSettlementDate: "28/05/2026"
}

const recentSettlements = [
  {
    id: "STL-2026-05-001",
    tenant: "Xe buýt Sài Gòn",
    period: "01/05 - 15/05/2026",
    amount: "1,250,000,000",
    status: "completed",
    completedAt: "18/05/2026"
  },
  {
    id: "STL-2026-05-002",
    tenant: "TransBus Đà Nẵng",
    period: "01/05 - 15/05/2026",
    amount: "450,000,000",
    status: "completed",
    completedAt: "18/05/2026"
  },
  {
    id: "STL-2026-05-003",
    tenant: "Mai Linh Express",
    period: "16/05 - 31/05/2026",
    amount: "890,000,000",
    status: "pending",
    completedAt: null
  },
  {
    id: "STL-2026-05-004",
    tenant: "Vinbus",
    period: "16/05 - 31/05/2026",
    amount: "1,120,000,000",
    status: "processing",
    completedAt: null
  },
]

const tenantOverview = [
  { name: "Xe buýt Sài Gòn", revenue: "5,200,000,000", transactions: 125000, status: "active" },
  { name: "Vinbus", revenue: "3,800,000,000", transactions: 89000, status: "active" },
  { name: "TransBus Đà Nẵng", revenue: "1,200,000,000", transactions: 32000, status: "active" },
  { name: "Mai Linh Express", revenue: "980,000,000", transactions: 24500, status: "active" },
]

export default function PlatformDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard Nền tảng</h1>
        <p className="text-muted-foreground">Tổng quan quản lý Tenant và Đối soát tài chính liên thông</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng Tenants</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTenants}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-secondary">{stats.activeTenants} đang hoạt động</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Chờ đối soát</CardTitle>
            <Clock className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingSettlement}đ</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-accent">{stats.pendingPeriods} kỳ chờ xử lý</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đã đối soát tháng này</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedThisMonth}đ</div>
            <div className="flex items-center text-xs text-secondary">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +12.5% so với tháng trước
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đối soát gần nhất</CardTitle>
            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lastSettlementDate}</div>
            <p className="text-xs text-muted-foreground">Kỳ 01-15/05/2026</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Settlements */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Đối soát gần đây</CardTitle>
              <CardDescription>Các phiên đối soát với Tenants</CardDescription>
            </div>
            <Link href={ROUTES.platform.settlement}>
              <Button variant="outline" size="sm">Xem tất cả</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSettlements.map((settlement) => (
                <div key={settlement.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{settlement.tenant}</p>
                    <p className="text-xs text-muted-foreground">{settlement.period}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-semibold">{settlement.amount}đ</p>
                    <Badge 
                      variant={
                        settlement.status === "completed" ? "default" :
                        settlement.status === "processing" ? "secondary" : "outline"
                      }
                      className={
                        settlement.status === "completed" ? "bg-secondary text-secondary-foreground" :
                        settlement.status === "processing" ? "bg-primary text-primary-foreground" : ""
                      }
                    >
                      {settlement.status === "completed" ? "Hoàn thành" :
                       settlement.status === "processing" ? "Đang xử lý" : "Chờ đối soát"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tenant Overview */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Tổng quan Tenants</CardTitle>
              <CardDescription>Doanh thu tháng này theo đơn vị vận hành</CardDescription>
            </div>
            <Link href={ROUTES.platform.tenants}>
              <Button variant="outline" size="sm">Quản lý</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tenantOverview.map((tenant, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                      <Building2 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{tenant.name}</p>
                      <p className="text-xs text-muted-foreground">{tenant.transactions.toLocaleString()} giao dịch</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{tenant.revenue}đ</p>
                    <Badge variant="outline" className="text-secondary border-secondary">
                      Hoạt động
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Thao tác nhanh</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Link href={ROUTES.platform.settlement}>
              <Button>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Tạo phiên đối soát mới
              </Button>
            </Link>
            <Link href={ROUTES.platform.tenants}>
              <Button variant="outline">
                <Building2 className="h-4 w-4 mr-2" />
                Quản lý Tenants
              </Button>
            </Link>
            <Link href={ROUTES.platform.reports}>
              <Button variant="outline">
                <TrendingUp className="h-4 w-4 mr-2" />
                Báo cáo tài chính
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
