"use client"

import { useState } from "react"
import { 
  FileText, 
  Download, 
  Calendar,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Filter
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/status-badge"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

// Mock data
const mockShiftReports = [
  {
    id: "SR001",
    shiftId: "SH-20240115-001",
    staffName: "Nguyễn Văn A",
    staffCode: "NV001",
    station: "Bến Thành",
    date: "15/01/2024",
    startTime: "06:00",
    endTime: "14:00",
    status: "COMPLETED",
    openingCash: 500000,
    closingCash: 1850000,
    expectedCash: 1850000,
    discrepancy: 0,
    fareAdjustments: 12,
    fareAdjustmentAmount: 156000,
    penalties: 3,
    penaltyAmount: 150000,
    freeUnlocks: 2,
    totalTransactions: 17,
    notes: "",
  },
  {
    id: "SR002",
    shiftId: "SH-20240115-002",
    staffName: "Trần Thị B",
    staffCode: "NV002",
    station: "Suối Tiên",
    date: "15/01/2024",
    startTime: "14:00",
    endTime: "22:00",
    status: "COMPLETED",
    openingCash: 500000,
    closingCash: 2100000,
    expectedCash: 2150000,
    discrepancy: -50000,
    fareAdjustments: 18,
    fareAdjustmentAmount: 234000,
    penalties: 5,
    penaltyAmount: 250000,
    freeUnlocks: 1,
    totalTransactions: 24,
    notes: "Thiếu 50,000đ - khách thanh toán thiếu 1 giao dịch",
  },
  {
    id: "SR003",
    shiftId: "SH-20240114-001",
    staffName: "Lê Văn C",
    staffCode: "NV003",
    station: "Bến xe Miền Đông",
    date: "14/01/2024",
    startTime: "06:00",
    endTime: "14:00",
    status: "COMPLETED",
    openingCash: 500000,
    closingCash: 1650000,
    expectedCash: 1650000,
    discrepancy: 0,
    fareAdjustments: 8,
    fareAdjustmentAmount: 104000,
    penalties: 2,
    penaltyAmount: 100000,
    freeUnlocks: 4,
    totalTransactions: 14,
    notes: "",
  },
  {
    id: "SR004",
    shiftId: "SH-20240114-002",
    staffName: "Phạm Thị D",
    staffCode: "NV004",
    station: "Chợ Lớn",
    date: "14/01/2024",
    startTime: "14:00",
    endTime: "22:00",
    status: "DISCREPANCY",
    openingCash: 500000,
    closingCash: 1750000,
    expectedCash: 1900000,
    discrepancy: -150000,
    fareAdjustments: 15,
    fareAdjustmentAmount: 195000,
    penalties: 4,
    penaltyAmount: 200000,
    freeUnlocks: 0,
    totalTransactions: 19,
    notes: "Cần kiểm tra lại - thiếu hụt lớn",
  },
]

const mockDailySummary = {
  totalShifts: 24,
  completedShifts: 22,
  discrepancyShifts: 2,
  totalCashCollected: 45600000,
  totalFareAdjustments: 2340000,
  totalPenalties: 1850000,
  totalFreeUnlocks: 45,
  totalTransactions: 312,
}

export default function StaffReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("today")
  const [selectedStation, setSelectedStation] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedReport, setSelectedReport] = useState<typeof mockShiftReports[0] | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }

  const handleViewDetail = (report: typeof mockShiftReports[0]) => {
    setSelectedReport(report)
    setIsDetailOpen(true)
  }

  const filteredReports = mockShiftReports.filter(report => {
    const matchesStation = selectedStation === "all" || report.station === selectedStation
    const matchesStatus = selectedStatus === "all" || report.status === selectedStatus
    return matchesStation && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Báo cáo Ca làm việc</h1>
          <p className="text-muted-foreground">Thống kê và báo cáo tổng hợp theo ca</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Xuất Excel
          </Button>
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            In báo cáo
          </Button>
        </div>
      </div>

      {/* Period Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Kỳ báo cáo:</span>
            </div>
            <div className="flex gap-2">
              <Button 
                variant={selectedPeriod === "today" ? "default" : "outline"} 
                size="sm"
                onClick={() => setSelectedPeriod("today")}
              >
                Hôm nay
              </Button>
              <Button 
                variant={selectedPeriod === "yesterday" ? "default" : "outline"} 
                size="sm"
                onClick={() => setSelectedPeriod("yesterday")}
              >
                Hôm qua
              </Button>
              <Button 
                variant={selectedPeriod === "week" ? "default" : "outline"} 
                size="sm"
                onClick={() => setSelectedPeriod("week")}
              >
                7 ngày
              </Button>
              <Button 
                variant={selectedPeriod === "month" ? "default" : "outline"} 
                size="sm"
                onClick={() => setSelectedPeriod("month")}
              >
                30 ngày
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng ca làm việc</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDailySummary.totalShifts}</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle className="h-3 w-3 text-secondary" />
              {mockDailySummary.completedShifts} hoàn thành
              {mockDailySummary.discrepancyShifts > 0 && (
                <>
                  <span className="mx-1">|</span>
                  <AlertTriangle className="h-3 w-3 text-destructive" />
                  {mockDailySummary.discrepancyShifts} lệch quỹ
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng thu tiền mặt</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">
              {formatCurrency(mockDailySummary.totalCashCollected)}
            </div>
            <p className="text-xs text-muted-foreground">
              Điều chỉnh: {formatCurrency(mockDailySummary.totalFareAdjustments)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Thu phạt</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {formatCurrency(mockDailySummary.totalPenalties)}
            </div>
            <p className="text-xs text-muted-foreground">
              {mockDailySummary.totalTransactions} giao dịch tổng
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Mở khóa miễn phí</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDailySummary.totalFreeUnlocks}</div>
            <p className="text-xs text-muted-foreground">
              trường hợp trong kỳ
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Lọc:</span>
            </div>
            <Select value={selectedStation} onValueChange={setSelectedStation}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Trạm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạm</SelectItem>
                <SelectItem value="Bến Thành">Bến Thành</SelectItem>
                <SelectItem value="Suối Tiên">Suối Tiên</SelectItem>
                <SelectItem value="Bến xe Miền Đông">Bến xe Miền Đông</SelectItem>
                <SelectItem value="Chợ Lớn">Chợ Lớn</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
                <SelectItem value="DISCREPANCY">Lệch quỹ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Chi tiết báo cáo ca</CardTitle>
          <CardDescription>Danh sách báo cáo theo từng ca làm việc</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã ca</TableHead>
                <TableHead>Nhân viên</TableHead>
                <TableHead>Trạm</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead>Giờ</TableHead>
                <TableHead className="text-right">Thu tiền mặt</TableHead>
                <TableHead className="text-right">Chênh lệch</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-mono text-sm">{report.shiftId}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{report.staffName}</p>
                      <p className="text-xs text-muted-foreground">{report.staffCode}</p>
                    </div>
                  </TableCell>
                  <TableCell>{report.station}</TableCell>
                  <TableCell>{report.date}</TableCell>
                  <TableCell>{report.startTime} - {report.endTime}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(report.closingCash - report.openingCash)}
                  </TableCell>
                  <TableCell className="text-right">
                    {report.discrepancy === 0 ? (
                      <span className="text-secondary">0</span>
                    ) : (
                      <span className="text-destructive font-medium">
                        {formatCurrency(report.discrepancy)}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {report.status === "COMPLETED" && report.discrepancy === 0 ? (
                      <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Hoàn thành
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="bg-destructive/10 text-destructive">
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        Lệch quỹ
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleViewDetail(report)}>
                      Chi tiết
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Sheet */}
      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Chi tiết báo cáo ca</SheetTitle>
          </SheetHeader>
          {selectedReport && (
            <div className="mt-6 space-y-6">
              {/* Shift Info */}
              <div className="rounded-lg border p-4">
                <h3 className="mb-3 font-semibold">Thông tin ca</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mã ca:</span>
                    <span className="font-mono">{selectedReport.shiftId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nhân viên:</span>
                    <span>{selectedReport.staffName} ({selectedReport.staffCode})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Trạm:</span>
                    <span>{selectedReport.station}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ngày:</span>
                    <span>{selectedReport.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Thời gian:</span>
                    <span>{selectedReport.startTime} - {selectedReport.endTime}</span>
                  </div>
                </div>
              </div>

              {/* Cash Summary */}
              <div className="rounded-lg border p-4">
                <h3 className="mb-3 font-semibold">Tổng kết tiền mặt</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tiền đầu ca:</span>
                    <span>{formatCurrency(selectedReport.openingCash)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tiền cuối ca:</span>
                    <span className="font-medium">{formatCurrency(selectedReport.closingCash)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tiền dự kiến:</span>
                    <span>{formatCurrency(selectedReport.expectedCash)}</span>
                  </div>
                  <div className="my-2 border-t" />
                  <div className="flex justify-between font-medium">
                    <span>Chênh lệch:</span>
                    <span className={selectedReport.discrepancy === 0 ? "text-secondary" : "text-destructive"}>
                      {formatCurrency(selectedReport.discrepancy)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Transaction Summary */}
              <div className="rounded-lg border p-4">
                <h3 className="mb-3 font-semibold">Chi tiết giao dịch</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Điều chỉnh cước:</span>
                    <span>{selectedReport.fareAdjustments} lượt - {formatCurrency(selectedReport.fareAdjustmentAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Thu phạt:</span>
                    <span>{selectedReport.penalties} lượt - {formatCurrency(selectedReport.penaltyAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mở khóa miễn phí:</span>
                    <span>{selectedReport.freeUnlocks} lượt</span>
                  </div>
                  <div className="my-2 border-t" />
                  <div className="flex justify-between font-medium">
                    <span>Tổng giao dịch:</span>
                    <span>{selectedReport.totalTransactions}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedReport.notes && (
                <div className="rounded-lg border border-accent bg-accent/10 p-4">
                  <h3 className="mb-2 font-semibold text-accent-foreground">Ghi chú</h3>
                  <p className="text-sm">{selectedReport.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Download className="mr-2 h-4 w-4" />
                  Tải báo cáo
                </Button>
                <Button variant="outline" className="flex-1">
                  <FileText className="mr-2 h-4 w-4" />
                  In
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
