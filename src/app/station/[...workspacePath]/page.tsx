import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function StationWorkspacePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vận hành tại trạm</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Màn hình này thuộc workspace station và chỉ hiển thị dữ liệu trong station được phân quyền.
        </p>
      </CardContent>
    </Card>
  )
}
