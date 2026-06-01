"use client"

import { useState } from "react"
import { 
  ArrowUpDown, 
  Edit, 
  Plus, 
  Save, 
  AlertTriangle,
  DollarSign,
  Bus,
  Train,
  Calendar
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Mock data - cấu hình giá trần hiện tại
const currentCeilings = [
  {
    id: "1",
    transportType: "BUS",
    maxSingleJourneyFare: 15000,
    maxMonthlyPassFare: 200000,
    effectiveFrom: "2024-01-01",
    status: "ACTIVE"
  },
  {
    id: "2", 
    transportType: "BRT",
    maxSingleJourneyFare: 20000,
    maxMonthlyPassFare: 300000,
    effectiveFrom: "2024-01-01",
    status: "ACTIVE"
  },
  {
    id: "3",
    transportType: "METRO",
    maxSingleJourneyFare: 25000,
    maxMonthlyPassFare: 400000,
    effectiveFrom: "2024-06-01",
    status: "PENDING"
  }
]

const transportTypes = [
  { value: "BUS", label: "Xe buýt thường", icon: Bus },
  { value: "BRT", label: "Xe buýt nhanh BRT", icon: Bus },
  { value: "METRO", label: "Metro/Tàu điện", icon: Train },
]

export default function FareCeilingPage() {
  const [ceilings, setCeilings] = useState(currentCeilings)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [selectedCeiling, setSelectedCeiling] = useState<typeof currentCeilings[0] | null>(null)
  const [formData, setFormData] = useState({
    transportType: "",
    maxSingleJourneyFare: "",
    maxMonthlyPassFare: "",
    effectiveFrom: ""
  })

  const handleEdit = (ceiling: typeof currentCeilings[0]) => {
    setSelectedCeiling(ceiling)
    setFormData({
      transportType: ceiling.transportType,
      maxSingleJourneyFare: ceiling.maxSingleJourneyFare.toString(),
      maxMonthlyPassFare: ceiling.maxMonthlyPassFare.toString(),
      effectiveFrom: ceiling.effectiveFrom
    })
    setEditDialogOpen(true)
  }

  const handleCreate = () => {
    setSelectedCeiling(null)
    setFormData({
      transportType: "",
      maxSingleJourneyFare: "",
      maxMonthlyPassFare: "",
      effectiveFrom: ""
    })
    setEditDialogOpen(true)
  }

  const handleSaveClick = () => {
    setEditDialogOpen(false)
    setConfirmDialogOpen(true)
  }

  const handleConfirmSave = () => {
    // Save logic here
    setConfirmDialogOpen(false)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Cấu hình Khung giá trần</h1>
          <p className="text-muted-foreground">Quản lý mức giá trần cho các loại hình vận tải</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm cấu hình
        </Button>
      </div>

      {/* Alert Banner */}
      <Card className="border-warning bg-warning/10">
        <CardContent className="flex items-center gap-3 py-4">
          <AlertTriangle className="h-5 w-5 text-warning" />
          <div>
            <p className="font-medium text-foreground">Lưu ý quan trọng</p>
            <p className="text-sm text-muted-foreground">
              Thay đổi khung giá trần sẽ ảnh hưởng đến tất cả các đơn vị vận hành. 
              Các biểu giá của Company vượt trần sẽ bị cảnh báo và không được áp dụng.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {transportTypes.map((type) => {
          const ceiling = ceilings.find(c => c.transportType === type.value && c.status === "ACTIVE")
          const Icon = type.icon
          return (
            <Card key={type.value}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{type.label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {ceiling ? (
                  <div className="space-y-1">
                    <div className="text-2xl font-bold">{formatCurrency(ceiling.maxSingleJourneyFare)}</div>
                    <p className="text-xs text-muted-foreground">Giá trần/lượt</p>
                    <p className="text-sm text-muted-foreground">
                      Vé tháng: {formatCurrency(ceiling.maxMonthlyPassFare)}
                    </p>
                  </div>
                ) : (
                  <div className="text-muted-foreground">Chưa cấu hình</div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Ceiling Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch sử cấu hình giá trần</CardTitle>
          <CardDescription>
            Danh sách các cấu hình giá trần theo loại hình vận tải
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Loại hình</TableHead>
                <TableHead className="text-right">Giá trần/lượt</TableHead>
                <TableHead className="text-right">Giá trần vé tháng</TableHead>
                <TableHead>Có hiệu lực từ</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ceilings.map((ceiling) => (
                <TableRow key={ceiling.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {ceiling.transportType === "METRO" ? (
                        <Train className="h-4 w-4" />
                      ) : (
                        <Bus className="h-4 w-4" />
                      )}
                      {transportTypes.find(t => t.value === ceiling.transportType)?.label}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(ceiling.maxSingleJourneyFare)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(ceiling.maxMonthlyPassFare)}
                  </TableCell>
                  <TableCell>{ceiling.effectiveFrom}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={ceiling.status === "ACTIVE" ? "default" : "secondary"}
                      className={ceiling.status === "ACTIVE" ? "bg-secondary text-secondary-foreground" : "bg-accent text-accent-foreground"}
                    >
                      {ceiling.status === "ACTIVE" ? "Đang áp dụng" : "Chờ áp dụng"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(ceiling)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit/Create Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedCeiling ? "Chỉnh sửa khung giá trần" : "Thêm khung giá trần mới"}
            </DialogTitle>
            <DialogDescription>
              Cấu hình mức giá trần cho loại hình vận tải
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Loại hình vận tải</Label>
              <Select 
                value={formData.transportType} 
                onValueChange={(v) => setFormData({...formData, transportType: v})}
                disabled={!!selectedCeiling}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại hình" />
                </SelectTrigger>
                <SelectContent>
                  {transportTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Giá trần mỗi lượt (VND)</Label>
              <Input
                type="number"
                value={formData.maxSingleJourneyFare}
                onChange={(e) => setFormData({...formData, maxSingleJourneyFare: e.target.value})}
                placeholder="15000"
              />
            </div>
            <div className="space-y-2">
              <Label>Giá trần vé tháng (VND)</Label>
              <Input
                type="number"
                value={formData.maxMonthlyPassFare}
                onChange={(e) => setFormData({...formData, maxMonthlyPassFare: e.target.value})}
                placeholder="200000"
              />
            </div>
            <div className="space-y-2">
              <Label>Có hiệu lực từ ngày</Label>
              <Input
                type="date"
                value={formData.effectiveFrom}
                onChange={(e) => setFormData({...formData, effectiveFrom: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveClick}>
              <Save className="mr-2 h-4 w-4" />
              Lưu cấu hình
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Xác nhận thay đổi khung giá trần
            </DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn áp dụng thay đổi này không?
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <p className="font-medium">Tóm tắt thay đổi:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Loại hình: {transportTypes.find(t => t.value === formData.transportType)?.label}</li>
              <li>Giá trần/lượt: {formatCurrency(Number(formData.maxSingleJourneyFare))}</li>
              <li>Giá trần vé tháng: {formatCurrency(Number(formData.maxMonthlyPassFare))}</li>
              <li>Có hiệu lực từ: {formData.effectiveFrom}</li>
            </ul>
          </div>
          <p className="text-sm text-destructive">
            Lưu ý: Thay đổi này sẽ ảnh hưởng đến tất cả các đơn vị vận hành trong hệ thống.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleConfirmSave}>
              Xác nhận thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
