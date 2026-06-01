"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Search, 
  Plus, 
  Building2,
  Bus,
  CreditCard,
  TrendingUp,
  Eye,
  MoreHorizontal,
  Settings,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin
} from "lucide-react"

// Mock data - Tenants (Operators/Bus Companies)
const mockTenants = [
  {
    id: "TEN001",
    operatorId: "OP_SGBUS",
    name: "Xe buýt Sài Gòn",
    shortName: "SGBUS",
    contactPerson: "Nguyen Van Manager",
    email: "admin@sgbus.vn",
    phone: "028 1234 5678",
    routes: 8,
    stations: 120,
    monthlyRevenue: 5200000000,
    platformFee: 5,
    status: "active",
    joinDate: "2024-01-15",
    bankAccount: "VCB - 1234567890"
  },
  {
    id: "TEN002",
    operatorId: "OP_VINBUS",
    name: "Vinbus",
    shortName: "VINBUS",
    contactPerson: "Tran Thi Director",
    email: "ops@vinbus.vn",
    phone: "024 9876 5432",
    routes: 12,
    stations: 180,
    monthlyRevenue: 3800000000,
    platformFee: 5,
    status: "active",
    joinDate: "2024-02-01",
    bankAccount: "BIDV - 0987654321"
  },
  {
    id: "TEN003",
    operatorId: "OP_TRANSDN",
    name: "TransBus Đà Nẵng",
    shortName: "TRANSDN",
    contactPerson: "Le Van CEO",
    email: "contact@transbus.dn.vn",
    phone: "0236 345 6789",
    routes: 5,
    stations: 65,
    monthlyRevenue: 1200000000,
    platformFee: 5,
    status: "active",
    joinDate: "2024-03-10",
    bankAccount: "ACB - 1122334455"
  },
  {
    id: "TEN004",
    operatorId: "OP_MAILINH",
    name: "Mai Linh Express",
    shortName: "MAILINH",
    contactPerson: "Pham Founder",
    email: "bus@mailinh.vn",
    phone: "028 2345 6789",
    routes: 4,
    stations: 48,
    monthlyRevenue: 980000000,
    platformFee: 5,
    status: "active",
    joinDate: "2024-04-01",
    bankAccount: "TCB - 5566778899"
  },
  {
    id: "TEN005",
    operatorId: "OP_PHUONGTRANG",
    name: "Phương Trang",
    shortName: "FUTA",
    contactPerson: "Hoang Manager",
    email: "city@futabus.vn",
    phone: "028 3456 7890",
    routes: 3,
    stations: 35,
    monthlyRevenue: 650000000,
    platformFee: 5,
    status: "pending",
    joinDate: "2024-05-20",
    bankAccount: "MB - 9988776655"
  },
]

export default function TenantsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<typeof mockTenants[0] | null>(null)

  const filteredTenants = mockTenants.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tenant.operatorId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || tenant.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: mockTenants.length,
    active: mockTenants.filter(t => t.status === "active").length,
    totalRoutes: mockTenants.reduce((sum, t) => sum + t.routes, 0),
    totalRevenue: mockTenants.reduce((sum, t) => sum + t.monthlyRevenue, 0)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-secondary text-secondary-foreground">Hoạt động</Badge>
      case "pending":
        return <Badge variant="outline" className="text-accent border-accent">Chờ kích hoạt</Badge>
      case "suspended":
        return <Badge variant="destructive">Tạm ngưng</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Quản lý Tenants</h1>
          <p className="text-muted-foreground">Quản lý không gian làm việc của các đơn vị vận hành (Operators)</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm Tenant
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Thêm Tenant mới</DialogTitle>
              <DialogDescription>
                Đăng ký đơn vị vận hành mới vào hệ thống nền tảng
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Mã Operator *</Label>
                  <Input placeholder="OP_NEWBUS" />
                </div>
                <div className="space-y-2">
                  <Label>Tên viết tắt *</Label>
                  <Input placeholder="NEWBUS" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Tên đơn vị vận hành *</Label>
                <Input placeholder="Công ty Xe buýt ABC" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Người liên hệ *</Label>
                  <Input placeholder="Nguyen Van A" />
                </div>
                <div className="space-y-2">
                  <Label>Số điện thoại</Label>
                  <Input placeholder="028 1234 5678" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input type="email" placeholder="admin@newbus.vn" />
              </div>
              <div className="space-y-2">
                <Label>Tài khoản ngân hàng</Label>
                <Input placeholder="Ngân hàng - Số tài khoản" />
              </div>
              <div className="space-y-2">
                <Label>Tỷ lệ phí nền tảng</Label>
                <div className="flex items-center gap-2">
                  <Input type="number" defaultValue="5" className="w-24" />
                  <span className="text-muted-foreground">%</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Hủy</Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>Thêm Tenant</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Tổng Tenants</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10">
                <CheckCircle2 className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-sm text-muted-foreground">Đang hoạt động</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <Bus className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalRoutes}</p>
                <p className="text-sm text-muted-foreground">Tổng tuyến xe</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-lg font-bold">{(stats.totalRevenue / 1000000000).toFixed(1)}B</p>
                <p className="text-sm text-muted-foreground">Doanh thu/tháng</p>
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
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên, mã operator..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="pending">Chờ kích hoạt</SelectItem>
                <SelectItem value="suspended">Tạm ngưng</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tenants Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách Tenants ({filteredTenants.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant</TableHead>
                <TableHead>Operator ID</TableHead>
                <TableHead>Tuyến / Trạm</TableHead>
                <TableHead>Doanh thu/tháng</TableHead>
                <TableHead>Phí NTT</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTenants.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{tenant.name}</p>
                        <p className="text-sm text-muted-foreground">{tenant.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-sm bg-muted px-2 py-1 rounded">{tenant.operatorId}</code>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Bus className="h-4 w-4 text-muted-foreground" />
                        {tenant.routes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {tenant.stations}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {(tenant.monthlyRevenue / 1000000000).toFixed(2)}B đ
                  </TableCell>
                  <TableCell>{tenant.platformFee}%</TableCell>
                  <TableCell>{getStatusBadge(tenant.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedTenant(tenant)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Settings className="h-4 w-4 mr-2" />
                          Cấu hình
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileSpreadsheet className="h-4 w-4 mr-2" />
                          Lịch sử đối soát
                        </DropdownMenuItem>
                        {tenant.status === "pending" && (
                          <DropdownMenuItem className="text-secondary">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Kích hoạt
                          </DropdownMenuItem>
                        )}
                        {tenant.status === "active" && (
                          <DropdownMenuItem className="text-destructive">
                            <XCircle className="h-4 w-4 mr-2" />
                            Tạm ngưng
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

      {/* Tenant Detail Sheet */}
      <Sheet open={!!selectedTenant} onOpenChange={() => setSelectedTenant(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Chi tiết Tenant</SheetTitle>
            <SheetDescription>{selectedTenant?.operatorId}</SheetDescription>
          </SheetHeader>
          
          {selectedTenant && (
            <div className="mt-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedTenant.name}</h3>
                  <p className="text-muted-foreground">{selectedTenant.shortName}</p>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-4">
                      <p className="text-xs text-muted-foreground">Tuyến xe</p>
                      <p className="text-xl font-bold">{selectedTenant.routes}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <p className="text-xs text-muted-foreground">Trạm dừng</p>
                      <p className="text-xl font-bold">{selectedTenant.stations}</p>
                    </CardContent>
                  </Card>
                </div>
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-xs text-muted-foreground">Doanh thu tháng này</p>
                    <p className="text-xl font-bold text-secondary">
                      {(selectedTenant.monthlyRevenue / 1000000000).toFixed(2)}B đ
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Thông tin liên hệ</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Người liên hệ</span>
                    <span>{selectedTenant.contactPerson}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span>{selectedTenant.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Điện thoại</span>
                    <span>{selectedTenant.phone}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Thông tin thanh toán</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tài khoản NH</span>
                    <span>{selectedTenant.bankAccount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phí nền tảng</span>
                    <span className="font-medium text-primary">{selectedTenant.platformFee}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ngày tham gia</span>
                    <span>{selectedTenant.joinDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1">
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Xem đối soát
                </Button>
                <Button className="flex-1">
                  <Settings className="h-4 w-4 mr-2" />
                  Cấu hình
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
