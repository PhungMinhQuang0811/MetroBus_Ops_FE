"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Bus, Eye, EyeOff, Loader2, Lock, Phone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"
import { identityApi } from "@/lib/api"
import { AuthNextStep } from "@/lib/api/dto/identity"
import { AUTH_MESSAGES, getApiErrorMessage } from "@/lib/messages"
import { ROUTES } from "@/lib/routes"

const PassengerAuthStep = {
  PHONE: "phone",
  PASSWORD: "password",
  OTP: "otp",
  SET_PASSWORD: "set-password",
} as const

type Step = (typeof PassengerAuthStep)[keyof typeof PassengerAuthStep]

function formatPhone(value: string) {
  return value.replace(/\D/g, "").slice(0, 10)
}

function displayPhone(phone: string) {
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3")
}

function isValidPassword(password: string) {
  return password.length >= 9 && /[A-Za-z]/.test(password) && /\d/.test(password)
}

export default function PassengerLoginPage() {
  const [step, setStep] = useState<Step>(PassengerAuthStep.PHONE)
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [registrationToken, setRegistrationToken] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const resetToPhoneStep = () => {
    setStep(PassengerAuthStep.PHONE)
    setPassword("")
    setConfirmPassword("")
    setOtp("")
    setRegistrationToken("")
    setError("")
  }

  const handleCheckPhone = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")

    if (phone.length !== 10) {
      setError(AUTH_MESSAGES.invalidPhone)
      return
    }

    setIsLoading(true)

    try {
      const response = await identityApi.checkPhone({ phoneNumber: phone })
      setPhone(response.result.phoneNumber)

      if (response.result.nextStep === AuthNextStep.PASSWORD_LOGIN) {
        setStep(PassengerAuthStep.PASSWORD)
      } else {
        setStep(PassengerAuthStep.OTP)
      }
    } catch (error) {
      setError(getApiErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")

    if (!password) {
      setError(AUTH_MESSAGES.missingPassword)
      return
    }

    setIsLoading(true)

    try {
      await identityApi.login({ identifier: phone, password })
      window.location.assign(ROUTES.passenger.home)
    } catch (error) {
      setError(getApiErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")

    if (otp.length !== 6) {
      setError(AUTH_MESSAGES.invalidOtpLength)
      return
    }

    setIsLoading(true)

    try {
      const response = await identityApi.verifyOtp({ phoneNumber: phone, otp })
      setRegistrationToken(response.result.registrationToken)
      setStep(PassengerAuthStep.SET_PASSWORD)
    } catch (error) {
      setError(getApiErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")

    if (!isValidPassword(password)) {
      setError(AUTH_MESSAGES.weakPassword)
      return
    }

    if (password !== confirmPassword) {
      setError(AUTH_MESSAGES.passwordMismatch)
      return
    }

    setIsLoading(true)

    try {
      await identityApi.setPassword({ registrationToken, password })
      window.location.assign(ROUTES.passenger.home)
    } catch (error) {
      setError(getApiErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setError("")
    setIsLoading(true)

    try {
      await identityApi.checkPhone({ phoneNumber: phone })
      setOtp("")
    } catch (error) {
      setError(getApiErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }

  const titleByStep: Record<Step, string> = {
    [PassengerAuthStep.PHONE]: "Đăng nhập",
    [PassengerAuthStep.PASSWORD]: "Nhập mật khẩu",
    [PassengerAuthStep.OTP]: "Xác thực số điện thoại",
    [PassengerAuthStep.SET_PASSWORD]: "Tạo mật khẩu",
  }

  const descriptionByStep: Record<Step, string> = {
    [PassengerAuthStep.PHONE]: "Nhập số điện thoại để tiếp tục",
    [PassengerAuthStep.PASSWORD]: `Đăng nhập bằng số điện thoại ${displayPhone(phone)}`,
    [PassengerAuthStep.OTP]: `Nhập mã OTP đã gửi đến ${displayPhone(phone)}`,
    [PassengerAuthStep.SET_PASSWORD]: "Tạo mật khẩu để hoàn tất đăng ký tài khoản passenger",
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
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

      <div className="mx-auto -mt-6 w-full max-w-md px-4 pb-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">{titleByStep[step]}</CardTitle>
            <CardDescription>{descriptionByStep[step]}</CardDescription>
          </CardHeader>
          <CardContent>
            {step === PassengerAuthStep.PHONE && (
              <form onSubmit={handleCheckPhone} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(event) => {
                        setPhone(formatPhone(event.target.value))
                        setError("")
                      }}
                      placeholder="0912 345 678"
                      className="pl-10"
                      autoComplete="tel"
                    />
                  </div>
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang kiểm tra...
                    </>
                  ) : (
                    <>
                      Tiếp tục
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

              </form>
            )}

            {step === PassengerAuthStep.PASSWORD && (
              <form onSubmit={handleLogin} className="space-y-4">
                <PasswordField
                  id="password"
                  label="Mật khẩu"
                  value={password}
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword((value) => !value)}
                  onChange={(value) => {
                    setPassword(value)
                    setError("")
                  }}
                />

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang đăng nhập...
                    </>
                  ) : (
                    "Đăng nhập"
                  )}
                </Button>

                <BackButton onClick={resetToPhoneStep} />
              </form>
            )}

            {step === PassengerAuthStep.OTP && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
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
                </div>

                {error && <p className="text-center text-sm text-destructive">{error}</p>}

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
                  <Button type="button" variant="ghost" size="sm" onClick={resetToPhoneStep}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Đổi số điện thoại
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={handleResendOtp} disabled={isLoading}>
                    Gửi lại OTP
                  </Button>
                </div>
              </form>
            )}

            {step === PassengerAuthStep.SET_PASSWORD && (
              <form onSubmit={handleSetPassword} className="space-y-4">
                <PasswordField
                  id="new-password"
                  label="Mật khẩu"
                  value={password}
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword((value) => !value)}
                  onChange={(value) => {
                    setPassword(value)
                    setError("")
                  }}
                />
                <PasswordField
                  id="confirm-password"
                  label="Xác nhận mật khẩu"
                  value={confirmPassword}
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword((value) => !value)}
                  onChange={(value) => {
                    setConfirmPassword(value)
                    setError("")
                  }}
                />

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang tạo tài khoản...
                    </>
                  ) : (
                    "Hoàn tất đăng ký"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link href={ROUTES.home} className="text-sm text-muted-foreground hover:text-foreground">
            Quay về trang chủ
          </Link>
        </div>
      </div>
    </div>
  )
}

interface PasswordFieldProps {
  id: string
  label: string
  value: string
  showPassword: boolean
  onTogglePassword: () => void
  onChange: (value: string) => void
}

function PasswordField({ id, label, value, showPassword, onTogglePassword, onChange }: PasswordFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Nhập mật khẩu"
          className="pl-10 pr-10"
          autoComplete={id === "password" ? "current-password" : "new-password"}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
          onClick={onTogglePassword}
        >
          {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
        </Button>
      </div>
    </div>
  )
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <Button type="button" variant="ghost" size="sm" className="w-full" onClick={onClick}>
      <ArrowLeft className="mr-2 h-4 w-4" />
      Đổi số điện thoại
    </Button>
  )
}
