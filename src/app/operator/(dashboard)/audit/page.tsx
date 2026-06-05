import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function OperatorAuditPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nhật ký truy vết</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Màn hình truy vết sẽ được cải tạo theo API tìm kiếm nhật ký của auth/afc-ops.
      </CardContent>
    </Card>
  )
}
