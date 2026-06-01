"use client"

import { useState } from "react"
import { 
  Search, 
  Plus, 
  Route, 
  MoreHorizontal, 
  Edit, 
  Trash2,
  MapPin,
  Download,
  Upload,
  Bus,
  ArrowRight,
  Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { StatusBadge } from "@/components/status-badge"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

// Mock data
const mockRoutes = [
  {
    id: "R001",
    code: "01",
    name: "Bến Thành - Suối Tiên",
    description: "Tuyến metro số 1 kết nối trung tâm với Suối Tiên",
    transportType: "BUS",
    status: "ACTIVE",
    totalStations: 14,
    totalDistance: 19.7,
    operatingHours: "05:00 - 23:00",
    headway: 10,
    createdAt: "01/01/2024",
    stations: [
      { id: "ST001", name: "Bến Thành", order: 1 },
      { id: "ST002", name: "Nhà hát TP", order: 2 },
      { id: "ST003", name: "Công viên 23/9", order: 3 },
      { id: "ST004", name: "Thảo Cầm Viên", order: 4 },
      { id: "ST005", name: "Tân Cảng", order: 5 },
    ]
  },
  {
    id: "R002",
    code: "08",
    name: "Quận 8 - Bến xe Miền Đông",
    description: "Tuyến buýt kết nối Quận 8 với bến xe Miền Đông",
    transportType: "BUS",
    status: "ACTIVE",
    totalStations: 22,
    totalDistance: 15.2,
    operatingHours: "05:30 - 22:00",
    headway: 15,
    createdAt: "15/01/2024",
    stations: [
      { id: "ST101", name: "Bến xe Quận 8", order: 1 },
      { id: "ST102", name: "Chợ Bình Điền", order: 2 },
      { id: "ST103", name: "Cầu Chữ Y", order: 3 },
    ]
  },
  {
    id: "R003",
    code: "19",
    name: "Mỹ Đình - Bến xe Giáp Bát",
    description: "Tuyến buýt nhanh BRT Hà Nội",
    transportType: "BRT",
    status: "ACTIVE",
    totalStations: 18,
    totalDistance: 14.5,
    operatingHours: "05:00 - 22:30",
    headway: 8,
    createdAt: "01/02/2024",
    stations: []
  },
  {
    id: "R004",
    code: "52",
    name: "Chợ Lớn - Bến Thành",
    description: "Tuyến buýt nội đô kết nối Chợ Lớn và Bến Thành",
    transportType: "BUS",
    status: "MAINTENANCE",
    totalStations: 12,
    totalDistance: 8.3,
    operatingHours: "05:30 - 21:00",
    headway: 12,
    createdAt: "10/02/2024",
    stations: []
  },
]

export default function RoutesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState<typeof mockRoutes[0] | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    transportType: "BUS",
    operatingHours: "",
    headway: "",
  })

  const filteredRoutes = mockRoutes.filter(route => {
    const matchesSearch = route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         route.code.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === "all" || route.status === selectedStatus
    const matchesType = selectedType === "all" || route.transportType === selectedType
    return matchesSearch && matchesStatus && matchesType
  })

  const stats = {
    total: mockRoutes.length,
    active: mockRoutes.filter(r => r.status === "ACTIVE").length,
    maintenance: mockRoutes.filter(r => r.status === "MAINTENANCE").length,
    totalStations: mockRoutes.reduce((acc, r) => acc + r.totalStations, 0),
  }

  const handleViewDetail = (route: typeof mockRoutes[0]) => {
    setSelectedRoute(route)
    setIsDetailOpen(true)
  }

  const handleCreate = () => {
    setIsCreateDialogOpen(false)
    setFormData({ code: "", name: "", description: "", transportType: "BUS", operatingHours: "", headway: "" })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Quản lý Tuyến xe</h1>
          <p className="text-muted-foreground">Quản lý các tuyến xe và trạm dừng trong hệ thống</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsImportDialogOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm tuyến
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng tuyến</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đang hoạt động</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Bảo trì</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{stats.maintenance}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng trạm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStations}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm theo mã hoặc tên tuyến..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Loại xe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                <SelectItem value="BUS">Xe buýt</SelectItem>
                <SelectItem value="BRT">BRT</SelectItem>
                <SelectItem value="METRO">Metro</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                <SelectItem value="MAINTENANCE">Bảo trì</SelectItem>
                <SelectItem value="INACTIVE">Ngừng hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã tuyến</TableHead>
                <TableHead>Tên tuyến</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead className="text-center">Số trạm</TableHead>
                <TableHead className="text-center">Khoảng cách</TableHead>
                <TableHead>Giờ hoạt động</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoutes.map((route) => (
                <TableRow key={route.id} className="cursor-pointer" onClick={() => handleViewDetail(route)}>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      <Bus className="mr-1 h-3 w-3" />
                      {route.code}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{route.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{route.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {route.transportType}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      {route.totalStations}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{route.totalDistance} km</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      {route.operatingHours}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={route.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleViewDetail(route); }}>
                          <Route className="mr-2 h-4 w-4" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa tuyến
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredRoutes.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              Không tìm thấy tuyến xe nào
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Thêm tuyến xe mới</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Mã tuyến</Label>
                <Input 
                  placeholder="VD: 01"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Loại phương tiện</Label>
                <Select value={formData.transportType} onValueChange={(v) => setFormData({...formData, transportType: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BUS">Xe buýt</SelectItem>
                    <SelectItem value="BRT">BRT</SelectItem>
                    <SelectItem value="METRO">Metro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tên tuyến</Label>
              <Input 
                placeholder="VD: Bến Thành - Suối Tiên"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Mô tả</Label>
              <Textarea 
                placeholder="Mô tả về tuyến xe..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Giờ hoạt động</Label>
                <Input 
                  placeholder="VD: 05:00 - 23:00"
                  value={formData.operatingHours}
                  onChange={(e) => setFormData({...formData, operatingHours: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Tần suất (phút)</Label>
                <Input 
                  type="number"
                  placeholder="VD: 10"
                  value={formData.headway}
                  onChange={(e) => setFormData({...formData, headway: e.target.value})}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Hủy</Button>
            <Button onClick={handleCreate}>Tạo tuyến</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import danh sách tuyến</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Dữ liệu CSV/JSON</Label>
              <Textarea 
                placeholder="Dán dữ liệu CSV hoặc JSON vào đây..."
                className="min-h-[200px] font-mono text-sm"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Format: code, name, description, transportType, operatingHours, headway
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>Hủy</Button>
            <Button onClick={() => setIsImportDialogOpen(false)}>Import</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Sheet */}
      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono">
                <Bus className="mr-1 h-3 w-3" />
                {selectedRoute?.code}
              </Badge>
              {selectedRoute?.name}
            </SheetTitle>
          </SheetHeader>
          {selectedRoute && (
            <Tabs defaultValue="info" className="mt-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="info">Thông tin</TabsTrigger>
                <TabsTrigger value="stations">Trạm dừng</TabsTrigger>
              </TabsList>
              
              <TabsContent value="info" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Thông tin chung</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Loại phương tiện:</span>
                      <Badge variant="secondary">{selectedRoute.transportType}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Trạng thái:</span>
                      <StatusBadge status={selectedRoute.status} />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Số trạm:</span>
                      <span>{selectedRoute.totalStations} trạm</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tổng quãng đường:</span>
                      <span>{selectedRoute.totalDistance} km</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Giờ hoạt động:</span>
                      <span>{selectedRoute.operatingHours}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tần suất:</span>
                      <span>{selectedRoute.headway} phút/chuyến</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Ngày tạo:</span>
                      <span>{selectedRoute.createdAt}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Mô tả</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{selectedRoute.description}</p>
                  </CardContent>
                </Card>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Edit className="mr-2 h-4 w-4" />
                    Chỉnh sửa
                  </Button>
                  <Button variant="destructive" className="flex-1">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Xóa
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="stations" className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {selectedRoute.stations.length} trạm trong tuyến
                  </p>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm trạm
                  </Button>
                </div>
                
                {selectedRoute.stations.length > 0 ? (
                  <div className="space-y-2">
                    {selectedRoute.stations.map((station, index) => (
                      <div key={station.id} className="flex items-center gap-3">
                        <div className="flex flex-col items-center">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                            {station.order}
                          </div>
                          {index < selectedRoute.stations.length - 1 && (
                            <div className="h-6 w-0.5 bg-border" />
                          )}
                        </div>
                        <Card className="flex-1">
                          <CardContent className="flex items-center justify-between p-3">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{station.name}</span>
                            </div>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      Chưa có trạm nào trong tuyến này
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
