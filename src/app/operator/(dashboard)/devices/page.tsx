import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function OperatorDevicesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thiết bị AFC</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Màn hình quản lý danh mục thiết bị AFC sẽ được cải tạo theo API /afc-ops/list-devices.
      </CardContent>
    </Card>
  )
}
