import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function StaffIncidentsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sự cố tại trạm</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Màn hình ghi nhận và theo dõi sự cố tại trạm sẽ được cải tạo theo API sự cố của afc-ops-service.
      </CardContent>
    </Card>
  )
}
