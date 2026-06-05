import Link from "next/link"
import { AlertTriangle, Boxes, Map, RadioTower, Receipt, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ROUTES } from "@/lib/routes"

const stats = [
  { label: "Nhân sự nội bộ", value: "42", icon: Users, detail: "3 vai trò đang hoạt động" },
  { label: "Tuyến và trạm", value: "18", icon: Map, detail: "6 tuyến, 12 trạm" },
  { label: "Thiết bị trực tuyến", value: "128", icon: RadioTower, detail: "8 thiết bị ngoại tuyến" },
  { label: "Sự cố đang mở", value: "7", icon: AlertTriangle, detail: "2 sự cố ưu tiên cao" },
]

const transactions = [
  { id: "TX-2406-001", station: "Bến Thành", device: "QR-SCAN-01", decision: "OPEN_GATE", sync: "PENDING" },
  { id: "TX-2406-002", station: "Ba Son", device: "QR-SCAN-04", decision: "DENY", sync: "PENDING" },
  { id: "TX-2406-003", station: "Van Thanh", device: "QR-SCAN-02", decision: "OPEN_GATE", sync: "SYNCED" },
]

const decisionLabels = {
  OPEN_GATE: "Mở cổng",
  DENY: "Từ chối",
} as const

const syncLabels = {
  PENDING: "Chờ đồng bộ",
  SYNCED: "Đã đồng bộ",
} as const

export default function OperatorDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tổng quan đơn vị vận hành</h1>
          <p className="text-muted-foreground">Tổng quan hoạt động AFC cấp 4 của đơn vị.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={ROUTES.operator.routes}>Quản lý tuyến và trạm</Link>
          </Button>
          <Button asChild>
            <Link href={ROUTES.operator.controlPackages}>Tạo gói cấu hình</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon
          return (
            <Card key={item.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{item.label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
                <p className="text-xs text-muted-foreground">{item.detail}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Giao dịch gần đây</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href={ROUTES.operator.transactions}>Xem tất cả</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã giao dịch</TableHead>
                  <TableHead>Trạm</TableHead>
                  <TableHead>Thiết bị</TableHead>
                  <TableHead>Quyết định</TableHead>
                  <TableHead>Đồng bộ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-mono text-sm">{transaction.id}</TableCell>
                    <TableCell>{transaction.station}</TableCell>
                    <TableCell>{transaction.device}</TableCell>
                    <TableCell>
                      <Badge variant={transaction.decision === "DENY" ? "destructive" : "secondary"}>
                        {decisionLabels[transaction.decision as keyof typeof decisionLabels]}
                      </Badge>
                    </TableCell>
                    <TableCell>{syncLabels[transaction.sync as keyof typeof syncLabels]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thao tác nhanh</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Button asChild variant="outline" className="justify-start">
              <Link href={ROUTES.operator.employees}>
                <Users className="mr-2 h-4 w-4" />
                Quản lý tài khoản nhân sự
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href={ROUTES.operator.devices}>
                <RadioTower className="mr-2 h-4 w-4" />
                Quản lý thiết bị AFC
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href={ROUTES.operator.incidents}>
                <AlertTriangle className="mr-2 h-4 w-4" />
                Theo dõi sự cố
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href={ROUTES.operator.batches}>
                <Boxes className="mr-2 h-4 w-4" />
                Tạo lô dữ liệu gửi cấp 5
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href={ROUTES.operator.audit}>
                <Receipt className="mr-2 h-4 w-4" />
                Tra cứu nhật ký
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
