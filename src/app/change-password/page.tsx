"use client"

import { FormEvent, useEffect, useState } from "react"
import { AlertCircle, ArrowLeft, Bus, Eye, EyeOff, KeyRound, LogOut } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { accountApi, identityApi } from "@/lib/api"
import {
  clearStoredPasswordStatus,
  getStoredPasswordStatus,
  requiresPasswordChange,
  storePasswordStatus,
} from "@/lib/auth/password-status"
import { clearStoredAuthSession, getHomeRouteForRoles, getStoredAuthSession } from "@/lib/auth/session"
import { getApiErrorMessage } from "@/lib/messages"
import { ROUTES } from "@/lib/routes"

type PasswordField = "currentPassword" | "newPassword" | "confirmPassword"

function isValidPassword(password: string) {
  return password.length >= 9 && /[A-Za-z]/.test(password) && /\d/.test(password)
}

function PasswordInput({
  id,
  value,
  onChange,
  visible,
  onToggleVisible,
  autoComplete,
}: {
  id: PasswordField
  value: string
  onChange: (value: string) => void
  visible: boolean
  onToggleVisible: () => void
  autoComplete: string
}) {
  return (
    <div className="relative">
      <Input
        id={id}
        type={visible ? "text" : "password"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="pr-10"
        autoComplete={autoComplete}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
        onClick={onToggleVisible}
        aria-label={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
      >
        {visible ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
      </Button>
    </div>
  )
}

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [visibleFields, setVisibleFields] = useState<Record<PasswordField, boolean>>({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  })
  const [forcedChange, setForcedChange] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    setForcedChange(requiresPasswordChange(getStoredPasswordStatus()))
  }, [])

  const toggleVisible = (field: PasswordField) => {
    setVisibleFields((current) => ({
      ...current,
      [field]: !current[field],
    }))
  }

  const resetError = () => setError("")

  const handleBackToWorkspace = () => {
    window.location.assign(getHomeRouteForRoles(getStoredAuthSession()?.roles))
  }

  const handleLogout = async () => {
    if (loading) return

    setLoading(true)

    try {
      await identityApi.logout()
    } finally {
      clearStoredPasswordStatus()
      clearStoredAuthSession()
      window.location.assign(ROUTES.login)
    }
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin đổi mật khẩu.")
      return
    }

    if (!isValidPassword(newPassword)) {
      setError("Mật khẩu mới phải có ít nhất 9 ký tự và bao gồm cả chữ lẫn số.")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await accountApi.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      })

      storePasswordStatus(response.result.passwordStatus)
      window.location.assign(getHomeRouteForRoles(getStoredAuthSession()?.roles))
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
              <CardTitle className="text-xl">Đổi mật khẩu</CardTitle>
            </div>
            <CardDescription>
              {forcedChange
                ? "Bạn phải đổi mật khẩu trước khi sử dụng hệ thống."
                : "Cập nhật mật khẩu tài khoản nội bộ của bạn."}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {forcedChange && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Tài khoản đang dùng mật khẩu tạm. Vui lòng đặt mật khẩu mới để tiếp tục.
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
                <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                <PasswordInput
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(value) => {
                    setCurrentPassword(value)
                    resetError()
                  }}
                  visible={visibleFields.currentPassword}
                  onToggleVisible={() => toggleVisible("currentPassword")}
                  autoComplete="current-password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Mật khẩu mới</Label>
                <PasswordInput
                  id="newPassword"
                  value={newPassword}
                  onChange={(value) => {
                    setNewPassword(value)
                    resetError()
                  }}
                  visible={visibleFields.newPassword}
                  onToggleVisible={() => toggleVisible("newPassword")}
                  autoComplete="new-password"
                />
                <p className="text-xs text-muted-foreground">
                  Ít nhất 9 ký tự, bao gồm cả chữ và số.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <PasswordInput
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(value) => {
                    setConfirmPassword(value)
                    resetError()
                  }}
                  visible={visibleFields.confirmPassword}
                  onToggleVisible={() => toggleVisible("confirmPassword")}
                  autoComplete="new-password"
                />
              </div>

              <div className="flex gap-3 pt-2">
                {forcedChange ? (
                  <Button type="button" variant="outline" className="flex-1" disabled={loading} onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Đăng xuất
                  </Button>
                ) : (
                  <Button type="button" variant="outline" className="flex-1" disabled={loading} onClick={handleBackToWorkspace}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Quay lại
                  </Button>
                )}
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? "Đang cập nhật..." : "Cập nhật"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
