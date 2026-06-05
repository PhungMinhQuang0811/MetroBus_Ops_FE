import Link from "next/link"
import {
  AlertTriangle,
  BarChart3,
  Boxes,
  Building2,
  CheckCircle2,
  LayoutDashboard,
  Map,
  RadioTower,
  Receipt,
  ShieldCheck,
} from "lucide-react"

import { LandingHeader } from "@/components/landing-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AUTH_ROLE_LABELS, AUTH_ROLES } from "@/lib/auth/constants"
import { ROUTES } from "@/lib/routes"

const features = [
  {
    icon: LayoutDashboard,
    title: "Tổng quan vận hành",
    description: "Theo dõi giao dịch, sự cố và tình trạng thiết bị trong phạm vi đơn vị vận hành.",
  },
  {
    icon: Map,
    title: "Danh mục tuyến và trạm",
    description: "Quản lý cấu trúc mạng lưới, tuyến, trạm và điểm vận hành của đơn vị.",
  },
  {
    icon: RadioTower,
    title: "Giám sát thiết bị AFC",
    description: "Theo dõi trạng thái trực tuyến, ngoại tuyến, bảo trì và vô hiệu hóa từ dữ liệu heartbeat.",
  },
  {
    icon: Receipt,
    title: "Tra cứu giao dịch",
    description: "Lọc, đối chiếu và xem chi tiết lượt quét phục vụ công tác vận hành.",
  },
  {
    icon: AlertTriangle,
    title: "Theo dõi sự cố",
    description: "Ghi nhận và xử lý sự cố thiết bị theo phạm vi trạm hoặc toàn đơn vị.",
  },
  {
    icon: Boxes,
    title: "Gói cấu hình vận hành",
    description: "Tạo và phát hành gói cấu hình vận hành xuống hệ thống cấp 3.",
  },
]

const roles = [
  `${AUTH_ROLE_LABELS[AUTH_ROLES.OPERATOR_ADMIN]} quản lý tài khoản nội bộ và phân quyền trong đơn vị.`,
  `${AUTH_ROLE_LABELS[AUTH_ROLES.OPERATOR_MANAGER]} theo dõi vận hành cấp 4 và điều phối dữ liệu.`,
  `${AUTH_ROLE_LABELS[AUTH_ROLES.STATION_OPERATOR]} giám sát thiết bị, giao dịch và sự cố tại trạm.`,
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />

      <section className="border-b bg-muted/30">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              AFC Level 3 / Level 4 Operations
            </div>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Trung tâm quản trị đơn vị vận hành MetroBus
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Hệ thống tập trung cho quản trị tuyến, trạm, thiết bị AFC, giao dịch vận hành,
              sự cố, gói cấu hình, lô dữ liệu và nhật ký trong phạm vi đơn vị khai thác.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href={ROUTES.login}>Đăng nhập hệ thống</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={ROUTES.operator.home}>Mở trang quản trị</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3 border-b pb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Phạm vi đơn vị vận hành</p>
                <p className="text-sm text-muted-foreground">Nghiệp vụ AFC cấp 3 và cấp 4</p>
              </div>
            </div>
            <div className="mt-5 space-y-4">
              {roles.map((role) => (
                <div key={role} className="flex gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-18">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-foreground">Chức năng trong phạm vi</h2>
            <p className="mt-3 text-muted-foreground">
              Tập trung vào nghiệp vụ vận hành, không bao gồm ứng dụng hành khách, ví,
              thanh toán, phân chia bù trừ hay quyết toán.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title} className="shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-semibold text-foreground">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section id="solutions" className="border-t bg-card py-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Sẵn sàng triển khai theo tài liệu mới</h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Mã nguồn hiện tập trung vào hai phân hệ chính: quản trị đơn vị cấp 4 và vận hành trạm cấp 3.
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild>
              <Link href={ROUTES.operator.home}>Quản trị đơn vị</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={ROUTES.station.home}>Vận hành trạm</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
