"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StatusBadge } from "@/components/status-badge"
import { ConfirmationModal } from "@/components/confirmation-modal"
import { 
  Bus, 
  CreditCard, 
  MapPin, 
  Truck,
  Building,
  CheckCircle,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"
import { ROUTES } from "@/lib/routes"

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
]

const paymentProviders = [
  { id: "VNPAY_SANDBOX", name: "VNPay" },
  { id: "SEPAY", name: "SePay" },
]

type Step = "form" | "payment" | "success"

export default function PhysicalCardOrderPage() {
  const [step, setStep] = useState<Step>("form")
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Form data
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    citizenId: "",
    plan: "monthly-all",
    deliveryMethod: "pickup",
    pickupStation: "",
    shippingAddress: "",
    paymentProvider: "VNPAY_SANDBOX",
  })

  const [order, setOrder] = useState<{
    orderId: string
    cardUid: string
    status: string
  } | null>(null)

  const selectedPlan = mockPlans.find(p => p.id === formData.plan)
  const cardPrice = 50000 // Physical card cost
  const totalPrice = (selectedPlan?.price || 0) + cardPrice

  const handleSubmit = async () => {
    setLoading(true)
    // Simulate API call: POST /orders/physical-card
    await new Promise(resolve => setTimeout(resolve, 1500))
    setLoading(false)
    setConfirmOpen(false)
    setStep("payment")
  }

  const handlePaymentCallback = async () => {
    setLoading(true)
    // Simulate API call: POST /payments/callback
    await new Promise(resolve => setTimeout(resolve, 1500))
    setLoading(false)
    setOrder({
      orderId: "ORD-" + Date.now().toString().slice(-8),
      cardUid: "PHY-2024-" + Math.random().toString().slice(2, 7),
      status: "PRINTING",
    })
    setStep("success")
  }

  const isFormValid = formData.fullName && formData.phone && formData.citizenId && 
    (formData.deliveryMethod === "pickup" ? formData.pickupStation : formData.shippingAddress)

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

      <main className="mx-auto max-w-2xl p-4">
        {/* Progress Steps */}
        <div className="mb-6 flex items-center justify-center gap-2">
          {["Thông tin", "Thanh toán", "Hoàn tất"].map((label, idx) => {
            const isActive = 
              (idx === 0 && step === "form") ||
              (idx === 1 && step === "payment") ||
              (idx === 2 && step === "success")
            const isDone = 
              (step === "payment" && idx === 0) ||
              (step === "success" && idx < 2)
            return (
              <div key={label} className="flex items-center gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                  isDone ? "bg-secondary text-secondary-foreground" :
                  isActive ? "bg-primary text-primary-foreground" : 
                  "bg-muted text-muted-foreground"
                }`}>
                  {isDone ? <CheckCircle className="h-4 w-4" /> : idx + 1}
                </div>
                <span className={`text-sm ${isActive || isDone ? "font-medium" : "text-muted-foreground"}`}>
                  {label}
                </span>
                {idx < 2 && <div className="h-px w-8 bg-border" />}
              </div>
            )
          })}
        </div>

        {/* Step 1: Form */}
        {step === "form" && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Đặt mua thẻ cứng</CardTitle>
                <CardDescription>
                  Điền thông tin để đặt mua thẻ vật lý MetroBus
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Personal Info */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Họ và tên *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "") })}
                      placeholder="0901234567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="citizenId">Số CCCD *</Label>
                    <Input
                      id="citizenId"
                      value={formData.citizenId}
                      onChange={(e) => setFormData({ ...formData, citizenId: e.target.value.replace(/\D/g, "") })}
                      placeholder="079090123456"
                      maxLength={12}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Plan Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Chọn gói vé</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={formData.plan} 
                  onValueChange={(v) => setFormData({ ...formData, plan: v })}
                >
                  <div className="space-y-3">
                    {mockPlans.map((plan) => (
                      <div
                        key={plan.id}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                          formData.plan === plan.id ? "border-primary bg-primary/5" : "border-border"
                        }`}
                        onClick={() => setFormData({ ...formData, plan: plan.id })}
                      >
                        <RadioGroupItem value={plan.id} id={plan.id} />
                        <div className="flex-1">
                          <Label htmlFor={plan.id} className="cursor-pointer font-medium">
                            {plan.name}
                          </Label>
                          <p className="text-sm text-muted-foreground">{plan.duration} ngày</p>
                        </div>
                        <span className="font-semibold text-primary">
                          {plan.price.toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Delivery Method */}
            <Card>
              <CardHeader>
                <CardTitle>Phương thức nhận thẻ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup 
                  value={formData.deliveryMethod} 
                  onValueChange={(v) => setFormData({ ...formData, deliveryMethod: v })}
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                        formData.deliveryMethod === "pickup" ? "border-primary bg-primary/5" : "border-border"
                      }`}
                      onClick={() => setFormData({ ...formData, deliveryMethod: "pickup" })}
                    >
                      <RadioGroupItem value="pickup" id="pickup" />
                      <MapPin className="h-5 w-5 text-primary" />
                      <div>
                        <Label htmlFor="pickup" className="cursor-pointer font-medium">
                          Nhận tại trạm
                        </Label>
                        <p className="text-xs text-muted-foreground">Miễn phí</p>
                      </div>
                    </div>
                    <div
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                        formData.deliveryMethod === "shipping" ? "border-primary bg-primary/5" : "border-border"
                      }`}
                      onClick={() => setFormData({ ...formData, deliveryMethod: "shipping" })}
                    >
                      <RadioGroupItem value="shipping" id="shipping" />
                      <Truck className="h-5 w-5 text-primary" />
                      <div>
                        <Label htmlFor="shipping" className="cursor-pointer font-medium">
                          Giao hàng
                        </Label>
                        <p className="text-xs text-muted-foreground">+30,000đ</p>
                      </div>
                    </div>
                  </div>
                </RadioGroup>

                {formData.deliveryMethod === "pickup" && (
                  <div className="space-y-2">
                    <Label>Chọn trạm nhận thẻ *</Label>
                    <Select 
                      value={formData.pickupStation}
                      onValueChange={(v) => setFormData({ ...formData, pickupStation: v })}
                    >
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
                )}

                {formData.deliveryMethod === "shipping" && (
                  <div className="space-y-2">
                    <Label htmlFor="address">Địa chỉ giao hàng *</Label>
                    <Input
                      id="address"
                      value={formData.shippingAddress}
                      onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                      placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Provider */}
            <Card>
              <CardHeader>
                <CardTitle>Phương thức thanh toán</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={formData.paymentProvider} 
                  onValueChange={(v) => setFormData({ ...formData, paymentProvider: v })}
                >
                  <div className="space-y-3">
                    {paymentProviders.map((provider) => (
                      <div
                        key={provider.id}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                          formData.paymentProvider === provider.id ? "border-primary bg-primary/5" : "border-border"
                        }`}
                        onClick={() => setFormData({ ...formData, paymentProvider: provider.id })}
                      >
                        <RadioGroupItem value={provider.id} id={provider.id} />
                        <Building className="h-5 w-5" />
                        <Label htmlFor={provider.id} className="cursor-pointer font-medium">
                          {provider.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Tóm tắt đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phí thẻ cứng</span>
                  <span>{cardPrice.toLocaleString("vi-VN")}đ</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{selectedPlan?.name}</span>
                  <span>{selectedPlan?.price.toLocaleString("vi-VN")}đ</span>
                </div>
                {formData.deliveryMethod === "shipping" && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Phí giao hàng</span>
                    <span>30,000đ</span>
                  </div>
                )}
                <div className="border-t border-border pt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Tổng cộng</span>
                    <span className="text-primary">
                      {(totalPrice + (formData.deliveryMethod === "shipping" ? 30000 : 0)).toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button 
              className="w-full" 
              size="lg"
              onClick={() => setConfirmOpen(true)}
              disabled={!isFormValid}
            >
              Tiếp tục thanh toán
            </Button>
          </div>
        )}

        {/* Step 2: Payment */}
        {step === "payment" && (
          <Card>
            <CardContent className="flex flex-col items-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent">
                <CreditCard className="h-8 w-8" />
              </div>
              <h2 className="mt-4 text-xl font-semibold">Chờ thanh toán</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Vui lòng hoàn tất thanh toán qua {paymentProviders.find(p => p.id === formData.paymentProvider)?.name}
              </p>
              <div className="mt-6 w-full max-w-xs rounded-lg bg-muted p-4">
                <p className="text-2xl font-bold text-primary">
                  {(totalPrice + (formData.deliveryMethod === "shipping" ? 30000 : 0)).toLocaleString("vi-VN")}đ
                </p>
              </div>
              <Button className="mt-6 w-full max-w-xs" onClick={handlePaymentCallback} disabled={loading}>
                {loading ? "Đang xử lý..." : "Mô phỏng thanh toán thành công"}
              </Button>
              <Button variant="outline" className="mt-2 w-full max-w-xs" onClick={() => setStep("form")}>
                Quay lại
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Success */}
        {step === "success" && order && (
          <Card>
            <CardContent className="flex flex-col items-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h2 className="mt-4 text-xl font-semibold">Đặt hàng thành công!</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Đơn hàng của bạn đang được xử lý
              </p>
              
              <div className="mt-6 w-full space-y-3 rounded-lg bg-muted p-4 text-left">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Mã đơn hàng</span>
                  <span className="font-mono font-medium">{order.orderId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Mã thẻ</span>
                  <span className="font-mono font-medium">{order.cardUid}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Trạng thái</span>
                  <StatusBadge status={order.status} />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phương thức nhận</span>
                  <span>
                    {formData.deliveryMethod === "pickup" 
                      ? `Nhận tại ${mockStations.find(s => s.id === formData.pickupStation)?.name}`
                      : "Giao hàng"}
                  </span>
                </div>
              </div>
              
              <p className="mt-4 text-sm text-muted-foreground">
                Chúng tôi sẽ liên hệ qua số {formData.phone} khi thẻ sẵn sàng
              </p>
              
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
          title="Xác nhận đơn hàng"
          description={`Bạn sẽ đặt mua thẻ cứng với gói ${selectedPlan?.name}. Tổng thanh toán: ${(totalPrice + (formData.deliveryMethod === "shipping" ? 30000 : 0)).toLocaleString("vi-VN")}đ`}
          confirmText="Xác nhận"
          onConfirm={handleSubmit}
          loading={loading}
        />
      </main>
    </div>
  )
}
