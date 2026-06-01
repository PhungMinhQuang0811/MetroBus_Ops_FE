"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { StatusBadge } from "@/components/status-badge"
import { 
  ArrowLeft, 
  Bus, 
  Calendar, 
  RefreshCw,
  WifiOff,
  CheckCircle
} from "lucide-react"
import Link from "next/link"
import { ROUTES } from "@/lib/routes"
import { QRCodeSVG } from "qrcode.react"

// Mock card data
const mockCard = {
  uid: "VTC-2024-00001",
  status: "ACTIVE" as const,
  subscription: {
    planName: "Vé tháng toàn tuyến",
    startDate: "01/01/2024",
    endDate: "31/01/2024",
    status: "ACTIVE" as const,
  }
}

// QR refresh interval (30 seconds for demo)
const QR_REFRESH_INTERVAL = 30

export default function QRCodePage() {
  const [qrData, setQrData] = useState("")
  const [countdown, setCountdown] = useState(QR_REFRESH_INTERVAL)
  const [isOffline, setIsOffline] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Generate QR code data
  const generateQR = useCallback(() => {
    // In real app, this would be a cryptographic token
    const timestamp = Date.now()
    const data = JSON.stringify({
      cardUid: mockCard.uid,
      timestamp,
      signature: `sig_${timestamp}_${Math.random().toString(36).slice(2)}`,
    })
    setQrData(btoa(data))
    setCountdown(QR_REFRESH_INTERVAL)
  }, [])

  // Initial QR generation
  useEffect(() => {
    generateQR()
  }, [generateQR])

  // Countdown and auto-refresh
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          generateQR()
          return QR_REFRESH_INTERVAL
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [generateQR])

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)
    setIsOffline(!navigator.onLine)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const handleManualRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    generateQR()
    setIsRefreshing(false)
  }

  // Calculate countdown progress
  const progress = (countdown / QR_REFRESH_INTERVAL) * 100

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center gap-4 border-b border-border bg-card px-4 py-3">
        <Link href={ROUTES.passenger.home}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-lg font-semibold">Mã QR của bạn</h1>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center p-4">
        {/* Offline warning */}
        {isOffline && (
          <Card className="mb-4 w-full max-w-sm border-accent bg-accent/10">
            <CardContent className="flex items-center gap-3 p-3">
              <WifiOff className="h-5 w-5 text-accent" />
              <div>
                <p className="text-sm font-medium">Chế độ offline</p>
                <p className="text-xs text-muted-foreground">
                  QR vẫn hoạt động nhưng có thể bị giới hạn
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Card status check */}
        {mockCard.status !== "ACTIVE" ? (
          <Card className="w-full max-w-sm border-destructive">
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold">Thẻ bị khóa</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Thẻ của bạn đã bị khóa. Vui lòng liên hệ nhân viên để được hỗ trợ.
              </p>
              <StatusBadge status={mockCard.status} className="mt-4" />
            </CardContent>
          </Card>
        ) : (
          <>
            {/* QR Code Card */}
            <Card className="w-full max-w-sm overflow-hidden">
              <CardContent className="flex flex-col items-center p-6">
                {/* QR Code with countdown ring */}
                <div className="relative">
                  {/* Countdown ring */}
                  <svg className="absolute -inset-2 h-[calc(100%+16px)] w-[calc(100%+16px)]" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="48"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-border"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="48"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray={`${progress * 3.02} 302`}
                      className="text-primary transition-all duration-1000"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  
                  {/* QR Code */}
                  <div className="rounded-lg bg-white p-4">
                    <QRCodeSVG 
                      value={qrData || "loading"} 
                      size={200}
                      level="H"
                      includeMargin={false}
                    />
                  </div>
                </div>

                {/* Countdown */}
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                  <span>Làm mới sau {countdown}s</span>
                </div>

                {/* Manual refresh */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={handleManualRefresh}
                  disabled={isRefreshing}
                >
                  Làm mới ngay
                </Button>
              </CardContent>
            </Card>

            {/* Card Info */}
            <Card className="mt-4 w-full max-w-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Bus className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{mockCard.subscription.planName}</p>
                      <p className="text-xs text-muted-foreground font-mono">{mockCard.uid}</p>
                    </div>
                  </div>
                  <StatusBadge status={mockCard.subscription.status} />
                </div>
                
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {mockCard.subscription.startDate} - {mockCard.subscription.endDate}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <div className="mt-6 w-full max-w-sm space-y-2">
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <CheckCircle className="mt-0.5 h-4 w-4 text-secondary" />
                <span>Đưa mã QR đến máy quét tại cổng soát vé</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <CheckCircle className="mt-0.5 h-4 w-4 text-secondary" />
                <span>Giữ điện thoại cách máy quét 5-10cm</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <CheckCircle className="mt-0.5 h-4 w-4 text-secondary" />
                <span>Đợi đèn xanh và âm thanh báo hiệu</span>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
