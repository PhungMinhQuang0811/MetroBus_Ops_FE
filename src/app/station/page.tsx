import Link from "next/link"
import { AlertTriangle, RadioTower, Receipt, Signal } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ROUTES } from "@/lib/routes"

const stationStats = [
  { label: "Thiết bị trực tuyến", value: "18/20", icon: Signal },
  { label: "Lượt quét hôm nay", value: "2.418", icon: Receipt },
  { label: "Sự cố đang mở", value: "3", icon: AlertTriangle },
]

const devices = [
  { code: "QR-SCAN-BT-01", status: "ACTIVE", lastHeartbeat: "10 giây trước" },
  { code: "QR-SCAN-BT-02", status: "MAINTENANCE", lastHeartbeat: "2 phút trước" },
  { code: "QR-SCAN-BT-03", status: "OFFLINE", lastHeartbeat: "18 phút trước" },
]

const deviceStatusLabels = {
  ACTIVE: "Đang hoạt động",
  MAINTENANCE: "Đang bảo trì",
  OFFLINE: "Ngoại tuyến",
} as const

export default function StaffDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Vận hành tại trạm</h1>
          <p className="text-muted-foreground">Giám sát thiết bị, giao dịch và sự cố tại trạm Bến Thành.</p>
        </div>
        <Button asChild>
          <Link href={ROUTES.station.incidents}>Ghi nhận sự cố</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stationStats.map((item) => {
          const Icon = item.icon
          return (
            <Card key={item.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{item.label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{item.value}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Trạng thái thiết bị gần đây</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link href={ROUTES.station.deviceStatus}>Xem tất cả</Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {devices.map((device) => (
            <div key={device.code} className="flex items-center justify-between rounded-md border p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <RadioTower className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-mono text-sm font-medium">{device.code}</p>
                  <p className="text-xs text-muted-foreground">Heartbeat: {device.lastHeartbeat}</p>
                </div>
              </div>
              <Badge variant={device.status === "OFFLINE" ? "destructive" : "secondary"}>
                {deviceStatusLabels[device.status as keyof typeof deviceStatusLabels]}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
