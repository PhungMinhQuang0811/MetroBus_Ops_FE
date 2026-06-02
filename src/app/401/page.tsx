import { ErrorPage } from "@/components/error-page"

export default function UnauthorizedPage() {
  return (
    <ErrorPage
      code="401"
      title="Bạn cần đăng nhập"
      description="Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại để tiếp tục."
    />
  )
}
