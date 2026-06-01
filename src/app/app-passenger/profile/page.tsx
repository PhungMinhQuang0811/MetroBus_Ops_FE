"use client"

import { useState } from "react"
import { PWALayout } from "@/components/layouts/pwa-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { StatusBadge } from "@/components/status-badge"
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  CreditCard as IdCard,
  MapPin,
  CheckCircle,
  AlertCircle,
  Shield
} from "lucide-react"

// Mock data
const mockProfile = {
  phoneNumber: "0901234567",
  fullName: "Nguyễn Văn A",
  email: "nguyenvana@email.com",
  emailVerified: true,
  dateOfBirth: "1990-01-15",
  citizenId: "079090******",
  address: "123 Nguyễn Huệ, Q.1, TP.HCM",
  kycStatus: "VERIFIED" as const,
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState(mockProfile)
  const [loading, setLoading] = useState(false)
  const [emailOtpSent, setEmailOtpSent] = useState(false)
  const [emailOtp, setEmailOtp] = useState("")

  const handleSave = async () => {
    setLoading(true)
    // Simulate API call: PUT /user/me
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
    setIsEditing(false)
  }

  const handleSendEmailOtp = async () => {
    setLoading(true)
    // Simulate API call: POST /user/verify-email
    await new Promise(resolve => setTimeout(resolve, 1000))
    setEmailOtpSent(true)
    setLoading(false)
  }

  const handleVerifyEmail = async () => {
    setLoading(true)
    // Simulate API call: POST /user/verify-email
    await new Promise(resolve => setTimeout(resolve, 1000))
    setProfile({ ...profile, emailVerified: true })
    setEmailOtpSent(false)
    setLoading(false)
  }

  return (
    <PWALayout userName={profile.fullName} walletBalance={150000}>
      <div className="space-y-4 p-4">
        {/* KYC Status Card */}
        <Card className={profile.kycStatus === "VERIFIED" ? "border-secondary" : "border-accent"}>
          <CardContent className="flex items-center gap-4 p-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
              profile.kycStatus === "VERIFIED" ? "bg-secondary/10 text-secondary" : "bg-accent/10 text-accent"
            }`}>
              {profile.kycStatus === "VERIFIED" ? (
                <CheckCircle className="h-6 w-6" />
              ) : (
                <AlertCircle className="h-6 w-6" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium">Trạng thái xác thực</p>
                <StatusBadge status={profile.kycStatus} />
              </div>
              <p className="text-sm text-muted-foreground">
                {profile.kycStatus === "VERIFIED" 
                  ? "Tài khoản đã được xác thực đầy đủ"
                  : "Hoàn tất thông tin để xác thực tài khoản"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Profile Form */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Thông tin cá nhân</CardTitle>
              <CardDescription>Quản lý thông tin hồ sơ của bạn</CardDescription>
            </div>
            {!isEditing ? (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Chỉnh sửa
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setIsEditing(false)}>
                  Hủy
                </Button>
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? "Đang lưu..." : "Lưu"}
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Phone - readonly */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Số điện thoại
              </Label>
              <Input 
                value={profile.phoneNumber} 
                disabled 
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">Số điện thoại không thể thay đổi</p>
            </div>

            {/* Full name */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Họ và tên
              </Label>
              <Input 
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                disabled={!isEditing}
                placeholder="Nhập họ và tên"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
                {profile.emailVerified && (
                  <span className="flex items-center gap-1 text-xs text-secondary">
                    <CheckCircle className="h-3 w-3" />
                    Đã xác thực
                  </span>
                )}
              </Label>
              <div className="flex gap-2">
                <Input 
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  disabled={!isEditing || profile.emailVerified}
                  placeholder="Nhập email"
                  className="flex-1"
                />
                {!profile.emailVerified && !emailOtpSent && (
                  <Button 
                    variant="outline" 
                    onClick={handleSendEmailOtp}
                    disabled={loading || !profile.email}
                  >
                    Xác thực
                  </Button>
                )}
              </div>
              
              {/* Email OTP verification */}
              {emailOtpSent && !profile.emailVerified && (
                <div className="mt-2 rounded-lg border border-border p-3">
                  <p className="mb-2 text-sm text-muted-foreground">
                    Nhập mã OTP đã gửi đến email của bạn
                  </p>
                  <div className="flex gap-2">
                    <Input 
                      value={emailOtp}
                      onChange={(e) => setEmailOtp(e.target.value)}
                      placeholder="Nhập mã OTP"
                      maxLength={6}
                      className="flex-1"
                    />
                    <Button onClick={handleVerifyEmail} disabled={loading || emailOtp.length !== 6}>
                      {loading ? "..." : "Xác nhận"}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Date of birth */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Ngày sinh
              </Label>
              <Input 
                type="date"
                value={profile.dateOfBirth}
                onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            {/* Citizen ID */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <IdCard className="h-4 w-4" />
                Số CCCD/CMND
              </Label>
              <Input 
                value={profile.citizenId}
                onChange={(e) => setProfile({ ...profile, citizenId: e.target.value })}
                disabled={!isEditing}
                placeholder="Nhập số CCCD/CMND"
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Địa chỉ
              </Label>
              <Input 
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                disabled={!isEditing}
                placeholder="Nhập địa chỉ"
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Bảo mật
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="font-medium">Xác thực hai yếu tố</p>
                <p className="text-sm text-muted-foreground">Bảo vệ tài khoản với OTP</p>
              </div>
              <StatusBadge status="ACTIVE" />
            </div>
            <Button variant="outline" className="w-full">
              Đăng xuất tất cả thiết bị
            </Button>
          </CardContent>
        </Card>
      </div>
    </PWALayout>
  )
}
