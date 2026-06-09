import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ManagerPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tổng quan vận hành</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Các module vận hành cho quản lý sẽ được ghép API theo từng UC tương ứng.
        </p>
      </CardContent>
    </Card>
  )
}
