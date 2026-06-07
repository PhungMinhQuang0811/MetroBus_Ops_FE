import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function OperatorPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Operator Back Office</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Các module nghiệp vụ sẽ được bổ sung khi API tương ứng sẵn sàng để tích hợp.
        </p>
      </CardContent>
    </Card>
  )
}
