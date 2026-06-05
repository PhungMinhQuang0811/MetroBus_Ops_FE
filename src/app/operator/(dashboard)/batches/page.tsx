import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function OperatorBatchesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lô dữ liệu</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Màn hình tạo và gửi lô dữ liệu lên cấp 5 sẽ được cải tạo theo API /afc-ops/create-batch và /afc-ops/submit-batch-to-level5.
      </CardContent>
    </Card>
  )
}
