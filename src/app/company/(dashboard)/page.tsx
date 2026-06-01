"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  CreditCard,
  TrendingUp,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Plus
} from "lucide-react"
import Link from "next/link"
import { ROUTES } from "@/lib/routes"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Mock data
const stats = {
  totalEmployees: 156,
  activeCards: 148,
  monthlySpending: 45600000,
  pendingTopups: 3,
}

const recentTransactions = [
  { id: "TX001", employee: "Nguyen Van A", amount: 50000, type: "trip", date: "2024-03-15 08:30", route: "Tuyến 01" },
  { id: "TX002", employee: "Tran Thi B", amount: 50000, type: "trip", date: "2024-03-15 08:25", route: "Tuyến 05" },
  { id: "TX003", employee: "Le Van C", amount: 200000, type: "topup", date: "2024-03-15 08:00", route: "-" },
  { id: "TX004", employee: "Pham Thi D", amount: 50000, type: "trip", date: "2024-03-14 18:15", route: "Tuyến 03" },
  { id: "TX005", employee: "Hoang Van E", amount: 50000, type: "trip", date: "2024-03-14 17:45", route: "Tuyến 02" },
]

const topEmployees = [
  { name: "Nguyen Van A", department: "Kinh doanh", trips: 45, spending: 2250000 },
  { name: "Tran Thi B", department: "Marketing", trips: 38, spending: 1900000 },
  { name: "Le Van C", department: "IT", trips: 32, spending: 1600000 },
]

export default function CompanyDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Tổng quan hoạt động của Công ty ABC</p>
        </div>
        <div className="flex gap-2">
          <Link href={ROUTES.company.employeesAdd}>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Thêm nhân viên
            </Button>
          </Link>
          <Link href={ROUTES.company.cardsTopup}>
            <Button className="bg-primary text-primary-foreground">
              <Wallet className="mr-2 h-4 w-4" />
              Nạp tiền hàng loạt
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng nhân viên
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEmployees}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+5</span> nhân viên mới tháng này
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Thẻ đang hoạt động
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCards}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalEmployees - stats.activeCards} thẻ chưa kích hoạt
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Chi tiêu tháng này
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.monthlySpending.toLocaleString("vi-VN")}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3 text-green-600" />
              <span className="text-green-600">+12%</span> so với tháng trước
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Yêu cầu nạp tiền
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingTopups}</div>
            <p className="text-xs text-muted-foreground">
              Chờ duyệt từ kế toán
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Transactions */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Giao dịch gần đây</CardTitle>
            <Link href={ROUTES.company.transactions}>
              <Button variant="ghost" size="sm">
                Xem tất cả
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nhân viên</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead className="text-right">Số tiền</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.slice(0, 5).map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{tx.employee}</p>
                        <p className="text-xs text-muted-foreground">{tx.date}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {tx.type === "trip" ? (
                        <Badge variant="outline">{tx.route}</Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-800">Nạp tiền</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={tx.type === "topup" ? "text-green-600" : ""}>
                        {tx.type === "topup" ? "+" : "-"}
                        {tx.amount.toLocaleString("vi-VN")}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top Employees */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Nhân viên sử dụng nhiều nhất</CardTitle>
            <Link href={ROUTES.company.reports}>
              <Button variant="ghost" size="sm">
                Báo cáo chi tiết
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topEmployees.map((emp, index) => (
                <div key={emp.name} className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{emp.name}</p>
                    <p className="text-sm text-muted-foreground">{emp.department}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{emp.trips} chuyến</p>
                    <p className="text-sm text-muted-foreground">
                      {emp.spending.toLocaleString("vi-VN")} VND
                    </p>
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link href={ROUTES.company.employees}>
              <Button variant="outline" className="h-auto w-full flex-col gap-2 p-4">
                <Users className="h-6 w-6 text-primary" />
                <span>Quản lý nhân viên</span>
              </Button>
            </Link>
            <Link href={ROUTES.company.cards}>
              <Button variant="outline" className="h-auto w-full flex-col gap-2 p-4">
                <CreditCard className="h-6 w-6 text-primary" />
                <span>Quản lý thẻ</span>
              </Button>
            </Link>
            <Link href={ROUTES.company.billing}>
              <Button variant="outline" className="h-auto w-full flex-col gap-2 p-4">
                <Wallet className="h-6 w-6 text-primary" />
                <span>Thanh toán</span>
              </Button>
            </Link>
            <Link href={ROUTES.company.reports}>
              <Button variant="outline" className="h-auto w-full flex-col gap-2 p-4">
                <TrendingUp className="h-6 w-6 text-primary" />
                <span>Xem báo cáo</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
