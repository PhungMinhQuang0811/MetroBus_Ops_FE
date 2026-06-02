import Link from "next/link"
import { ArrowLeft, Bus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ROUTES } from "@/lib/routes"

interface ErrorPageProps {
  code: string
  title: string
  description: string
}

export function ErrorPage({ code, title, description }: ErrorPageProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Bus className="h-7 w-7" />
        </div>
        <p className="mt-8 text-sm font-semibold text-primary">Lỗi {code}</p>
        <h1 className="mt-2 text-3xl font-bold text-foreground">{title}</h1>
        <p className="mt-3 text-muted-foreground">{description}</p>
        <Button asChild className="mt-8">
          <Link href={ROUTES.home}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay về trang chủ
          </Link>
        </Button>
      </div>
    </main>
  )
}
