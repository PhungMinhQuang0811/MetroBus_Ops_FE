"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LandingHeader } from "@/components/landing-header"
import { ROUTES } from "@/lib/routes"
import { 
  Bus, 
  Smartphone, 
  QrCode, 
  Wallet, 
  CreditCard, 
  History,
  Shield,
  Zap,
  Globe,
  ArrowRight,
  CheckCircle2,
  Building2,
  Users,
  BarChart3
} from "lucide-react"

const features = [
  {
    icon: QrCode,
    title: "Thanh toán QR Code",
    description: "Quét mã QR để lên xe nhanh chóng, không cần tiền mặt"
  },
  {
    icon: Wallet,
    title: "Ví điện tử",
    description: "Nạp tiền và quản lý số dư trực tiếp trên ứng dụng"
  },
  {
    icon: CreditCard,
    title: "Thẻ thông minh",
    description: "Hỗ trợ cả thẻ vật lý và thẻ ảo trên điện thoại"
  },
  {
    icon: History,
    title: "Lịch sử chuyến đi",
    description: "Theo dõi tất cả chuyến đi và giao dịch của bạn"
  },
  {
    icon: Shield,
    title: "Bảo mật cao",
    description: "Dữ liệu được mã hóa và bảo vệ an toàn"
  },
  {
    icon: Zap,
    title: "Xử lý tức thì",
    description: "Giao dịch được xử lý trong vài giây"
  }
]

const solutions = [
  {
    icon: Smartphone,
    title: "Hành khách",
    description: "Ứng dụng di động quản lý vé, ví và chuyến đi",
    href: ROUTES.passenger.login,
    color: "bg-primary"
  },
  {
    icon: Building2,
    title: "Doanh nghiệp",
    description: "Quản lý thẻ nhân viên và theo dõi chi phí",
    href: ROUTES.login,
    color: "bg-secondary"
  },
  {
    icon: Users,
    title: "Đơn vị vận hành",
    description: "Quản lý tuyến, trạm và biểu giá",
    href: ROUTES.login,
    color: "bg-accent"
  },
  {
    icon: BarChart3,
    title: "Nền tảng",
    description: "Đối soát và quản lý đa đơn vị vận hành",
    href: ROUTES.login,
    color: "bg-primary"
  }
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <LandingHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                <span className="text-primary">Vé xe buýt & Metro</span>
                <br />
                thông minh
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                Hệ thống thanh toán tự động hiện đại cho giao thông công cộng. 
                Quét QR, chạm thẻ hoặc sử dụng ví điện tử - tất cả trong một ứng dụng.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <Link href={ROUTES.download}>
                  <Button size="lg" className="w-full sm:w-auto">
                    <Smartphone className="mr-2 h-5 w-5" />
                    Bắt đầu ngay
                  </Button>
                </Link>
                <Link href={ROUTES.guest.physicalCardOrder}>
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Đặt thẻ vật lý
                  </Button>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground lg:justify-start">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-secondary" />
                  <span>Miễn phí đăng ký</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-secondary" />
                  <span>Hỗ trợ 24/7</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-secondary" />
                  <span>An toàn & Bảo mật</span>
                </div>
              </div>
            </div>

            {/* Phone mockup */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative">
                {/* Phone frame */}
                <div className="relative h-[500px] w-[250px] rounded-[40px] border-4 border-foreground/10 bg-card p-2 shadow-2xl">
                  <div className="absolute left-1/2 top-4 h-6 w-20 -translate-x-1/2 rounded-full bg-foreground/10" />
                  <div className="h-full w-full overflow-hidden rounded-[32px] bg-primary/10">
                    {/* App screen content */}
                    <div className="flex h-full flex-col">
                      <div className="bg-primary p-4 text-primary-foreground">
                        <p className="text-xs opacity-80">Xin chào,</p>
                        <p className="font-semibold">Nguyễn Văn A</p>
                      </div>
                      <div className="flex-1 p-4 space-y-4">
                        <div className="rounded-xl bg-card p-4 shadow-sm">
                          <p className="text-xs text-muted-foreground">Số dư ví</p>
                          <p className="text-2xl font-bold text-foreground">150.000đ</p>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="flex flex-col items-center gap-1 rounded-lg bg-card p-3">
                            <QrCode className="h-5 w-5 text-primary" />
                            <span className="text-xs">QR Code</span>
                          </div>
                          <div className="flex flex-col items-center gap-1 rounded-lg bg-card p-3">
                            <Wallet className="h-5 w-5 text-primary" />
                            <span className="text-xs">Nạp tiền</span>
                          </div>
                          <div className="flex flex-col items-center gap-1 rounded-lg bg-card p-3">
                            <History className="h-5 w-5 text-primary" />
                            <span className="text-xs">Lịch sử</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-muted-foreground">Chuyến đi gần đây</p>
                          <div className="rounded-lg bg-card p-3 shadow-sm">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium">Tuyến 01</p>
                                <p className="text-xs text-muted-foreground">Bến Thành - Bình Tây</p>
                              </div>
                              <p className="text-sm font-medium text-secondary">-7.000đ</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -left-4 top-20 h-20 w-20 rounded-full bg-primary/20 blur-2xl" />
                <div className="absolute -right-4 bottom-20 h-24 w-24 rounded-full bg-secondary/20 blur-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Tất cả trong một ứng dụng
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              MetroBus AFC mang đến trải nghiệm di chuyển thuận tiện với đầy đủ tính năng hiện đại
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title} className="border-0 bg-card/50 shadow-sm transition-all hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-foreground">{feature.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="bg-card py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Giải pháp cho mọi đối tượng
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Từ hành khách cá nhân đến doanh nghiệp và đơn vị vận hành
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {solutions.map((solution) => {
              const Icon = solution.icon
              return (
                <Link key={solution.title} href={solution.href}>
                  <Card className="group h-full cursor-pointer transition-all hover:shadow-lg hover:border-primary/50">
                    <CardContent className="p-6">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${solution.color}`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-foreground">{solution.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{solution.description}</p>
                      <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                        Truy cập
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary-foreground sm:text-4xl">
            Sẵn sàng trải nghiệm?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
            Quét QR bằng điện thoại để mở Passenger PWA và thêm vào màn hình chính
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href={ROUTES.download}>
              <Button size="lg" variant="secondary">
                <Smartphone className="mr-2 h-5 w-5" />
                Tải ứng dụng
              </Button>
            </Link>
            <Link href={ROUTES.guest.physicalCardOrder}>
              <Button
                size="lg"
                className="border border-primary-foreground bg-primary-foreground text-primary shadow-sm hover:bg-primary-foreground/90 hover:text-primary"
              >
                <CreditCard className="mr-2 h-5 w-5" />
                Đặt thẻ vật lý
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Link href={ROUTES.home} className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Bus className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold text-foreground">MetroBus</span>
              </Link>
              <p className="mt-4 text-sm text-muted-foreground">
                Hệ thống vé xe buýt & Metro và thanh toán tự động thông minh
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground">Sản phẩm</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li><Link href={ROUTES.download} className="text-muted-foreground hover:text-foreground">Ứng dụng di động</Link></li>
                <li><Link href={ROUTES.guest.physicalCardOrder} className="text-muted-foreground hover:text-foreground">Thẻ vật lý</Link></li>
                <li><Link href={ROUTES.guest.renewSubscription} className="text-muted-foreground hover:text-foreground">Vé tháng</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground">Doanh nghiệp</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li><Link href={ROUTES.login} className="text-muted-foreground hover:text-foreground">Đăng nhập</Link></li>
                <li><Link href={ROUTES.login} className="text-muted-foreground hover:text-foreground">Quản lý thẻ</Link></li>
                <li><Link href={ROUTES.login} className="text-muted-foreground hover:text-foreground">Báo cáo</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground">Hỗ trợ</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li><span className="text-muted-foreground">Hotline: 1900 1234</span></li>
                <li><span className="text-muted-foreground">Email: support@metrobus.vn</span></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 MetroBus AFC. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
