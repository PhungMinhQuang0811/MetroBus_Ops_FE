"use client"

import { useState } from "react"
import Link from "next/link"
import { ROUTES } from "@/lib/routes"
import { useRouter } from "next/navigation"
import { Bus, Phone, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

type Step = "phone" | "otp"

export default function PassengerLoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>("phone")
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers.slice(0, 10)
  }

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (phone.length < 10) {
      setError("Vui lòng nhập số điện thoại hợp lệ")
      return
    }

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    setStep("otp")
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (otp.length < 6) {
      setError("Vui lòng nhập đủ 6 số OTP")
      return
    }

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    
    // Mock: OTP 123456 is valid
    if (otp === "123456") {
      router.push(ROUTES.passenger.home)
    } else {
      setError("Mã OTP không chính xác")
    }
  }

  const handleResendOTP = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    setOtp("")
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <div className="bg-primary px-4 pb-12 pt-8 text-primary-foreground">
        <div className="mx-auto max-w-md">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
              <Bus className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold">MetroBus</h1>
              <p className="text-sm text-primary-foreground/80">Vé xe buýt thông minh</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="mx-auto -mt-6 w-full max-w-md px-4 pb-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">
              {step === "phone" ? "Đăng nhập" : "Xác thực OTP"}
            </CardTitle>
            <CardDescription>
              {step === "phone" 
                ? "Nhập số điện thoại để tiếp tục" 
                : `Nhập mã OTP đã gửi đến ${phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3")}`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === "phone" ? (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(formatPhone(e.target.value))
                        setError("")
                      }}
                      placeholder="0912 345 678"
                      className="pl-10"
                      autoComplete="tel"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      Tiếp tục
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Bằng việc tiếp tục, bạn đồng ý với{" "}
                  <Link href={ROUTES.terms} className="text-primary hover:underline">
                    Điều khoản sử dụng
                  </Link>{" "}
                  và{" "}
                  <Link href={ROUTES.privacy} className="text-primary hover:underline">
                    Chính sách bảo mật
                  </Link>
                </p>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label>Mã OTP</Label>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={(value) => {
                        setOtp(value)
                        setError("")
                      }}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <p className="text-center text-xs text-muted-foreground">
                    Demo: nhập 123456
                  </p>
                </div>

                {error && (
                  <p className="text-center text-sm text-destructive">{error}</p>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang xác thực...
                    </>
                  ) : (
                    "Xác nhận"
                  )}
                </Button>

                <div className="flex items-center justify-between">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setStep("phone")
                      setOtp("")
                      setError("")
                    }}
                  >
                    Đổi số điện thoại
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleResendOTP}
                    disabled={isLoading}
                  >
                    Gửi lại OTP
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <Link href={ROUTES.home} className="text-sm text-muted-foreground hover:text-foreground">
            Quay về trang chủ
          </Link>
        </div>
      </div>
    </div>
  )
}
