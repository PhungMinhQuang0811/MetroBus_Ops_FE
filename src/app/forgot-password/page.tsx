"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bus, ArrowLeft, Mail, CheckCircle } from "lucide-react"
import Link from "next/link"
import { ROUTES } from "@/lib/routes"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setError("Vui lòng nhập email")
      return
    }

    setLoading(true)
    setError("")

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Bus className="h-10 w-10" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-foreground">MetroBus AFC</h1>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Quên mật khẩu</CardTitle>
            <CardDescription>
              {submitted 
                ? "Kiểm tra email của bạn"
                : "Nhập email để nhận link đặt lại mật khẩu"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="space-y-4">
                <div className="flex flex-col items-center gap-3 py-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-center text-sm text-muted-foreground">
                    Chúng tôi đã gửi email hướng dẫn đặt lại mật khẩu đến <span className="font-medium text-foreground">{email}</span>
                  </p>
                  <p className="text-center text-xs text-muted-foreground">
                    Vui lòng kiểm tra hộp thư (bao gồm thư mục spam)
                  </p>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSubmitted(false)
                    setEmail("")
                  }}
                >
                  Gửi lại email
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        setError("")
                      }}
                      placeholder="Nhập email đăng ký"
                      className="pl-10"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Đang gửi..." : "Gửi link đặt lại mật khẩu"}
                </Button>
              </form>
            )}

            <div className="mt-4 text-center">
              <Link 
                href={ROUTES.home} 
                className="inline-flex items-center text-sm text-primary hover:underline"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Quay lại trang chủ
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
