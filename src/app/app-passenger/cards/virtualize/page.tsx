"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ConfirmationModal } from "@/components/confirmation-modal"
import { 
  ArrowLeft, 
  CreditCard, 
  Smartphone,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import Link from "next/link"
import { ROUTES } from "@/lib/routes"

export default function VirtualizeCardPage() {
  const [cardUid, setCardUid] = useState("")
  const [citizenId, setCitizenId] = useState("")
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [newVirtualCard, setNewVirtualCard] = useState<{ uid: string } | null>(null)

  const handleVirtualize = async () => {
    setLoading(true)
    setError("")
    
    // Simulate API call: POST /cards/virtualize-card
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Simulate validation
    if (cardUid !== "PHY-2023-00001" && cardUid !== "PHY-2023-00002") {
      setLoading(false)
      setConfirmOpen(false)
      setError("Mã thẻ không hợp lệ hoặc thẻ đã được ảo hóa trước đó")
      return
    }
    
    if (citizenId !== "079090123456") {
      setLoading(false)
      setConfirmOpen(false)
      setError("Số CCCD không khớp với thông tin đăng ký thẻ")
      return
    }
    
    setLoading(false)
    setConfirmOpen(false)
    setSuccess(true)
    setNewVirtualCard({
      uid: "VTC-2024-" + Math.random().toString().slice(2, 7),
    })
  }

  if (success && newVirtualCard) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <Card className="w-full max-w-sm">
          <CardContent className="flex flex-col items-center py-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10 text-secondary">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h2 className="mt-4 text-xl font-semibold">Ảo hóa thành công!</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Thẻ cứng đã được chuyển thành thẻ ảo
            </p>
            
            <div className="mt-6 w-full space-y-3 rounded-lg bg-muted p-4 text-left">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Thẻ cứng cũ</span>
                <span className="font-mono text-muted-foreground line-through">{cardUid}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Thẻ ảo mới</span>
                <span className="font-mono font-medium text-primary">{newVirtualCard.uid}</span>
              </div>
            </div>
            
            <div className="mt-4 rounded-lg border border-accent bg-accent/10 p-3 text-sm text-accent-foreground">
              <AlertCircle className="mb-1 inline h-4 w-4" />
              <span className="ml-1">Thẻ cứng sẽ không còn sử dụng được sau khi ảo hóa</span>
            </div>
            
            <div className="mt-6 flex w-full gap-2">
              <Link href={ROUTES.passenger.qr} className="flex-1">
                <Button className="w-full">Hiện QR</Button>
              </Link>
              <Link href={ROUTES.passenger.cards} className="flex-1">
                <Button variant="outline" className="w-full">Xem thẻ</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center gap-4 border-b border-border bg-card px-4 py-3">
        <Link href={ROUTES.passenger.cards}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-lg font-semibold">Ảo hóa thẻ cứng</h1>
      </header>

      <div className="space-y-4 p-4">
        {/* Info Card */}
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="flex items-start gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">Ảo hóa thẻ cứng là gì?</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Chuyển đổi thẻ vật lý thành thẻ ảo trên điện thoại. Bạn có thể quét mã QR thay vì mang theo thẻ cứng.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Thông tin thẻ cứng
            </CardTitle>
            <CardDescription>
              Nhập thông tin thẻ cứng để chuyển đổi sang thẻ ảo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardUid">Mã thẻ (UID)</Label>
              <Input
                id="cardUid"
                placeholder="VD: PHY-2023-00001"
                value={cardUid}
                onChange={(e) => {
                  setCardUid(e.target.value.toUpperCase())
                  setError("")
                }}
              />
              <p className="text-xs text-muted-foreground">
                Tìm mã thẻ ở mặt sau thẻ cứng
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="citizenId">Số CCCD/CMND</Label>
              <Input
                id="citizenId"
                placeholder="Nhập số CCCD đã đăng ký thẻ"
                value={citizenId}
                onChange={(e) => {
                  setCitizenId(e.target.value.replace(/\D/g, ""))
                  setError("")
                }}
                maxLength={12}
              />
              <p className="text-xs text-muted-foreground">
                Số CCCD phải khớp với thông tin khi mua thẻ
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Warning */}
        <Card className="border-accent bg-accent/10">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 shrink-0 text-accent" />
              <div className="text-sm">
                <p className="font-medium text-foreground">Lưu ý quan trọng</p>
                <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                  <li>Thẻ cứng sẽ bị vô hiệu hóa sau khi ảo hóa</li>
                  <li>Không thể hoàn tác thao tác này</li>
                  <li>Số dư và vé còn hiệu lực sẽ được chuyển sang thẻ ảo</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        <Button 
          className="w-full" 
          size="lg"
          onClick={() => setConfirmOpen(true)}
          disabled={!cardUid || !citizenId}
        >
          Ảo hóa thẻ
        </Button>

        {/* Demo hint */}
        <p className="text-center text-xs text-muted-foreground">
          Demo: Mã thẻ <span className="font-mono font-medium">PHY-2023-00001</span>, CCCD <span className="font-mono font-medium">079090123456</span>
        </p>

        {/* Confirmation Modal */}
        <ConfirmationModal
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title="Xác nhận ảo hóa thẻ"
          description={`Thẻ ${cardUid} sẽ được chuyển thành thẻ ảo. Thẻ cứng sẽ không còn sử dụng được. Bạn có chắc chắn?`}
          confirmText="Xác nhận ảo hóa"
          onConfirm={handleVirtualize}
          loading={loading}
        />
      </div>
    </div>
  )
}
