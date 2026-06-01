"use client"

import { useState } from "react"
import { PWALayout } from "@/components/layouts/pwa-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { StatusBadge } from "@/components/status-badge"
import { ConfirmationModal } from "@/components/confirmation-modal"
import { 
  Wallet, 
  Plus, 
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Building,
  Clock
} from "lucide-react"

// Mock data
const mockWallet = {
  balance: 150000,
  pendingBalance: 0,
}

const mockTransactions = [
  {
    id: "1",
    type: "TOP_UP",
    amount: 100000,
    provider: "VNPAY_SANDBOX",
    date: "28/12/2024 14:30",
    status: "SUCCESS"
  },
  {
    id: "2",
    type: "PURCHASE",
    amount: -200000,
    description: "Mua vé tháng toàn tuyến",
    date: "01/01/2024 09:15",
    status: "SUCCESS"
  },
  {
    id: "3",
    type: "TOP_UP",
    amount: 50000,
    provider: "SEPAY",
    date: "25/12/2024 16:45",
    status: "FAILED"
  },
  {
    id: "4",
    type: "REFUND",
    amount: 15000,
    description: "Hoàn tiền PSC",
    date: "20/12/2024 11:00",
    status: "SUCCESS"
  },
]

const topUpAmounts = [50000, 100000, 200000, 500000]
const paymentProviders = [
  { id: "VNPAY_SANDBOX", name: "VNPay", icon: CreditCard },
  { id: "SEPAY", name: "SePay", icon: Building },
]

export default function WalletPage() {
  const [showTopUp, setShowTopUp] = useState(false)
  const [topUpAmount, setTopUpAmount] = useState<number>(100000)
  const [customAmount, setCustomAmount] = useState("")
  const [provider, setProvider] = useState("VNPAY_SANDBOX")
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleTopUp = async () => {
    setLoading(true)
    // Simulate API call: POST /wallets/create-top-up
    await new Promise(resolve => setTimeout(resolve, 1500))
    setLoading(false)
    setConfirmOpen(false)
    setShowTopUp(false)
    // In real app, redirect to payment provider
    alert("Chuyển hướng đến cổng thanh toán...")
  }

  const finalAmount = customAmount ? parseInt(customAmount) : topUpAmount

  return (
    <PWALayout userName="Nguyễn Văn A" walletBalance={mockWallet.balance}>
      <div className="space-y-4 p-4">
        {/* Wallet Balance Card */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-primary to-primary-dark p-6 text-primary-foreground">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                <Wallet className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm opacity-80">Số dư khả dụng</p>
                <p className="text-3xl font-bold">
                  {mockWallet.balance.toLocaleString("vi-VN")}đ
                </p>
              </div>
            </div>
            {mockWallet.pendingBalance > 0 && (
              <div className="mt-3 flex items-center gap-2 text-sm opacity-80">
                <Clock className="h-4 w-4" />
                <span>Đang xử lý: {mockWallet.pendingBalance.toLocaleString("vi-VN")}đ</span>
              </div>
            )}
          </div>
          <CardContent className="p-4">
            <Button 
              className="w-full gap-2" 
              onClick={() => setShowTopUp(!showTopUp)}
            >
              <Plus className="h-4 w-4" />
              Nạp tiền
            </Button>
          </CardContent>
        </Card>

        {/* Top Up Form */}
        {showTopUp && (
          <Card>
            <CardHeader>
              <CardTitle>Nạp tiền vào ví</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Amount selection */}
              <div className="space-y-2">
                <Label>Chọn số tiền</Label>
                <div className="grid grid-cols-2 gap-2">
                  {topUpAmounts.map((amount) => (
                    <Button
                      key={amount}
                      variant={topUpAmount === amount && !customAmount ? "default" : "outline"}
                      onClick={() => {
                        setTopUpAmount(amount)
                        setCustomAmount("")
                      }}
                      className="h-12"
                    >
                      {amount.toLocaleString("vi-VN")}đ
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom amount */}
              <div className="space-y-2">
                <Label>Hoặc nhập số tiền khác</Label>
                <Input
                  type="number"
                  placeholder="Nhập số tiền (tối thiểu 10,000đ)"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  min={10000}
                />
              </div>

              {/* Payment provider */}
              <div className="space-y-2">
                <Label>Phương thức thanh toán</Label>
                <RadioGroup value={provider} onValueChange={setProvider}>
                  {paymentProviders.map((p) => (
                    <div
                      key={p.id}
                      className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                        provider === p.id ? "border-primary bg-primary/5" : "border-border"
                      }`}
                      onClick={() => setProvider(p.id)}
                    >
                      <RadioGroupItem value={p.id} id={p.id} />
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <p.icon className="h-5 w-5" />
                      </div>
                      <Label htmlFor={p.id} className="cursor-pointer font-medium">
                        {p.name}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Summary */}
              <div className="rounded-lg bg-muted p-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Số tiền nạp</span>
                  <span className="font-semibold">{finalAmount.toLocaleString("vi-VN")}đ</span>
                </div>
              </div>

              <Button 
                className="w-full"
                onClick={() => setConfirmOpen(true)}
                disabled={finalAmount < 10000}
              >
                Tiếp tục thanh toán
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle>Lịch sử giao dịch</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockTransactions.map((tx) => (
              <div 
                key={tx.id}
                className="flex items-center gap-3 rounded-lg border border-border p-3"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  tx.amount > 0 ? "bg-secondary/10 text-secondary" : "bg-muted text-foreground"
                }`}>
                  {tx.amount > 0 ? (
                    <ArrowDownLeft className="h-5 w-5" />
                  ) : (
                    <ArrowUpRight className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {tx.type === "TOP_UP" && "Nạp tiền"}
                    {tx.type === "PURCHASE" && tx.description}
                    {tx.type === "REFUND" && tx.description}
                  </p>
                  <p className="text-xs text-muted-foreground">{tx.date}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${
                    tx.amount > 0 ? "text-secondary" : "text-foreground"
                  }`}>
                    {tx.amount > 0 ? "+" : ""}{tx.amount.toLocaleString("vi-VN")}đ
                  </p>
                  <StatusBadge status={tx.status} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Confirmation Modal */}
        <ConfirmationModal
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title="Xác nhận nạp tiền"
          description={`Bạn sẽ nạp ${finalAmount.toLocaleString("vi-VN")}đ vào ví qua ${
            paymentProviders.find(p => p.id === provider)?.name
          }. Tiếp tục?`}
          confirmText="Thanh toán"
          onConfirm={handleTopUp}
          loading={loading}
        />
      </div>
    </PWALayout>
  )
}
