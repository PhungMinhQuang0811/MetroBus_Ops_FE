"use client"

import { useState } from "react"
import { PWALayout } from "@/components/layouts/pwa-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/status-badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Bus,
  ArrowRight,
  MapPin,
  Calendar,
  CreditCard,
  Wallet,
  Filter
} from "lucide-react"

// Mock data
const mockJourneys = [
  {
    id: "1",
    route: "Tuyến 01",
    from: "Bến Thành",
    to: "Suối Tiên",
    checkIn: "2024-01-15 08:30",
    checkOut: "2024-01-15 09:15",
    fare: 7000,
    status: "COMPLETED"
  },
  {
    id: "2",
    route: "Tuyến 01",
    from: "Suối Tiên",
    to: "Bến Thành",
    checkIn: "2024-01-14 17:45",
    checkOut: "2024-01-14 18:30",
    fare: 7000,
    status: "COMPLETED"
  },
  {
    id: "3",
    route: "Tuyến 02",
    from: "Chợ Lớn",
    to: "Thủ Đức",
    checkIn: "2024-01-13 10:00",
    checkOut: null,
    fare: null,
    status: "CHECK_IN"
  },
]

const mockSubscriptions = [
  {
    id: "1",
    cardUid: "VTC-2024-00001",
    planName: "Vé tháng toàn tuyến",
    startDate: "01/01/2024",
    endDate: "31/01/2024",
    price: 200000,
    status: "ACTIVE"
  },
  {
    id: "2",
    cardUid: "PHY-2023-00542",
    planName: "Vé tháng một tuyến",
    startDate: "01/12/2023",
    endDate: "31/12/2023",
    price: 100000,
    status: "EXPIRED"
  },
]

const mockTransactions = [
  {
    id: "1",
    type: "TOP_UP",
    amount: 100000,
    date: "2024-01-10 14:30",
    status: "SUCCESS",
    description: "Nạp tiền qua VNPay"
  },
  {
    id: "2",
    type: "PURCHASE",
    amount: -200000,
    date: "2024-01-01 09:15",
    status: "SUCCESS",
    description: "Mua vé tháng toàn tuyến"
  },
  {
    id: "3",
    type: "REFUND",
    amount: 15000,
    date: "2023-12-25 11:00",
    status: "SUCCESS",
    description: "Hoàn tiền PSC"
  },
  {
    id: "4",
    type: "TOP_UP",
    amount: 50000,
    date: "2023-12-20 16:45",
    status: "FAILED",
    description: "Nạp tiền qua SePay"
  },
]

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState("journeys")

  return (
    <PWALayout userName="Nguyễn Văn A" walletBalance={150000}>
      <div className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Lịch sử</h1>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Lọc
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="journeys" className="text-xs">Chuyến đi</TabsTrigger>
            <TabsTrigger value="subscriptions" className="text-xs">Vé/Thẻ</TabsTrigger>
            <TabsTrigger value="transactions" className="text-xs">Giao dịch</TabsTrigger>
          </TabsList>

          {/* Journeys Tab */}
          <TabsContent value="journeys" className="mt-4 space-y-3">
            {mockJourneys.map((journey) => (
              <Card key={journey.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Bus className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{journey.route}</p>
                        <StatusBadge status={journey.status} />
                      </div>
                      <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {journey.from}
                        <ArrowRight className="h-3 w-3" />
                        {journey.to || "---"}
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {journey.checkIn}
                        </span>
                        {journey.fare !== null && (
                          <span className="font-medium text-secondary">
                            {journey.fare.toLocaleString("vi-VN")}đ
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions" className="mt-4 space-y-3">
            {mockSubscriptions.map((sub) => (
              <Card key={sub.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{sub.planName}</p>
                        <StatusBadge status={sub.status} />
                      </div>
                      <p className="mt-1 text-xs font-mono text-muted-foreground">
                        {sub.cardUid}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {sub.startDate} - {sub.endDate}
                        </span>
                        <span className="font-medium">
                          {sub.price.toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="mt-4 space-y-3">
            {mockTransactions.map((tx) => (
              <Card key={tx.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      tx.amount > 0 ? "bg-secondary/10 text-secondary" : "bg-muted text-foreground"
                    }`}>
                      <Wallet className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{tx.description}</p>
                        <span className={`font-semibold ${
                          tx.amount > 0 ? "text-secondary" : "text-foreground"
                        }`}>
                          {tx.amount > 0 ? "+" : ""}{tx.amount.toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{tx.date}</span>
                        <StatusBadge status={tx.status} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </PWALayout>
  )
}
