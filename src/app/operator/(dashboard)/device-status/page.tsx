import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function OperatorDeviceStatusPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trạng thái thiết bị</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Màn hình giám sát heartbeat và trạng thái thiết bị sẽ được cải tạo theo API /afc-ops/get-device-status.
      </CardContent>
    </Card>
  )
}
