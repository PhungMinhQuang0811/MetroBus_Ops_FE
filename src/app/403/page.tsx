import { ErrorPage } from "@/components/error-page"

export default function ForbiddenPage() {
  return (
    <ErrorPage
      code="403"
      title="Không có quyền truy cập"
      description="Tài khoản hiện tại không có quyền truy cập nội dung này."
    />
  )
}
