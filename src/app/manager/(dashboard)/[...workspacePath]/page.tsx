import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ManagerWorkspacePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Chức năng vận hành</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Màn hình này thuộc workspace quản lý và sẽ được ghép API khi UC tương ứng sẵn sàng.
        </p>
      </CardContent>
    </Card>
  )
}
