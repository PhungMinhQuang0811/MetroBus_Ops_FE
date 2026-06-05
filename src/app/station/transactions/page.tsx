import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AUTH_ROLE_LABELS, AUTH_ROLES } from "@/lib/auth/constants"

export default function StaffTransactionsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Giao dịch tại trạm</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Màn hình tra cứu giao dịch cho {AUTH_ROLE_LABELS[AUTH_ROLES.STATION_OPERATOR]} sẽ được cải tạo theo API /afc-ops/search-transactions.
      </CardContent>
    </Card>
  )
}
