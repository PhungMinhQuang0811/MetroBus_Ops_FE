import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AUTH_ROLE_LABELS, AUTH_ROLES } from "@/lib/auth/constants"

export default function StaffDeviceStatusPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trạng thái thiết bị tại trạm</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Màn hình giám sát thiết bị cho {AUTH_ROLE_LABELS[AUTH_ROLES.STATION_OPERATOR]} sẽ được cải tạo theo API trạng thái thiết bị.
      </CardContent>
    </Card>
  )
}
