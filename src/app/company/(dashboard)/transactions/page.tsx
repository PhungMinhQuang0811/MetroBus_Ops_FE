"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Search, 
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Bus
} from "lucide-react"

// Mock data
const mockTransactions = [
  {
    id: "TX001",
    employeeName: "Nguyen Van A",
    cardNumber: "9704 **** **** 1234",
    type: "trip",
    amount: 50000,
    route: "Tuyến 01 - Bến Thành - Chợ Lớn",
    timestamp: "2024-03-15 08:30:25",
    status: "completed"
  },
  {
    id: "TX002",
    employeeName: "Tran Thi B",
    cardNumber: "9704 **** **** 5678",
    type: "trip",
    amount: 50000,
    route: "Tuyến 05 - Quận 7 - Quận 1",
    timestamp: "2024-03-15 08:25:10",
    status: "completed"
  },
  {
    id: "TX003",
    employeeName: "Le Van C",
    cardNumber: "9704 **** **** 9012",
    type: "topup",
    amount: 200000,
    route: "-",
    timestamp: "2024-03-15 08:00:00",
    status: "completed"
  },
  {
    id: "TX004",
    employeeName: "Pham Thi D",
    cardNumber: "9704 **** **** 3456",
    type: "trip",
    amount: 50000,
    route: "Tuyến 03 - Bình Thạnh - Tân Bình",
    timestamp: "2024-03-14 18:15:30",
    status: "completed"
  },
  {
    id: "TX005",
    employeeName: "Nguyen Van A",
    cardNumber: "9704 **** **** 1234",
    type: "trip",
    amount: 50000,
    route: "Tuyến 01 - Chợ Lớn - Bến Thành",
    timestamp: "2024-03-14 17:45:00",
    status: "completed"
  },
]

export default function CompanyTransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [dateRange, setDateRange] = useState("today")

  const filteredTransactions = mockTransactions.filter(tx =>
    tx.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.cardNumber.includes(searchQuery) ||
    tx.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalTrips = mockTransactions.filter(tx => tx.type === "trip").length
  const totalTripAmount = mockTransactions
    .filter(tx => tx.type === "trip")
    .reduce((sum, tx) => sum + tx.amount, 0)
  const totalTopups = mockTransactions
    .filter(tx => tx.type === "topup")
    .reduce((sum, tx) => sum + tx.amount, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lịch sử giao dịch</h1>
          <p className="text-muted-foreground">Theo dõi tất cả giao dịch của nhân viên</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Xuất báo cáo
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tổng chuyến đi</p>
                <p className="text-2xl font-bold">{totalTrips}</p>
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
                <p className="text-sm text-muted-foreground">Chi tiêu di chuyển</p>
                <p className="text-2xl font-bold">{totalTripAmount.toLocaleString("vi-VN")}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <ArrowDownRight className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Đã nạp tiền</p>
                <p className="text-2xl font-bold">{totalTopups.toLocaleString("vi-VN")}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <ArrowUpRight className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên, số thẻ, mã giao dịch..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-full sm:w-40">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Thời gian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hôm nay</SelectItem>
                <SelectItem value="week">7 ngày qua</SelectItem>
                <SelectItem value="month">30 ngày qua</SelectItem>
                <SelectItem value="custom">Tùy chọn</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Loại giao dịch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="trip">Chuyến đi</SelectItem>
                <SelectItem value="topup">Nạp tiền</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle>Giao dịch ({filteredTransactions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã GD</TableHead>
                <TableHead>Nhân viên</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Chi tiết</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead className="text-right">Số tiền</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="font-mono text-sm">{tx.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{tx.employeeName}</p>
                      <p className="text-xs text-muted-foreground">{tx.cardNumber}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {tx.type === "trip" ? (
                      <Badge variant="outline">
                        <Bus className="mr-1 h-3 w-3" />
                        Chuyến đi
                      </Badge>
                    ) : (
                      <Badge className="bg-green-100 text-green-800">Nạp tiền</Badge>
                    )}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {tx.route !== "-" ? tx.route : "Nạp tiền vào thẻ"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {tx.timestamp}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={tx.type === "topup" ? "text-green-600" : "text-red-600"}>
                      {tx.type === "topup" ? "+" : "-"}
                      {tx.amount.toLocaleString("vi-VN")} VND
                    </span>
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
