import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit và truy vết</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Màn hình audit sẽ được ghép API khi UC21 sẵn sàng. Admin dùng menu Tài khoản nhân sự để quản lý account.
        </p>
      </CardContent>
    </Card>
  )
}
