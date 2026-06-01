"use client"

import { useState } from "react"
import { PWALayout } from "@/components/layouts/pwa-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { StatusBadge } from "@/components/status-badge"
import { ConfirmationModal } from "@/components/confirmation-modal"
import { 
  CreditCard, 
  Calendar,
  Wallet,
  CheckCircle,
  AlertCircle,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"
import { ROUTES } from "@/lib/routes"

// Mock data
const mockPlans = [
  {
    id: "monthly-all",
    name: "Vé tháng toàn tuyến",
    description: "Đi không giới hạn trên tất cả các tuyến",
    price: 200000,
    duration: 30,
    popular: true,
  },
  {
    id: "monthly-single",
    name: "Vé tháng một tuyến",
    description: "Đi không giới hạn trên một tuyến chỉ định",
    price: 100000,
    duration: 30,
    popular: false,
  },
  {
    id: "weekly",
    name: "Vé tuần",
    description: "Đi không giới hạn trong 7 ngày",
    price: 70000,
    duration: 7,
    popular: false,
  },
]

const mockWallet = {
  balance: 150000,
}

const mockKycStatus = "VERIFIED"

export default function NewCardPage() {
  const [selectedPlan, setSelectedPlan] = useState(mockPlans[0].id)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [newCard, setNewCard] = useState<{ uid: string; endDate: string } | null>(null)

  const plan = mockPlans.find(p => p.id === selectedPlan)
  const insufficientBalance = (plan?.price || 0) > mockWallet.balance
  const kycIncomplete = mockKycStatus !== "VERIFIED"

  const handleIssueCard = async () => {
    setLoading(true)
    // Simulate API call: POST /cards/create-virtual-card
    await new Promise(resolve => setTimeout(resolve, 1500))
    setLoading(false)
    setConfirmOpen(false)
    setSuccess(true)
    setNewCard({
      uid: "VTC-2024-" + Math.random().toString().slice(2, 7),
      endDate: new Date(Date.now() + (plan?.duration || 30) * 24 * 60 * 60 * 1000).toLocaleDateString("vi-VN"),
    })
  }

  if (success && newCard) {
    return (
      <PWALayout userName="Nguyễn Văn A" walletBalance={mockWallet.balance - (plan?.price || 0)} showHeader={false}>
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <Card className="w-full max-w-sm">
            <CardContent className="flex flex-col items-center py-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h2 className="mt-4 text-xl font-semibold">Mua thẻ thành công!</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Thẻ ảo của bạn đã được kích hoạt
              </p>
              
              <div className="mt-6 w-full space-y-3 rounded-lg bg-muted p-4 text-left">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Mã thẻ</span>
                  <span className="font-mono font-medium">{newCard.uid}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Gói vé</span>
                  <span className="font-medium">{plan?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Hết hạn</span>
                  <span>{newCard.endDate}</span>
                </div>
              </div>
              
              <div className="mt-6 flex w-full gap-2">
                <Link href={ROUTES.passenger.qr} className="flex-1">
                  <Button className="w-full">Hiện QR</Button>
                </Link>
                <Link href={ROUTES.passenger.home} className="flex-1">
                  <Button variant="outline" className="w-full">Về trang chủ</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </PWALayout>
    )
  }

  return (
    <PWALayout userName="Nguyễn Văn A" walletBalance={mockWallet.balance} showHeader={false}>
      <div className="min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-50 flex items-center gap-4 border-b border-border bg-card px-4 py-3">
          <Link href={ROUTES.passenger.cards}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Mua thẻ ảo</h1>
        </header>

        <div className="space-y-4 p-4">
          {/* KYC Warning */}
          {kycIncomplete && (
            <Card className="border-destructive bg-destructive/10">
              <CardContent className="flex items-center gap-3 p-4">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Chưa xác thực KYC</p>
                  <p className="text-xs text-muted-foreground">
                    Vui lòng hoàn tất xác thực để mua thẻ
                  </p>
                </div>
                <Link href={ROUTES.passenger.profile}>
                  <Button size="sm" variant="outline">
                    Xác thực
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Plan Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Chọn gói vé</CardTitle>
              <CardDescription>Chọn loại vé phù hợp với nhu cầu của bạn</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan}>
                <div className="space-y-3">
                  {mockPlans.map((p) => (
                    <div
                      key={p.id}
                      className={`relative flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
                        selectedPlan === p.id ? "border-primary bg-primary/5" : "border-border"
                      }`}
                      onClick={() => setSelectedPlan(p.id)}
                    >
                      <RadioGroupItem value={p.id} id={p.id} className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Label htmlFor={p.id} className="cursor-pointer font-medium">
                            {p.name}
                          </Label>
                          {p.popular && (
                            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                              Phổ biến
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
                        <div className="mt-2 flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {p.duration} ngày
                          </span>
                        </div>
                      </div>
                      <p className="text-lg font-semibold text-primary">
                        {p.price.toLocaleString("vi-VN")}đ
                      </p>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Thanh toán từ ví
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Số dư ví</span>
                <span className="font-medium">{mockWallet.balance.toLocaleString("vi-VN")}đ</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Giá vé</span>
                <span className="font-medium">-{plan?.price.toLocaleString("vi-VN")}đ</span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Số dư còn lại</span>
                  <span className={`font-semibold ${insufficientBalance ? "text-destructive" : "text-secondary"}`}>
                    {(mockWallet.balance - (plan?.price || 0)).toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>
              
              {insufficientBalance && (
                <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>Số dư không đủ. Vui lòng nạp thêm tiền.</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Button */}
          <Button 
            className="w-full" 
            size="lg"
            onClick={() => setConfirmOpen(true)}
            disabled={insufficientBalance || kycIncomplete}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Mua thẻ ảo
          </Button>

          {insufficientBalance && (
            <Link href={ROUTES.passenger.wallet}>
              <Button variant="outline" className="w-full">
                Nạp tiền vào ví
              </Button>
            </Link>
          )}
        </div>

        {/* Confirmation Modal */}
        <ConfirmationModal
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title="Xác nhận mua thẻ"
          description={`Bạn sẽ mua ${plan?.name} với giá ${plan?.price.toLocaleString("vi-VN")}đ. Số tiền sẽ được trừ từ ví của bạn.`}
          confirmText="Xác nhận mua"
          onConfirm={handleIssueCard}
          loading={loading}
        />
      </div>
    </PWALayout>
  )
}
