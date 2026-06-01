"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { StatusBadge } from "@/components/status-badge"
import { ConfirmationModal } from "@/components/confirmation-modal"
import { 
  Bus, 
  CreditCard, 
  Building,
  CheckCircle,
  ArrowLeft,
  AlertCircle,
  Calendar
} from "lucide-react"
import Link from "next/link"
import { ROUTES } from "@/lib/routes"

// Mock data
const mockPlans = [
  {
    id: "monthly-all",
    name: "Vé tháng toàn tuyến",
    price: 200000,
    duration: 30,
  },
  {
    id: "monthly-single",
    name: "Vé tháng một tuyến",
    price: 100000,
    duration: 30,
  },
  {
    id: "weekly",
    name: "Vé tuần",
    price: 70000,
    duration: 7,
  },
]

const paymentProviders = [
  { id: "VNPAY_SANDBOX", name: "VNPay" },
  { id: "SEPAY", name: "SePay" },
]

type Step = "search" | "select" | "payment" | "success"

export default function GuestRenewSubscriptionPage() {
  const [step, setStep] = useState<Step>("search")
  const [cardUid, setCardUid] = useState("")
  const [cardInfo, setCardInfo] = useState<{
    uid: string
    currentPlan: string | null
    currentEndDate: string | null
    status: string
  } | null>(null)
  const [selectedPlan, setSelectedPlan] = useState("monthly-all")
  const [paymentProvider, setPaymentProvider] = useState("VNPAY_SANDBOX")
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [newEndDate, setNewEndDate] = useState("")

  const plan = mockPlans.find(p => p.id === selectedPlan)

  const handleSearchCard = async () => {
    setLoading(true)
    setError("")
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Demo validation
    if (cardUid.startsWith("PHY-") || cardUid.startsWith("VTC-")) {
      setCardInfo({
        uid: cardUid,
        currentPlan: "Vé tháng toàn tuyến",
        currentEndDate: "15/01/2024",
        status: "ACTIVE",
      })
      setStep("select")
    } else {
      setError("Không tìm thấy thẻ. Vui lòng kiểm tra lại mã thẻ.")
    }
    
    setLoading(false)
  }

  const handleSubmit = async () => {
    setLoading(true)
    // Simulate API call: POST /subscriptions/guest-renew-subscription
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
    setConfirmOpen(false)
    setStep("payment")
  }

  const handlePaymentCallback = async () => {
    setLoading(true)
    // Simulate API call: POST /payments/callback
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Calculate new end date
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + (plan?.duration || 30))
    setNewEndDate(endDate.toLocaleDateString("vi-VN"))
    
    setLoading(false)
    setStep("success")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-card px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href={ROUTES.home}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Bus className="h-5 w-5" />
            </div>
            <span className="font-semibold">MetroBus</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg p-4">
        {/* Step 1: Search Card */}
        {step === "search" && (
          <Card>
            <CardHeader>
              <CardTitle>Gia hạn vé</CardTitle>
              <CardDescription>
                Nhập mã thẻ để gia hạn gói vé của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardUid">Mã thẻ (UID)</Label>
                <Input
                  id="cardUid"
                  value={cardUid}
                  onChange={(e) => {
                    setCardUid(e.target.value.toUpperCase())
                    setError("")
                  }}
                  placeholder="VD: PHY-2023-00001 hoặc VTC-2024-00001"
                />
                <p className="text-xs text-muted-foreground">
                  Tìm mã thẻ ở mặt sau thẻ cứng hoặc trong app
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              <Button 
                className="w-full" 
                onClick={handleSearchCard}
                disabled={!cardUid || loading}
              >
                {loading ? "Đang tìm kiếm..." : "Tìm thẻ"}
              </Button>

              {/* Demo hint */}
              <p className="text-center text-xs text-muted-foreground">
                Demo: Nhập mã bắt đầu bằng <span className="font-mono font-medium">PHY-</span> hoặc <span className="font-mono font-medium">VTC-</span>
              </p>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Select Plan */}
        {step === "select" && cardInfo && (
          <div className="space-y-4">
            {/* Current Card Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Thông tin thẻ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Mã thẻ</span>
                  <span className="font-mono font-medium">{cardInfo.uid}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Trạng thái</span>
                  <StatusBadge status={cardInfo.status} />
                </div>
                {cardInfo.currentPlan && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Gói vé hiện tại</span>
                      <span>{cardInfo.currentPlan}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Hết hạn</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {cardInfo.currentEndDate}
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Plan Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Chọn gói gia hạn</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan}>
                  <div className="space-y-3">
                    {mockPlans.map((p) => (
                      <div
                        key={p.id}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                          selectedPlan === p.id ? "border-primary bg-primary/5" : "border-border"
                        }`}
                        onClick={() => setSelectedPlan(p.id)}
                      >
                        <RadioGroupItem value={p.id} id={`plan-${p.id}`} />
                        <div className="flex-1">
                          <Label htmlFor={`plan-${p.id}`} className="cursor-pointer font-medium">
                            {p.name}
                          </Label>
                          <p className="text-sm text-muted-foreground">{p.duration} ngày</p>
                        </div>
                        <span className="font-semibold text-primary">
                          {p.price.toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Payment Provider */}
            <Card>
              <CardHeader>
                <CardTitle>Phương thức thanh toán</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentProvider} onValueChange={setPaymentProvider}>
                  <div className="space-y-3">
                    {paymentProviders.map((provider) => (
                      <div
                        key={provider.id}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                          paymentProvider === provider.id ? "border-primary bg-primary/5" : "border-border"
                        }`}
                        onClick={() => setPaymentProvider(provider.id)}
                      >
                        <RadioGroupItem value={provider.id} id={`provider-${provider.id}`} />
                        <Building className="h-5 w-5" />
                        <Label htmlFor={`provider-${provider.id}`} className="cursor-pointer font-medium">
                          {provider.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between font-semibold">
                  <span>Tổng thanh toán</span>
                  <span className="text-primary">{plan?.price.toLocaleString("vi-VN")}đ</span>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep("search")}>
                Quay lại
              </Button>
              <Button className="flex-1" onClick={() => setConfirmOpen(true)}>
                Thanh toán
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === "payment" && (
          <Card>
            <CardContent className="flex flex-col items-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent">
                <CreditCard className="h-8 w-8" />
              </div>
              <h2 className="mt-4 text-xl font-semibold">Chờ thanh toán</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Vui lòng hoàn tất thanh toán qua {paymentProviders.find(p => p.id === paymentProvider)?.name}
              </p>
              <div className="mt-6 w-full max-w-xs rounded-lg bg-muted p-4">
                <p className="text-2xl font-bold text-primary">
                  {plan?.price.toLocaleString("vi-VN")}đ
                </p>
              </div>
              <Button className="mt-6 w-full max-w-xs" onClick={handlePaymentCallback} disabled={loading}>
                {loading ? "Đang xử lý..." : "Mô phỏng thanh toán thành công"}
              </Button>
              <Button variant="outline" className="mt-2 w-full max-w-xs" onClick={() => setStep("select")}>
                Quay lại
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Success */}
        {step === "success" && (
          <Card>
            <CardContent className="flex flex-col items-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h2 className="mt-4 text-xl font-semibold">Gia hạn thành công!</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Gói vé của bạn đã được gia hạn
              </p>
              
              <div className="mt-6 w-full space-y-3 rounded-lg bg-muted p-4 text-left">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Mã thẻ</span>
                  <span className="font-mono font-medium">{cardInfo?.uid}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Gói vé</span>
                  <span className="font-medium">{plan?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Hết hạn mới</span>
                  <span className="font-medium text-secondary">{newEndDate}</span>
                </div>
              </div>
              
              <Link href={ROUTES.home} className="mt-6 w-full max-w-xs">
                <Button variant="outline" className="w-full">
                  Về trang chủ
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Confirmation Modal */}
        <ConfirmationModal
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title="Xác nhận gia hạn"
          description={`Bạn sẽ gia hạn thẻ ${cardInfo?.uid} với gói ${plan?.name}. Thanh toán: ${plan?.price.toLocaleString("vi-VN")}đ`}
          confirmText="Xác nhận"
          onConfirm={handleSubmit}
          loading={loading}
        />
      </main>
    </div>
  )
}
