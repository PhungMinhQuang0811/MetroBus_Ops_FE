import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function OperatorControlPackagesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gói cấu hình vận hành</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Màn hình tạo và phát hành gói cấu hình sẽ được cải tạo theo các API control package của afc-ops-service.
      </CardContent>
    </Card>
  )
}
