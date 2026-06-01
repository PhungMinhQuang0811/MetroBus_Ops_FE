"use client"

import { useState } from "react"
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Eye,
  DollarSign,
  Bus,
  Train,
  Calculator,
  AlertTriangle,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data - biểu giá
const farePolicies = [
  {
    id: "FP001",
    name: "Giá vé buýt thường - Tuyến nội đô",
    transportType: "BUS",
    calculationModel: "FLAT",
    baseFare: 7000,
    stepFare: 0,
    maxFare: 7000,
    effectiveFrom: "2024-01-01",
    status: "ACTIVE",
    appliedRoutes: 15
  },
  {
    id: "FP002",
    name: "Giá vé BRT - Theo km",
    transportType: "BRT",
    calculationModel: "DISTANCE_BASED",
    baseFare: 7000,
    stepFare: 1000,
    maxFare: 15000,
    effectiveFrom: "2024-01-01",
    status: "ACTIVE",
    appliedRoutes: 3
  },
  {
    id: "FP003",
    name: "Giá vé Metro tuyến 1",
    transportType: "METRO",
    calculationModel: "ZONE_BASED",
    baseFare: 8000,
    stepFare: 2000,
    maxFare: 20000,
    effectiveFrom: "2024-06-01",
    status: "PENDING",
    appliedRoutes: 1
  },
  {
    id: "FP004",
    name: "Giá vé buýt liên tỉnh",
    transportType: "BUS",
    calculationModel: "DISTANCE_BASED",
    baseFare: 10000,
    stepFare: 1500,
    maxFare: 40000,
    effectiveFrom: "2024-03-01",
    status: "ACTIVE",
    appliedRoutes: 8
  }
]

// Mock data - giá trần từ Platform
const fareCeilings = {
  BUS: { maxSingleJourneyFare: 15000, maxMonthlyPassFare: 200000 },
  BRT: { maxSingleJourneyFare: 20000, maxMonthlyPassFare: 300000 },
  METRO: { maxSingleJourneyFare: 25000, maxMonthlyPassFare: 400000 }
}

const calculationModels = [
  { value: "FLAT", label: "Giá cố định" },
  { value: "DISTANCE_BASED", label: "Theo khoảng cách (km)" },
  { value: "ZONE_BASED", label: "Theo vùng/trạm" },
]

const transportTypes = [
  { value: "BUS", label: "Xe buýt thường", icon: Bus },
  { value: "BRT", label: "Xe buýt nhanh BRT", icon: Bus },
  { value: "METRO", label: "Metro/Tàu điện", icon: Train },
]

export default function FarePoliciesPage() {
  const [policies, setPolicies] = useState(farePolicies)
  const [searchTerm, setSearchTerm] = useState("")
  const [transportFilter, setTransportFilter] = useState("all")
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [previewSheetOpen, setPreviewSheetOpen] = useState(false)
  const [selectedPolicy, setSelectedPolicy] = useState<typeof farePolicies[0] | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    transportType: "",
    calculationModel: "",
    baseFare: "",
    stepFare: "",
    maxFare: "",
    effectiveFrom: ""
  })
  const [previewData, setPreviewData] = useState({
    entryStation: "",
    exitStation: "",
    distance: ""
  })

  const filteredPolicies = policies.filter(policy => {
    const matchSearch = policy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       policy.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchTransport = transportFilter === "all" || policy.transportType === transportFilter
    return matchSearch && matchTransport
  })

  const handleCreate = () => {
    setSelectedPolicy(null)
    setFormData({
      name: "",
      transportType: "",
      calculationModel: "",
      baseFare: "",
      stepFare: "",
      maxFare: "",
      effectiveFrom: ""
    })
    setCreateDialogOpen(true)
  }

  const handleEdit = (policy: typeof farePolicies[0]) => {
    setSelectedPolicy(policy)
    setFormData({
      name: policy.name,
      transportType: policy.transportType,
      calculationModel: policy.calculationModel,
      baseFare: policy.baseFare.toString(),
      stepFare: policy.stepFare.toString(),
      maxFare: policy.maxFare.toString(),
      effectiveFrom: policy.effectiveFrom
    })
    setCreateDialogOpen(true)
  }

  const handlePreview = (policy: typeof farePolicies[0]) => {
    setSelectedPolicy(policy)
    setPreviewData({ entryStation: "", exitStation: "", distance: "" })
    setPreviewSheetOpen(true)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-secondary text-secondary-foreground">Đang áp dụng</Badge>
      case "PENDING":
        return <Badge className="bg-accent text-accent-foreground">Chờ áp dụng</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const checkCeilingViolation = () => {
    if (!formData.transportType || !formData.maxFare) return false
    const ceiling = fareCeilings[formData.transportType as keyof typeof fareCeilings]
    return Number(formData.maxFare) > ceiling.maxSingleJourneyFare
  }

  const calculatePreviewFare = () => {
    if (!selectedPolicy || !previewData.distance) return null
    const distance = Number(previewData.distance)
    
    switch (selectedPolicy.calculationModel) {
      case "FLAT":
        return selectedPolicy.baseFare
      case "DISTANCE_BASED":
        const calculated = selectedPolicy.baseFare + (distance * selectedPolicy.stepFare)
        return Math.min(calculated, selectedPolicy.maxFare)
      case "ZONE_BASED":
        const zones = Math.ceil(distance / 5) // Giả sử mỗi zone 5km
        const zoneFare = selectedPolicy.baseFare + ((zones - 1) * selectedPolicy.stepFare)
        return Math.min(zoneFare, selectedPolicy.maxFare)
      default:
        return selectedPolicy.baseFare
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Quản lý Biểu giá</h1>
          <p className="text-muted-foreground">Cấu hình và quản lý biểu giá vé cho các loại hình vận tải</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Tạo biểu giá mới
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng biểu giá</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{policies.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Đang áp dụng</CardTitle>
            <Bus className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{policies.filter(p => p.status === "ACTIVE").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Chờ áp dụng</CardTitle>
            <Calculator className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{policies.filter(p => p.status === "PENDING").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tuyến được áp dụng</CardTitle>
            <ArrowRight className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{policies.reduce((sum, p) => sum + p.appliedRoutes, 0)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Fare Ceilings Info */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-primary" />
            Khung giá trần từ Platform
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {Object.entries(fareCeilings).map(([type, ceiling]) => (
              <div key={type} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {transportTypes.find(t => t.value === type)?.label}:
                </span>
                <span className="font-medium">{formatCurrency(ceiling.maxSingleJourneyFare)}/lượt</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tên biểu giá..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={transportFilter} onValueChange={setTransportFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Loại hình" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {transportTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách biểu giá</CardTitle>
          <CardDescription>{filteredPolicies.length} biểu giá</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã</TableHead>
                <TableHead>Tên biểu giá</TableHead>
                <TableHead>Loại hình</TableHead>
                <TableHead>Mô hình tính</TableHead>
                <TableHead className="text-right">Giá cơ bản</TableHead>
                <TableHead className="text-right">Giá tối đa</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPolicies.map((policy) => (
                <TableRow key={policy.id}>
                  <TableCell className="font-mono text-sm">{policy.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{policy.name}</div>
                      <div className="text-xs text-muted-foreground">{policy.appliedRoutes} tuyến</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {transportTypes.find(t => t.value === policy.transportType)?.label}
                  </TableCell>
                  <TableCell>
                    {calculationModels.find(m => m.value === policy.calculationModel)?.label}
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(policy.baseFare)}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(policy.maxFare)}</TableCell>
                  <TableCell>{getStatusBadge(policy.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handlePreview(policy)}>
                        <Calculator className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(policy)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedPolicy ? "Chỉnh sửa biểu giá" : "Tạo biểu giá mới"}</DialogTitle>
            <DialogDescription>
              Cấu hình thông tin biểu giá cho loại hình vận tải
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tên biểu giá</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="VD: Giá vé buýt nội đô"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Loại hình vận tải</Label>
                <Select 
                  value={formData.transportType} 
                  onValueChange={(v) => setFormData({...formData, transportType: v})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại hình" />
                  </SelectTrigger>
                  <SelectContent>
                    {transportTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Mô hình tính giá</Label>
                <Select 
                  value={formData.calculationModel} 
                  onValueChange={(v) => setFormData({...formData, calculationModel: v})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn mô hình" />
                  </SelectTrigger>
                  <SelectContent>
                    {calculationModels.map(model => (
                      <SelectItem key={model.value} value={model.value}>{model.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Giá cơ bản (VND)</Label>
                <Input
                  type="number"
                  value={formData.baseFare}
                  onChange={(e) => setFormData({...formData, baseFare: e.target.value})}
                  placeholder="7000"
                />
              </div>
              <div className="space-y-2">
                <Label>Giá bước nhảy (VND)</Label>
                <Input
                  type="number"
                  value={formData.stepFare}
                  onChange={(e) => setFormData({...formData, stepFare: e.target.value})}
                  placeholder="1000"
                  disabled={formData.calculationModel === "FLAT"}
                />
              </div>
              <div className="space-y-2">
                <Label>Giá tối đa (VND)</Label>
                <Input
                  type="number"
                  value={formData.maxFare}
                  onChange={(e) => setFormData({...formData, maxFare: e.target.value})}
                  placeholder="15000"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Có hiệu lực từ</Label>
              <Input
                type="date"
                value={formData.effectiveFrom}
                onChange={(e) => setFormData({...formData, effectiveFrom: e.target.value})}
              />
            </div>

            {/* Ceiling Warning */}
            {checkCeilingViolation() && (
              <Card className="border-destructive bg-destructive/10">
                <CardContent className="flex items-center gap-3 py-3">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <div>
                    <p className="font-medium text-destructive">Vượt khung giá trần!</p>
                    <p className="text-sm text-muted-foreground">
                      Giá tối đa ({formatCurrency(Number(formData.maxFare))}) vượt quá khung giá trần 
                      ({formatCurrency(fareCeilings[formData.transportType as keyof typeof fareCeilings]?.maxSingleJourneyFare || 0)})
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Hủy</Button>
            <Button disabled={checkCeilingViolation()}>
              {selectedPolicy ? "Cập nhật" : "Tạo biểu giá"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Sheet */}
      <Sheet open={previewSheetOpen} onOpenChange={setPreviewSheetOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Xem trước tính giá</SheetTitle>
            <SheetDescription>{selectedPolicy?.name}</SheetDescription>
          </SheetHeader>
          {selectedPolicy && (
            <div className="mt-6 space-y-6">
              {/* Policy Info */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Thông tin biểu giá</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mô hình tính</span>
                    <span>{calculationModels.find(m => m.value === selectedPolicy.calculationModel)?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Giá cơ bản</span>
                    <span>{formatCurrency(selectedPolicy.baseFare)}</span>
                  </div>
                  {selectedPolicy.calculationModel !== "FLAT" && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Giá bước nhảy</span>
                      <span>{formatCurrency(selectedPolicy.stepFare)}/km hoặc /zone</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Giá tối đa</span>
                    <span className="font-medium">{formatCurrency(selectedPolicy.maxFare)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Preview Calculator */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Tính giá thử</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Trạm đi</Label>
                    <Input
                      value={previewData.entryStation}
                      onChange={(e) => setPreviewData({...previewData, entryStation: e.target.value})}
                      placeholder="VD: Bến Thành"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Trạm đến</Label>
                    <Input
                      value={previewData.exitStation}
                      onChange={(e) => setPreviewData({...previewData, exitStation: e.target.value})}
                      placeholder="VD: Suối Tiên"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Khoảng cách (km)</Label>
                    <Input
                      type="number"
                      value={previewData.distance}
                      onChange={(e) => setPreviewData({...previewData, distance: e.target.value})}
                      placeholder="10"
                    />
                  </div>

                  {/* Result */}
                  {previewData.distance && (
                    <Card className="bg-primary/10 border-primary">
                      <CardContent className="py-4 text-center">
                        <p className="text-sm text-muted-foreground">Giá vé tính được</p>
                        <p className="text-3xl font-bold text-primary">
                          {formatCurrency(calculatePreviewFare() || 0)}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
