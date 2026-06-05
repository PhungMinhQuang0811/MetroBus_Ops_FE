"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  Users,
  Bus,
  BarChart3,
  PieChart
} from "lucide-react"

// Mock data
const monthlyStats = {
  totalTrips: 1250,
  totalSpending: 62500000,
  avgTripsPerEmployee: 8.5,
  topRoute: "Tuyến 01 - Bến Thành - Chợ Lớn",
  comparedToLastMonth: {
    trips: 12,
    spending: 8
  }
}

const departmentStats = [
  { name: "Kinh doanh", employees: 45, trips: 380, spending: 19000000 },
  { name: "Marketing", employees: 28, trips: 245, spending: 12250000 },
  { name: "IT", employees: 35, trips: 280, spending: 14000000 },
  { name: "Kế toán", employees: 15, trips: 125, spending: 6250000 },
  { name: "Nhân sự", employees: 20, trips: 150, spending: 7500000 },
  { name: "Hành chính", employees: 13, trips: 70, spending: 3500000 },
]

const routeStats = [
  { route: "Tuyến 01", trips: 320, percentage: 25.6 },
  { route: "Tuyến 05", trips: 280, percentage: 22.4 },
  { route: "Tuyến 03", trips: 210, percentage: 16.8 },
  { route: "Tuyến 02", trips: 190, percentage: 15.2 },
  { route: "Khác", trips: 250, percentage: 20.0 },
]

export default function OperatorReportsPage() {
  const [period, setPeriod] = useState("month")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Báo cáo & Thống kê</h1>
          <p className="text-muted-foreground">Phân tích chi tiêu và sử dụng dịch vụ</p>
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40">
              <Calendar className="mr-2 h-4 w-4" />
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
            <Download className="mr-2 h-4 w-4" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tổng chuyến đi</p>
                <p className="text-2xl font-bold">{monthlyStats.totalTrips.toLocaleString()}</p>
                <p className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  +{monthlyStats.comparedToLastMonth.trips}% so với tháng trước
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Bus className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tổng chi tiêu</p>
                <p className="text-2xl font-bold">{(monthlyStats.totalSpending / 1000000).toFixed(1)}M</p>
                <p className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  +{monthlyStats.comparedToLastMonth.spending}% so với tháng trước
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">TB chuyến/nhân viên</p>
                <p className="text-2xl font-bold">{monthlyStats.avgTripsPerEmployee}</p>
                <p className="text-xs text-muted-foreground">chuyến/tháng</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tuyến phổ biến</p>
                <p className="text-lg font-bold">Tuyến 01</p>
                <p className="text-xs text-muted-foreground">25.6% tổng chuyến</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Department Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Thống kê theo phòng ban
            </CardTitle>
            <CardDescription>Chi tiêu và số chuyến đi theo từng phòng ban</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentStats.map((dept) => (
                <div key={dept.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{dept.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {dept.employees} nhân viên - {dept.trips} chuyến
                      </p>
                    </div>
                    <p className="font-semibold">{(dept.spending / 1000000).toFixed(1)}M</p>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${(dept.spending / monthlyStats.totalSpending) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Route Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Phân bố theo tuyến
            </CardTitle>
            <CardDescription>Các tuyến xe được sử dụng nhiều nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {routeStats.map((route, index) => {
                const colors = ["bg-primary", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-gray-400"]
                return (
                  <div key={route.route} className="flex items-center gap-4">
                    <div className={`h-4 w-4 rounded-full ${colors[index]}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{route.route}</p>
                        <p className="text-sm text-muted-foreground">{route.trips} chuyến</p>
                      </div>
                      <div className="mt-1 h-2 w-full rounded-full bg-muted">
                        <div
                          className={`h-2 rounded-full ${colors[index]}`}
                          style={{ width: `${route.percentage}%` }}
                        />
                      </div>
                    </div>
                    <Badge variant="outline">{route.percentage}%</Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Xu hướng theo thời gian</CardTitle>
          <CardDescription>Biểu đồ chi tiêu và số chuyến đi theo tháng</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-end justify-between gap-2">
            {["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"].map((month, index) => {
              const height = 30 + Math.random() * 70
              const isCurrentMonth = index === 2 // March
              return (
                <div key={month} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className={`w-full rounded-t ${isCurrentMonth ? "bg-primary" : "bg-muted"}`}
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-muted-foreground">{month}</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
