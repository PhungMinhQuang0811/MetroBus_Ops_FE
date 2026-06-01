"use client"

import { useState } from "react"
import { PWALayout } from "@/components/layouts/pwa-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/status-badge"
import { ConfirmationModal } from "@/components/confirmation-modal"
import { 
  CreditCard, 
  Plus,
  QrCode,
  RefreshCw,
  Smartphone,
  AlertCircle
} from "lucide-react"
import Link from "next/link"
import { ROUTES } from "@/lib/routes"

// Mock data
const mockCards = [
  {
    uid: "VTC-2024-00001",
    type: "VIRTUAL",
    medium: "QR_CODE",
    status: "ACTIVE" as const,
    subscription: {
      planName: "Vé tháng toàn tuyến",
      startDate: "01/01/2024",
      endDate: "31/01/2024",
      status: "ACTIVE" as const,
    }
  },
  {
    uid: "PHY-2023-00542",
    type: "PHYSICAL",
    medium: "NFC",
    status: "VIRTUALIZED" as const,
    virtualizedTo: "VTC-2024-00001",
    subscription: null
  },
]

export default function CardsPage() {
  const [showRevokeModal, setShowRevokeModal] = useState(false)
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const activeVirtualCard = mockCards.find(c => c.type === "VIRTUAL" && c.status === "ACTIVE")
  const hasNoCards = mockCards.length === 0

  const handleRevokeCard = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
    setShowRevokeModal(false)
    // In real app, refresh card list
  }

  return (
    <PWALayout userName="Nguyễn Văn A" walletBalance={150000}>
      <div className="space-y-4 p-4">
        {/* Header actions */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Thẻ của tôi</h1>
          {!activeVirtualCard && (
            <Link href={ROUTES.passenger.cardsNew}>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Mua thẻ mới
              </Button>
            </Link>
          )}
        </div>

        {/* No cards state */}
        {hasNoCards && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <CreditCard className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mt-4 font-semibold">Chưa có thẻ</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Mua thẻ ảo hoặc ảo hóa thẻ cứng để bắt đầu
              </p>
              <div className="mt-6 flex gap-2">
                <Link href={ROUTES.passenger.cardsNew}>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Mua thẻ ảo
                  </Button>
                </Link>
                <Link href={ROUTES.passenger.cardsVirtualize}>
                  <Button variant="outline" className="gap-2">
                    <Smartphone className="h-4 w-4" />
                    Ảo hóa thẻ
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cards list */}
        {mockCards.map((card) => (
          <Card 
            key={card.uid}
            className={card.status === "ACTIVE" ? "border-primary" : ""}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {card.type === "VIRTUAL" ? (
                    <QrCode className="h-5 w-5 text-primary" />
                  ) : (
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                  )}
                  <CardTitle className="text-base">
                    {card.type === "VIRTUAL" ? "Thẻ ảo" : "Thẻ cứng"}
                  </CardTitle>
                </div>
                <StatusBadge status={card.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Mã thẻ</span>
                <span className="font-mono font-medium">{card.uid}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Loại</span>
                <span>{card.medium === "QR_CODE" ? "QR Code" : "NFC"}</span>
              </div>
              
              {card.subscription && (
                <>
                  <div className="border-t border-border pt-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Gói vé</span>
                      <span className="font-medium">{card.subscription.planName}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Hiệu lực</span>
                      <span>
                        {card.subscription.startDate} - {card.subscription.endDate}
                      </span>
                    </div>
                  </div>
                </>
              )}

              {card.virtualizedTo && (
                <div className="flex items-center gap-2 rounded-lg bg-muted p-2 text-xs text-muted-foreground">
                  <AlertCircle className="h-4 w-4" />
                  <span>Đã ảo hóa sang thẻ {card.virtualizedTo}</span>
                </div>
              )}

              {/* Card actions */}
              {card.status === "ACTIVE" && card.type === "VIRTUAL" && (
                <div className="flex gap-2 pt-2">
                  <Link href={ROUTES.passenger.qr} className="flex-1">
                    <Button className="w-full gap-2">
                      <QrCode className="h-4 w-4" />
                      Hiện QR
                    </Button>
                  </Link>
                  <Link href={ROUTES.passenger.cardsRenew}>
                    <Button variant="outline" size="icon">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link href={ROUTES.passenger.cardsVirtualize}>
            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <CardContent className="flex flex-col items-center p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <Smartphone className="h-5 w-5" />
                </div>
                <span className="mt-2 text-center text-xs font-medium">Ảo hóa thẻ cứng</span>
              </CardContent>
            </Card>
          </Link>
          
          <Link href={ROUTES.passenger.cardsRenew}>
            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <CardContent className="flex flex-col items-center p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                  <RefreshCw className="h-5 w-5" />
                </div>
                <span className="mt-2 text-center text-xs font-medium">Gia hạn vé</span>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Revoke Modal */}
        <ConfirmationModal
          open={showRevokeModal}
          onOpenChange={setShowRevokeModal}
          title="Thu hồi thẻ"
          description="Bạn có chắc chắn muốn thu hồi thẻ này? Hành động này không thể hoàn tác."
          confirmText="Thu hồi"
          onConfirm={handleRevokeCard}
          variant="destructive"
          loading={loading}
        />
      </div>
    </PWALayout>
  )
}
