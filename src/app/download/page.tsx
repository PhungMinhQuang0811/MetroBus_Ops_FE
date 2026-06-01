"use client"

import Link from "next/link"
import { QRCodeSVG } from "qrcode.react"
import {
  ArrowRight,
  Chrome,
  Download,
  Home,
  Smartphone,
} from "lucide-react"

import { LandingHeader } from "@/components/landing-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { passengerPwaUrl, ROUTES } from "@/lib/routes"

const installSteps = [
  {
    title: "Quét mã QR",
    description: "Dùng camera điện thoại để mở Passenger PWA.",
  },
  {
    title: "Mở menu trình duyệt",
    description: "Trên iPhone dùng Share, trên Android dùng menu Chrome.",
  },
  {
    title: "Thêm vào màn hình chính",
    description: "Chọn Add to Home Screen để dùng như ứng dụng.",
  },
]

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_420px]">
          <section>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <Download className="h-4 w-4" />
              Passenger PWA
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Quét QR để cài MetroBus về điện thoại
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
              Mã QR này mở trực tiếp Passenger PWA. Sau khi mở trên điện thoại,
              thêm trang vào màn hình chính để sử dụng như một ứng dụng.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href={ROUTES.passenger.login}>
                  Mở trên thiết bị này
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={ROUTES.home}>Quay lại trang chủ</Link>
              </Button>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {installSteps.map((step, index) => (
                <Card key={step.title}>
                  <CardContent className="p-5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                      {index + 1}
                    </div>
                    <h2 className="mt-4 font-semibold text-foreground">{step.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border bg-card p-5 shadow-xl">
            <div className="rounded-2xl bg-white p-5">
              <QRCodeSVG
                value={passengerPwaUrl}
                size={320}
                className="h-auto w-full"
                bgColor="#ffffff"
                fgColor="#0066B3"
                includeMargin
              />
            </div>

            <div className="mt-5 text-center">
              <p className="text-base font-semibold text-foreground">Quét bằng camera điện thoại</p>
            </div>

            <div className="mt-5 grid gap-3 rounded-2xl bg-muted p-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <Chrome className="h-4 w-4 text-primary" />
                <span>Android: Chrome menu → Add to Home screen</span>
              </div>
              <div className="flex items-center gap-3">
                <Home className="h-4 w-4 text-primary" />
                <span>iPhone: Share → Add to Home Screen</span>
              </div>
              <div className="flex items-center gap-3">
                <Smartphone className="h-4 w-4 text-primary" />
                <span>Sau khi thêm, mở MetroBus từ màn hình chính.</span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
