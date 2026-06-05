import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function OperatorIncidentsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sự cố thiết bị</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Màn hình theo dõi sự cố sẽ được cải tạo theo API /afc-ops/search-incidents.
      </CardContent>
    </Card>
  )
}
