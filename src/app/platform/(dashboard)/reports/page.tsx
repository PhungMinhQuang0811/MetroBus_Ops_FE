"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  Download,
  TrendingUp,
  TrendingDown,
  Building2,
  Calendar,
  FileSpreadsheet,
  ArrowUpRight,
  ArrowDownRight,
  Banknote
} from "lucide-react"

// Mock data
const monthlyStats = {
  totalRevenue: "11,830,000,000",
  platformFee: "591,500,000",
  netToTenants: "11,238,500,000",
  growthRate: 8.5,
  transactionCount: 298500,
  avgTicketPrice: 39600
}

const tenantRevenueBreakdown = [
  { tenant: "Xe buýt Sài Gòn", revenue: "5,200,000,000", percentage: 43.9, transactions: 125000, growth: 12.5 },
  { tenant: "Vinbus", revenue: "3,800,000,000", percentage: 32.1, transactions: 89000, growth: 8.2 },
  { tenant: "TransBus Đà Nẵng", revenue: "1,200,000,000", percentage: 10.1, transactions: 32000, growth: 15.3 },
  { tenant: "Mai Linh Express", revenue: "980,000,000", percentage: 8.3, transactions: 24500, growth: -2.1 },
  { tenant: "Phương Trang", revenue: "650,000,000", percentage: 5.5, transactions: 28000, growth: 22.8 },
]

const monthlyTrend = [
  { month: "01/2026", revenue: "9,200,000,000", fee: "460,000,000", transactions: 245000 },
  { month: "02/2026", revenue: "8,800,000,000", fee: "440,000,000", transactions: 235000 },
  { month: "03/2026", revenue: "10,100,000,000", fee: "505,000,000", transactions: 268000 },
  { month: "04/2026", revenue: "10,900,000,000", fee: "545,000,000", transactions: 285000 },
  { month: "05/2026", revenue: "11,830,000,000", fee: "591,500,000", transactions: 298500 },
]

const settlementHistory = [
  { id: "STL-2026-05-002", period: "01-15/05/2026", amount: "5,620,000,000", fee: "281,000,000", status: "completed" },
  { id: "STL-2026-05-001", period: "16-30/04/2026", amount: "5,450,000,000", fee: "272,500,000", status: "completed" },
  { id: "STL-2026-04-002", period: "01-15/04/2026", amount: "5,150,000,000", fee: "257,500,000", status: "completed" },
  { id: "STL-2026-04-001", period: "16-31/03/2026", amount: "4,980,000,000", fee: "249,000,000", status: "completed" },
]

export default function PlatformReportsPage() {
  const [periodFilter, setPeriodFilter] = useState("month")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Báo cáo tài chính</h1>
          <p className="text-muted-foreground">Tổng hợp doanh thu và đối soát liên thông</p>
        </div>
        <div className="flex gap-2">
          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Tuần này</SelectItem>
              <SelectItem value="month">Tháng này</SelectItem>
              <SelectItem value="quarter">Quý này</SelectItem>
              <SelectItem value="year">Năm nay</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng doanh thu</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyStats.totalRevenue}đ</div>
            <div className="flex items-center text-xs text-secondary mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +{monthlyStats.growthRate}% so với tháng trước
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Phí nền tảng</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{monthlyStats.platformFee}đ</div>
            <p className="text-xs text-muted-foreground">5% tổng doanh thu</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Thanh toán Tenants</CardTitle>
            <Building2 className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{monthlyStats.netToTenants}đ</div>
            <p className="text-xs text-muted-foreground">95% tổng doanh thu</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Giao dịch</CardTitle>
            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyStats.transactionCount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">TB {monthlyStats.avgTicketPrice.toLocaleString()}đ/vé</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue by Tenant */}
        <Card>
          <CardHeader>
            <CardTitle>Doanh thu theo Tenant</CardTitle>
            <CardDescription>Phân bổ doanh thu tháng này</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tenantRevenueBreakdown.map((tenant, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{tenant.tenant}</span>
                      <Badge variant="outline" className="text-xs">
                        {tenant.percentage}%
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{tenant.revenue}đ</span>
                      {tenant.growth > 0 ? (
                        <span className="flex items-center text-xs text-secondary">
                          <ArrowUpRight className="h-3 w-3" />
                          {tenant.growth}%
                        </span>
                      ) : (
                        <span className="flex items-center text-xs text-destructive">
                          <ArrowDownRight className="h-3 w-3" />
                          {Math.abs(tenant.growth)}%
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${tenant.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Xu hướng theo tháng</CardTitle>
            <CardDescription>Doanh thu và phí nền tảng 5 tháng gần nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tháng</TableHead>
                  <TableHead>Doanh thu</TableHead>
                  <TableHead>Phí NTT</TableHead>
                  <TableHead>Giao dịch</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthlyTrend.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{row.month}</TableCell>
                    <TableCell>{row.revenue}đ</TableCell>
                    <TableCell className="text-primary">{row.fee}đ</TableCell>
                    <TableCell>{row.transactions.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Settlement History */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Lịch sử đối soát</CardTitle>
            <CardDescription>Các kỳ đối soát đã hoàn thành</CardDescription>
          </div>
          <Button variant="outline" size="sm">Xem tất cả</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đối soát</TableHead>
                <TableHead>Kỳ</TableHead>
                <TableHead>Tổng doanh thu</TableHead>
                <TableHead>Phí nền tảng</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {settlementHistory.map((settlement) => (
                <TableRow key={settlement.id}>
                  <TableCell className="font-mono text-sm">{settlement.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {settlement.period}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{settlement.amount}đ</TableCell>
                  <TableCell className="text-primary">{settlement.fee}đ</TableCell>
                  <TableCell>
                    <Badge className="bg-secondary text-secondary-foreground">Hoàn thành</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
