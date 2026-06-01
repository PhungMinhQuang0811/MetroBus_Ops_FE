"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StatusBadge } from "@/components/status-badge"
import { 
  QrCode, 
  Camera,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Bus,
  MapPin,
  Clock,
  History
} from "lucide-react"

// Mock data
const mockStations = [
  { id: "station-1", name: "Bến Thành" },
  { id: "station-2", name: "Nhà hát Thành phố" },
  { id: "station-3", name: "Ba Son" },
  { id: "station-4", name: "Văn Thánh" },
  { id: "station-5", name: "Tân Cảng" },
  { id: "station-6", name: "Thảo Điền" },
  { id: "station-7", name: "An Phú" },
  { id: "station-8", name: "Rạch Chiếc" },
  { id: "station-9", name: "Phước Long" },
  { id: "station-10", name: "Bình Thái" },
  { id: "station-11", name: "Thủ Đức" },
  { id: "station-12", name: "Suối Tiên" },
]

const mockGates = [
  { id: "gate-1", name: "Cổng 1 - Vào" },
  { id: "gate-2", name: "Cổng 2 - Ra" },
]

type ScanResult = {
  status: "CHECK_IN" | "CHECK_OUT" | "REJECTED" | "PSC_REQUIRED"
  cardUid: string
  message: string
  fare?: number
  reason?: string
  timestamp: string
}

export default function ValidatorPage() {
  const [station, setStation] = useState("")
  const [gate, setGate] = useState("")
  const [qrInput, setQrInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [lastResult, setLastResult] = useState<ScanResult | null>(null)
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([])

  const handleScan = async () => {
    if (!station || !gate || !qrInput) return

    setLoading(true)
    
    // Simulate API call: POST /validator/scan-ticket
    await new Promise(resolve => setTimeout(resolve, 800))

    // Generate random result based on QR input
    let result: ScanResult
    const timestamp = new Date().toLocaleTimeString("vi-VN")
    
    if (qrInput.toLowerCase().includes("invalid")) {
      result = {
        status: "REJECTED",
        cardUid: "UNKNOWN",
        message: "Mã QR không hợp lệ",
        reason: "INVALID_QR",
        timestamp,
      }
    } else if (qrInput.toLowerCase().includes("locked")) {
      result = {
        status: "REJECTED",
        cardUid: "VTC-2024-00001",
        message: "Thẻ đã bị khóa",
        reason: "CARD_LOCKED",
        timestamp,
      }
    } else if (qrInput.toLowerCase().includes("psc")) {
      result = {
        status: "PSC_REQUIRED",
        cardUid: "VTC-2024-00002",
        message: "Cần xử lý PSC - Vượt quá thời gian",
        reason: "OVER_RIDING",
        timestamp,
      }
    } else if (qrInput.toLowerCase().includes("out") || gate.includes("2")) {
      result = {
        status: "CHECK_OUT",
        cardUid: "VTC-2024-" + Math.random().toString().slice(2, 7),
        message: "Ra trạm thành công",
        fare: 7000,
        timestamp,
      }
    } else {
      result = {
        status: "CHECK_IN",
        cardUid: "VTC-2024-" + Math.random().toString().slice(2, 7),
        message: "Vào trạm thành công",
        timestamp,
      }
    }

    setLastResult(result)
    setScanHistory(prev => [result, ...prev].slice(0, 10))
    setQrInput("")
    setLoading(false)
  }

  const getResultColor = (status: ScanResult["status"]) => {
    switch (status) {
      case "CHECK_IN":
      case "CHECK_OUT":
        return "bg-secondary"
      case "REJECTED":
        return "bg-destructive"
      case "PSC_REQUIRED":
        return "bg-accent"
      default:
        return "bg-muted"
    }
  }

  const getResultIcon = (status: ScanResult["status"]) => {
    switch (status) {
      case "CHECK_IN":
      case "CHECK_OUT":
        return <CheckCircle className="h-16 w-16" />
      case "REJECTED":
        return <XCircle className="h-16 w-16" />
      case "PSC_REQUIRED":
        return <AlertTriangle className="h-16 w-16" />
      default:
        return <QrCode className="h-16 w-16" />
    }
  }

  return (
    <div className="min-h-screen bg-foreground">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border/20 bg-card px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Bus className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-bold text-foreground">Gate Validator</h1>
            <p className="text-xs text-muted-foreground">Simulator Mode</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          {new Date().toLocaleTimeString("vi-VN")}
        </div>
      </header>

      <div className="grid h-[calc(100vh-64px)] lg:grid-cols-3">
        {/* Configuration Panel */}
        <div className="border-r border-border/20 bg-card p-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Cấu hình cổng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Trạm</Label>
                <Select value={station} onValueChange={setStation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạm" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockStations.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Cổng</Label>
                <Select value={gate} onValueChange={setGate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn cổng" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockGates.map((g) => (
                      <SelectItem key={g.id} value={g.id}>
                        {g.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-lg border border-border p-3">
                <p className="text-xs text-muted-foreground">Trạng thái</p>
                <div className="mt-1 flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${station && gate ? "bg-secondary" : "bg-muted"}`} />
                  <span className="text-sm font-medium">
                    {station && gate ? "Sẵn sàng quét" : "Chưa cấu hình"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* QR Input Simulation */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Mô phỏng quét QR
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nội dung QR</Label>
                <Input
                  value={qrInput}
                  onChange={(e) => setQrInput(e.target.value)}
                  placeholder="Nhập hoặc dán mã QR"
                  disabled={!station || !gate}
                />
                <p className="text-xs text-muted-foreground">
                  Demo: Nhập &quot;invalid&quot;, &quot;locked&quot;, &quot;psc&quot;, hoặc &quot;out&quot; để test các trường hợp
                </p>
              </div>

              <Button 
                className="w-full" 
                onClick={handleScan}
                disabled={!station || !gate || !qrInput || loading}
              >
                {loading ? "Đang quét..." : "Quét vé"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Result Display */}
        <div className="flex flex-col items-center justify-center p-8">
          {lastResult ? (
            <div className={`flex h-full w-full flex-col items-center justify-center rounded-2xl ${getResultColor(lastResult.status)} p-8 text-center`}>
              <div className="text-white">
                {getResultIcon(lastResult.status)}
              </div>
              <h2 className="mt-6 text-3xl font-bold text-white">
                {lastResult.status === "CHECK_IN" && "VÀO TRẠM"}
                {lastResult.status === "CHECK_OUT" && "RA TRẠM"}
                {lastResult.status === "REJECTED" && "TỪ CHỐI"}
                {lastResult.status === "PSC_REQUIRED" && "CẦN XỬ LÝ PSC"}
              </h2>
              <p className="mt-2 text-lg text-white/90">
                {lastResult.message}
              </p>
              {lastResult.fare && (
                <p className="mt-4 text-2xl font-bold text-white">
                  Cước phí: {lastResult.fare.toLocaleString("vi-VN")}đ
                </p>
              )}
              <p className="mt-4 font-mono text-sm text-white/80">
                {lastResult.cardUid}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center text-muted-foreground">
              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-muted/20">
                <QrCode className="h-16 w-16" />
              </div>
              <p className="mt-6 text-lg">Sẵn sàng quét vé</p>
              <p className="mt-2 text-sm">
                {station && gate 
                  ? `${mockStations.find(s => s.id === station)?.name} - ${mockGates.find(g => g.id === gate)?.name}`
                  : "Vui lòng chọn trạm và cổng"}
              </p>
            </div>
          )}
        </div>

        {/* Scan History */}
        <div className="border-l border-border/20 bg-card p-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Lịch sử quét ({scanHistory.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {scanHistory.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Chưa có lượt quét nào
                </p>
              ) : (
                <div className="space-y-2">
                  {scanHistory.map((scan, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center gap-3 rounded-lg border border-border p-3"
                    >
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        scan.status === "CHECK_IN" || scan.status === "CHECK_OUT" 
                          ? "bg-secondary/10 text-secondary"
                          : scan.status === "REJECTED"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-accent/10 text-accent"
                      }`}>
                        {scan.status === "CHECK_IN" || scan.status === "CHECK_OUT" 
                          ? <CheckCircle className="h-4 w-4" />
                          : scan.status === "REJECTED"
                          ? <XCircle className="h-4 w-4" />
                          : <AlertTriangle className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium">{scan.cardUid}</p>
                        <p className="text-xs text-muted-foreground">{scan.timestamp}</p>
                      </div>
                      <StatusBadge status={scan.status} />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
