"use client"

import { ReactNode } from "react"

import { AuthSessionProvider } from "@/components/auth/auth-session-provider"

export default function PassengerLayout({ children }: { children: ReactNode }) {
  return <AuthSessionProvider>{children}</AuthSessionProvider>
}
