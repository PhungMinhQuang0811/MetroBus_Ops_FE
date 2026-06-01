"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Search, 
  Plus,
  MoreHorizontal,
  Eye,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Calculator,
  Building2,
  Calendar,
  ArrowRight,
  Banknote
} from "lucide-react"

// Mock data
const settlementPeriods = [
  {
    id: "STL-2026-05-003",
    period: "16/05 - 31/05/2026",
    status: "pending",
    tenantsCount: 12,
    totalAmount: "4,560,000,000",
    platformFee: "228,000,000",
    netToTenants: "4,332,000,000",
    createdAt: null,
    completedAt: null
  },
  {
    id: "STL-2026-05-002",
    period: "01/05 - 15/05/2026",
    status: "completed",
    tenantsCount: 12,
    totalAmount: "4,120,000,000",
    platformFee: "206,000,000",
    netToTenants: "3,914,000,000",
    createdAt: "16/05/2026",
    completedAt: "18/05/2026"
  },
  {
    id: "STL-2026-04-002",
    period: "16/04 - 30/04/2026",
    status: "completed",
    tenantsCount: 11,
    totalAmount: "3,890,000,000",
    platformFee: "194,500,000",
    netToTenants: "3,695,500,000",
    createdAt: "01/05/2026",
    completedAt: "03/05/2026"
  },
  {
    id: "STL-2026-04-001",
    period: "01/04 - 15/04/2026",
    status: "completed",
    tenantsCount: 11,
    totalAmount: "3,750,000,000",
    platformFee: "187,500,000",
    netToTenants: "3,562,500,000",
    createdAt: "16/04/2026",
    completedAt: "18/04/2026"
  },
]

const settlementDetails = [
  { tenant: "Xe buýt Sài Gòn", revenue: "1,250,000,000", trips: 32500, fee: "62,500,000", net: "1,187,500,000", status: "transferred" },
  { tenant: "Vinbus", revenue: "1,120,000,000", trips: 28000, fee: "56,000,000", net: "1,064,000,000", status: "transferred" },
  { tenant: "TransBus Đà Nẵng", revenue: "450,000,000", trips: 12000, fee: "22,500,000", net: "427,500,000", status: "transferred" },
  { tenant: "Mai Linh Express", revenue: "380,000,000", trips: 9500, fee: "19,000,000", net: "361,000,000", status: "transferred" },
  { tenant: "Phương Trang", revenue: "320,000,000", trips: 8200, fee: "16,000,000", net: "304,000,000", status: "pending" },
  { tenant: "Thành Bưởi", revenue: "280,000,000", trips: 7100, fee: "14,000,000", net: "266,000,000", status: "pending" },
]

export default function SettlementPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedSettlement, setSelectedSettlement] = useState<typeof settlementPeriods[0] | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const filteredSettlements = settlementPeriods.filter(s => {
    const matchesSearch = s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.period.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || s.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    pending: settlementPeriods.filter(s => s.status === "pending").length,
    processing: settlementPeriods.filter(s => s.status === "processing").length,
    completed: settlementPeriods.filter(s => s.status === "completed").length,
    totalCompleted: "15,774,000,000"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Đối soát tài chính</h1>
          <p className="text-muted-foreground">Clearing & Settlement với các đơn vị vận hành (Tenants)</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tạo kỳ đối soát
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tạo kỳ đối soát mới</DialogTitle>
              <DialogDescription>
                Khởi tạo phiên đối soát phân chia doanh thu liên thông
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Kỳ đối soát</Label>
                <Select defaultValue="current">
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn kỳ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">16/05 - 31/05/2026 (Kỳ hiện tại)</SelectItem>
                    <SelectItem value="custom">Tùy chỉnh...</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Tenants tham gia</Label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả Tenants (12)</SelectItem>
                    <SelectItem value="selected">Chọn Tenants cụ thể</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Tỷ lệ phí nền tảng</Label>
                <div className="flex items-center gap-2">
                  <Input type="number" defaultValue="5" className="w-24" />
                  <span className="text-muted-foreground">%</span>
                </div>
                <p className="text-xs text-muted-foreground">Phí vận hành nền tảng trừ từ doanh thu</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Hủy</Button>
              <Button onClick={() => setShowCreateDialog(false)}>
                <Calculator className="h-4 w-4 mr-2" />
                Bắt đầu đối soát
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="cursor-pointer hover:border-accent" onClick={() => setStatusFilter("pending")}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                <Clock className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">Chờ đối soát</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary" onClick={() => setStatusFilter("processing")}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.processing}</p>
                <p className="text-sm text-muted-foreground">Đang xử lý</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-secondary" onClick={() => setStatusFilter("completed")}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10">
                <CheckCircle2 className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-sm text-muted-foreground">Hoàn thành</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <Banknote className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-lg font-bold">{stats.totalCompleted}đ</p>
                <p className="text-sm text-muted-foreground">Đã thanh toán</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo mã đối soát, kỳ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="pending">Chờ đối soát</SelectItem>
                <SelectItem value="processing">Đang xử lý</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đối soát</TableHead>
                <TableHead>Kỳ</TableHead>
                <TableHead>Tenants</TableHead>
                <TableHead>Tổng doanh thu</TableHead>
                <TableHead>Phí nền tảng</TableHead>
                <TableHead>Thanh toán Tenants</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSettlements.map((settlement) => (
                <TableRow key={settlement.id}>
                  <TableCell className="font-mono text-sm">{settlement.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {settlement.period}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      {settlement.tenantsCount}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{settlement.totalAmount}đ</TableCell>
                  <TableCell className="text-primary">{settlement.platformFee}đ</TableCell>
                  <TableCell className="text-secondary font-medium">{settlement.netToTenants}đ</TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedSettlement(settlement)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Xuất báo cáo
                        </DropdownMenuItem>
                        {settlement.status === "pending" && (
                          <DropdownMenuItem>
                            <Calculator className="h-4 w-4 mr-2" />
                            Bắt đầu đối soát
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Settlement Detail Sheet */}
      <Sheet open={!!selectedSettlement} onOpenChange={() => setSelectedSettlement(null)}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Chi tiết đối soát</SheetTitle>
            <SheetDescription>{selectedSettlement?.id} - Kỳ {selectedSettlement?.period}</SheetDescription>
          </SheetHeader>
          
          {selectedSettlement && (
            <div className="mt-6 space-y-6">
              {/* Summary */}
              <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-xs text-muted-foreground">Tổng doanh thu</p>
                    <p className="text-lg font-bold">{selectedSettlement.totalAmount}đ</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-xs text-muted-foreground">Phí nền tảng (5%)</p>
                    <p className="text-lg font-bold text-primary">{selectedSettlement.platformFee}đ</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-xs text-muted-foreground">Thanh toán Tenants</p>
                    <p className="text-lg font-bold text-secondary">{selectedSettlement.netToTenants}đ</p>
                  </CardContent>
                </Card>
              </div>

              {/* Tenant Breakdown */}
              <div>
                <h3 className="font-semibold mb-3">Chi tiết theo Tenant</h3>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tenant</TableHead>
                        <TableHead>Doanh thu</TableHead>
                        <TableHead>Chuyến</TableHead>
                        <TableHead>Phí</TableHead>
                        <TableHead>Thanh toán</TableHead>
                        <TableHead>TT</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {settlementDetails.map((detail, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{detail.tenant}</TableCell>
                          <TableCell>{detail.revenue}đ</TableCell>
                          <TableCell>{detail.trips.toLocaleString()}</TableCell>
                          <TableCell className="text-primary">{detail.fee}đ</TableCell>
                          <TableCell className="text-secondary font-medium">{detail.net}đ</TableCell>
                          <TableCell>
                            {detail.status === "transferred" ? (
                              <CheckCircle2 className="h-4 w-4 text-secondary" />
                            ) : (
                              <Clock className="h-4 w-4 text-accent" />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Xuất Excel
                </Button>
                {selectedSettlement.status === "pending" && (
                  <Button className="flex-1">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Xác nhận thanh toán
                  </Button>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
