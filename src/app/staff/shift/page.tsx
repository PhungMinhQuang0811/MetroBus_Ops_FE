"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StatusBadge } from "@/components/status-badge"
import { ConfirmationModal } from "@/components/confirmation-modal"
import { 
  Clock, 
  Play, 
  Square,
  DollarSign,
  AlertCircle,
  CheckCircle
} from "lucide-react"

// Mock data
const mockStations = [
  { id: "station-1", name: "Bến Thành" },
  { id: "station-2", name: "Nhà hát Thành phố" },
  { id: "station-3", name: "Ba Son" },
]

const mockCurrentShift = {
  id: "SHIFT-001",
  station: "Bến Thành",
  startTime: "08:00",
  openingCash: 500000,
  status: "ACTIVE",
  fareAdjustmentCash: 35000,
  penaltyCash: 50000,
  totalSystemCash: 85000,
}

export default function ShiftPage() {
  const [hasActiveShift, setHasActiveShift] = useState(true)
  const [selectedStation, setSelectedStation] = useState("")
  const [openingCash, setOpeningCash] = useState("")
  const [closingCash, setClosingCash] = useState("")
  const [discrepancyReason, setDiscrepancyReason] = useState("")
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<"open" | "close">("open")
  const [loading, setLoading] = useState(false)

  const handleOpenShift = async () => {
    setLoading(true)
    // Simulate API call: POST /shifts/open-shift
    await new Promise(resolve => setTimeout(resolve, 1000))
    setHasActiveShift(true)
    setConfirmOpen(false)
    setLoading(false)
  }

  const handleCloseShift = async () => {
    setLoading(true)
    // Simulate API call: POST /shifts/close-shift
    await new Promise(resolve => setTimeout(resolve, 1000))
    setHasActiveShift(false)
    setConfirmOpen(false)
    setClosingCash("")
    setDiscrepancyReason("")
    setLoading(false)
  }

  const cashDiscrepancy = closingCash 
    ? parseInt(closingCash) - (mockCurrentShift.openingCash + mockCurrentShift.totalSystemCash)
    : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Quản lý ca làm việc</h1>
        <p className="text-muted-foreground">Mở ca, kết ca và theo dõi doanh thu</p>
      </div>

      {/* Active Shift Info */}
      {hasActiveShift ? (
        <>
          <Card className="border-secondary">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle>Ca đang hoạt động</CardTitle>
                    <CardDescription>
                      Bắt đầu lúc {mockCurrentShift.startTime} tại {mockCurrentShift.station}
                    </CardDescription>
                  </div>
                </div>
                <StatusBadge status="ACTIVE" />
              </div>
            </CardHeader>
          </Card>

          {/* Cash Summary */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Tiền mặt đầu ca
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {mockCurrentShift.openingCash.toLocaleString("vi-VN")}đ
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Thu điều chỉnh cước
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-secondary">
                  +{mockCurrentShift.fareAdjustmentCash.toLocaleString("vi-VN")}đ
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Thu phạt mở khóa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-secondary">
                  +{mockCurrentShift.penaltyCash.toLocaleString("vi-VN")}đ
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Tổng tiền mặt dự kiến
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary">
                  {(mockCurrentShift.openingCash + mockCurrentShift.totalSystemCash).toLocaleString("vi-VN")}đ
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Close Shift Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Square className="h-5 w-5" />
                Kết thúc ca
              </CardTitle>
              <CardDescription>
                Kiểm đếm tiền mặt và kết thúc ca làm việc
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="closingCash">Số tiền mặt thực tế (VNĐ)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="closingCash"
                    type="number"
                    value={closingCash}
                    onChange={(e) => setClosingCash(e.target.value)}
                    placeholder="Nhập số tiền đã kiểm đếm"
                    className="pl-10"
                  />
                </div>
              </div>

              {closingCash && cashDiscrepancy !== 0 && (
                <>
                  <div className={`rounded-lg p-3 ${
                    cashDiscrepancy > 0 
                      ? "bg-secondary/10 text-secondary" 
                      : "bg-destructive/10 text-destructive"
                  }`}>
                    <div className="flex items-center gap-2">
                      {cashDiscrepancy > 0 ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                      <span className="font-medium">
                        {cashDiscrepancy > 0 ? "Dư" : "Thiếu"}: {Math.abs(cashDiscrepancy).toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discrepancyReason">Lý do chênh lệch</Label>
                    <Textarea
                      id="discrepancyReason"
                      value={discrepancyReason}
                      onChange={(e) => setDiscrepancyReason(e.target.value)}
                      placeholder="Giải thích lý do chênh lệch tiền mặt..."
                      rows={3}
                    />
                  </div>
                </>
              )}

              <Button 
                variant="destructive"
                onClick={() => {
                  setConfirmAction("close")
                  setConfirmOpen(true)
                }}
                disabled={!closingCash || (cashDiscrepancy !== 0 && !discrepancyReason)}
              >
                <Square className="mr-2 h-4 w-4" />
                Kết thúc ca
              </Button>
            </CardContent>
          </Card>
        </>
      ) : (
        /* Open Shift Form */
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Mở ca mới
            </CardTitle>
            <CardDescription>
              Chọn trạm và nhập số tiền mặt đầu ca
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Trạm làm việc</Label>
              <Select value={selectedStation} onValueChange={setSelectedStation}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạm" />
                </SelectTrigger>
                <SelectContent>
                  {mockStations.map((station) => (
                    <SelectItem key={station.id} value={station.id}>
                      {station.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="openingCash">Tiền mặt đầu ca (VNĐ)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="openingCash"
                  type="number"
                  value={openingCash}
                  onChange={(e) => setOpeningCash(e.target.value)}
                  placeholder="Nhập số tiền mặt ban đầu"
                  className="pl-10"
                />
              </div>
            </div>

            <Button 
              onClick={() => {
                setConfirmAction("open")
                setConfirmOpen(true)
              }}
              disabled={!selectedStation || !openingCash}
            >
              <Play className="mr-2 h-4 w-4" />
              Mở ca
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={confirmAction === "open" ? "Xác nhận mở ca" : "Xác nhận kết thúc ca"}
        description={
          confirmAction === "open"
            ? `Bạn sẽ mở ca tại ${mockStations.find(s => s.id === selectedStation)?.name || ""} với số tiền đầu ca ${parseInt(openingCash || "0").toLocaleString("vi-VN")}đ`
            : `Bạn sẽ kết thúc ca với số tiền ${parseInt(closingCash || "0").toLocaleString("vi-VN")}đ. ${cashDiscrepancy !== 0 ? `Chênh lệch: ${cashDiscrepancy > 0 ? "+" : ""}${cashDiscrepancy.toLocaleString("vi-VN")}đ` : ""}`
        }
        confirmText={confirmAction === "open" ? "Mở ca" : "Kết thúc ca"}
        onConfirm={confirmAction === "open" ? handleOpenShift : handleCloseShift}
        variant={confirmAction === "close" ? "destructive" : "default"}
        loading={loading}
      />
    </div>
  )
}
