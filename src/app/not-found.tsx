import { ErrorPage } from "@/components/error-page"

export default function NotFoundPage() {
  return (
    <ErrorPage
      code="404"
      title="Không tìm thấy trang"
      description="Đường dẫn bạn truy cập không tồn tại hoặc đã được thay đổi."
    />
  )
}
