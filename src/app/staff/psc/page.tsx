"use client"

import { useState } from "react"
import { 
  Search, 
  AlertTriangle, 
  CreditCard, 
  MapPin, 
  Clock, 
  DollarSign,
  Unlock,
  Gift,
  CheckCircle2,
  XCircle,
  User,
  Train
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

// Mock incident data
const mockIncident = {
  cardUid: "VTC-2024-001234",
  cardStatus: "LOCKED",
  passengerName: "Nguyen Van A",
  phoneNumber: "0901234567",
  journeyStatus: "OVER_RIDING",
  entryStation: "Ben Thanh",
  entryTime: "2024-01-15 08:30:00",
  expectedExitStation: "Suoi Tien",
  maxFare: 20000,
  currentFare: 15000,
  missingCheckoutReason: "Gate malfunction at exit station",
  lockReason: "Over-riding ticket detected at Suoi Tien station"
}

const unlockReasons = [
  { value: "gate_malfunction", label: "Cổng soát vé bị lỗi" },
  { value: "system_error", label: "Lỗi hệ thống" },
  { value: "passenger_emergency", label: "Hành khách gặp sự cố khẩn cấp" },
  { value: "card_reader_error", label: "Đầu đọc thẻ lỗi" },
  { value: "other", label: "Lý do khác" }
]

export default function PSCIncidentPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [incident, setIncident] = useState<typeof mockIncident | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [activeTab, setActiveTab] = useState("fare-adjustment")
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmAction, setConfirmAction] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [actionSuccess, setActionSuccess] = useState(false)
  
  // Form states
  const [fareAmount, setFareAmount] = useState("")
  const [penaltyAmount, setPenaltyAmount] = useState("")
  const [freeUnlockReason, setFreeUnlockReason] = useState("")
  const [freeUnlockNote, setFreeUnlockNote] = useState("")

  const handleSearch = () => {
    if (!searchQuery.trim()) return
    setIsSearching(true)
    setActionSuccess(false)
    
    // Simulate API call
    setTimeout(() => {
      setIncident(mockIncident)
      setIsSearching(false)
    }, 800)
  }

  const handleAction = (action: string) => {
    setConfirmAction(action)
    setShowConfirmModal(true)
  }

  const handleConfirmAction = () => {
    setIsProcessing(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false)
      setShowConfirmModal(false)
      setActionSuccess(true)
      setIncident(null)
      setSearchQuery("")
      setFareAmount("")
      setPenaltyAmount("")
      setFreeUnlockReason("")
      setFreeUnlockNote("")
    }, 1500)
  }

  const getActionDescription = () => {
    switch (confirmAction) {
      case "fare-adjustment":
        return `Thu phí điều chỉnh ${Number(fareAmount).toLocaleString()}đ cho thẻ ${incident?.cardUid}`
      case "penalty-unlock":
        return `Thu phạt ${Number(penaltyAmount).toLocaleString()}đ và mở khóa thẻ ${incident?.cardUid}`
      case "free-unlock":
        return `Mở khóa miễn phí thẻ ${incident?.cardUid} với lý do: ${unlockReasons.find(r => r.value === freeUnlockReason)?.label}`
      default:
        return ""
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Xử lý sự cố PSC</h1>
        <p className="text-muted-foreground">Tra cứu và xử lý các sự cố soát vé tại quầy</p>
      </div>

      {/* Shift Warning */}
      <Alert variant="default" className="border-warning bg-warning/10">
        <AlertTriangle className="h-4 w-4 text-warning" />
        <AlertTitle className="text-warning">Ca trực đang hoạt động</AlertTitle>
        <AlertDescription className="text-muted-foreground">
          Trạm: Ben Thanh | Ca: 08:00 - 16:00 | Nhân viên: Tran Van B
        </AlertDescription>
      </Alert>

      {actionSuccess && (
        <Alert className="border-secondary bg-secondary/10">
          <CheckCircle2 className="h-4 w-4 text-secondary" />
          <AlertTitle className="text-secondary">Xử lý thành công</AlertTitle>
          <AlertDescription className="text-muted-foreground">
            Sự cố đã được xử lý và ghi nhận vào hệ thống.
          </AlertDescription>
        </Alert>
      )}

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tra cứu thẻ/QR</CardTitle>
          <CardDescription>Nhập mã thẻ hoặc quét QR để tra cứu thông tin sự cố</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Nhập mã thẻ (VD: VTC-2024-001234)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} disabled={isSearching || !searchQuery.trim()}>
              {isSearching ? "Đang tìm..." : "Tra cứu"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Incident Detail */}
      {incident && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left: Incident Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Thông tin sự cố</CardTitle>
                <Badge variant="destructive">{incident.cardStatus}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Card Info */}
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <CreditCard className="h-4 w-4 text-primary" />
                  Thông tin thẻ
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Mã thẻ:</span>
                    <p className="font-mono font-medium">{incident.cardUid}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Trạng thái chuyến:</span>
                    <p>
                      <Badge variant="outline" className="text-warning border-warning">
                        {incident.journeyStatus}
                      </Badge>
                    </p>
                  </div>
                </div>
              </div>

              {/* Passenger Info */}
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <User className="h-4 w-4 text-primary" />
                  Thông tin hành khách
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Họ tên:</span>
                    <p className="font-medium">{incident.passengerName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Số điện thoại:</span>
                    <p className="font-medium">{incident.phoneNumber}</p>
                  </div>
                </div>
              </div>

              {/* Journey Info */}
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Train className="h-4 w-4 text-primary" />
                  Thông tin chuyến đi
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-secondary" />
                    <span className="text-muted-foreground">Trạm vào:</span>
                    <span className="font-medium">{incident.entryStation}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Thời gian vào:</span>
                    <span className="font-medium">{incident.entryTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-destructive" />
                    <span className="text-muted-foreground">Trạm dự kiến ra:</span>
                    <span className="font-medium">{incident.expectedExitStation}</span>
                  </div>
                </div>
              </div>

              {/* Fare Info */}
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <DollarSign className="h-4 w-4 text-primary" />
                  Thông tin cước phí
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Cước hiện tại:</span>
                    <p className="font-medium text-primary">{incident.currentFare.toLocaleString()}đ</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Cước tối đa:</span>
                    <p className="font-medium text-destructive">{incident.maxFare.toLocaleString()}đ</p>
                  </div>
                </div>
              </div>

              {/* Lock Reason */}
              <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
                <div className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-destructive mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-destructive">Lý do khóa thẻ</p>
                    <p className="text-sm text-muted-foreground mt-1">{incident.lockReason}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right: Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Xử lý sự cố</CardTitle>
              <CardDescription>Chọn phương án xử lý phù hợp</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="fare-adjustment" className="text-xs">
                    <DollarSign className="h-3 w-3 mr-1" />
                    Điều chỉnh
                  </TabsTrigger>
                  <TabsTrigger value="penalty-unlock" className="text-xs">
                    <Unlock className="h-3 w-3 mr-1" />
                    Thu phạt
                  </TabsTrigger>
                  <TabsTrigger value="free-unlock" className="text-xs">
                    <Gift className="h-3 w-3 mr-1" />
                    Miễn phí
                  </TabsTrigger>
                </TabsList>

                {/* Fare Adjustment Tab */}
                <TabsContent value="fare-adjustment" className="space-y-4 mt-4">
                  <div className="rounded-lg border p-4 bg-muted/30">
                    <p className="text-sm text-muted-foreground">
                      Thu phí điều chỉnh khi hành khách quên quẹt thẻ khi ra hoặc có sự cố nhẹ.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Số tiền điều chỉnh (VND)</Label>
                    <Input
                      type="number"
                      placeholder="VD: 15000"
                      value={fareAmount}
                      onChange={(e) => setFareAmount(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Đề xuất: {incident.currentFare.toLocaleString()}đ - {incident.maxFare.toLocaleString()}đ
                    </p>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => handleAction("fare-adjustment")}
                    disabled={!fareAmount || Number(fareAmount) <= 0}
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Thu phí điều chỉnh
                  </Button>
                </TabsContent>

                {/* Penalty Unlock Tab */}
                <TabsContent value="penalty-unlock" className="space-y-4 mt-4">
                  <div className="rounded-lg border p-4 bg-warning/10 border-warning/30">
                    <p className="text-sm text-muted-foreground">
                      Thu tiền phạt và mở khóa thẻ. Áp dụng khi hành khách vi phạm quy định (over-riding, trốn vé...).
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Số tiền phạt (VND)</Label>
                    <Input
                      type="number"
                      placeholder="VD: 50000"
                      value={penaltyAmount}
                      onChange={(e) => setPenaltyAmount(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Mức phạt tối thiểu: 50,000đ
                    </p>
                  </div>
                  <Button 
                    className="w-full bg-warning hover:bg-warning/90 text-warning-foreground" 
                    onClick={() => handleAction("penalty-unlock")}
                    disabled={!penaltyAmount || Number(penaltyAmount) < 50000}
                  >
                    <Unlock className="h-4 w-4 mr-2" />
                    Thu phạt & Mở khóa
                  </Button>
                </TabsContent>

                {/* Free Unlock Tab */}
                <TabsContent value="free-unlock" className="space-y-4 mt-4">
                  <div className="rounded-lg border p-4 bg-secondary/10 border-secondary/30">
                    <p className="text-sm text-muted-foreground">
                      Mở khóa miễn phí khi sự cố do lỗi hệ thống hoặc lý do chính đáng. Yêu cầu ghi rõ lý do.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Lý do mở khóa miễn phí</Label>
                    <Select value={freeUnlockReason} onValueChange={setFreeUnlockReason}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn lý do" />
                      </SelectTrigger>
                      <SelectContent>
                        {unlockReasons.map((reason) => (
                          <SelectItem key={reason.value} value={reason.value}>
                            {reason.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Ghi chú bổ sung</Label>
                    <Textarea
                      placeholder="Mô tả chi tiết sự cố..."
                      value={freeUnlockNote}
                      onChange={(e) => setFreeUnlockNote(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <Button 
                    className="w-full bg-secondary hover:bg-secondary/90" 
                    onClick={() => handleAction("free-unlock")}
                    disabled={!freeUnlockReason}
                  >
                    <Gift className="h-4 w-4 mr-2" />
                    Mở khóa miễn phí
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {!incident && !isSearching && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Tra cứu sự cố</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Nhập mã thẻ hoặc quét QR code để tra cứu thông tin sự cố và tiến hành xử lý tại quầy PSC.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xử lý sự cố</DialogTitle>
            <DialogDescription>
              Vui lòng kiểm tra kỹ thông tin trước khi xác nhận. Hành động này sẽ được ghi nhận vào hệ thống.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="rounded-lg border p-4 bg-muted/30">
              <p className="text-sm">{getActionDescription()}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmModal(false)} disabled={isProcessing}>
              Hủy
            </Button>
            <Button onClick={handleConfirmAction} disabled={isProcessing}>
              {isProcessing ? "Đang xử lý..." : "Xác nhận"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
