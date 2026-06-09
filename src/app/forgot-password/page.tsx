"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { AlertCircle, ArrowLeft, Bus, CheckCircle2, KeyRound } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { identityApi } from "@/lib/api/services/identity"
import { getApiErrorMessage } from "@/lib/messages"
import { ROUTES } from "@/lib/routes"

export default function ForgotPasswordPage() {
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [requestedUsername, setRequestedUsername] = useState("")

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    const trimmedUsername = username.trim()
    if (!trimmedUsername) {
      setError("Vui lòng nhập username.")
      return
    }

    setLoading(true)
    setError("")
    setRequestedUsername("")

    try {
      const response = await identityApi.forgotPassword({ username: trimmedUsername })
      setRequestedUsername(response.result.username)
      setUsername("")
    } catch (error) {
      setError(getApiErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Bus className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">MetroBus AFC</span>
        </div>

        <Card>
          <CardHeader className="space-y-2 pb-4">
            <div className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl">Quên mật khẩu</CardTitle>
            </div>
            <CardDescription>
              Gửi yêu cầu để quản trị viên cấp lại mật khẩu tạm cho tài khoản nội bộ.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {requestedUsername && (
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    Đã gửi yêu cầu reset cho {requestedUsername}. Vui lòng liên hệ quản trị viên để nhận mật khẩu tạm.
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(event) => {
                    setUsername(event.target.value)
                    setError("")
                    setRequestedUsername("")
                  }}
                  placeholder="station01"
                  autoComplete="username"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Đang gửi yêu cầu..." : "Gửi yêu cầu reset"}
              </Button>

              <Button asChild type="button" variant="ghost" className="w-full">
                <Link href={ROUTES.login}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Quay lại đăng nhập
                </Link>
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
