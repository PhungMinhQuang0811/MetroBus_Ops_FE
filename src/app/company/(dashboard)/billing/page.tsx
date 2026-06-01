"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Wallet,
  CreditCard,
  Receipt,
  Download,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react"

// Mock data
const mockBillingInfo = {
  companyName: "Công ty ABC",
  balance: 15000000,
  creditLimit: 50000000,
  lastPayment: "2024-03-01",
  dueDate: "2024-03-31",
  outstandingAmount: 8500000
}

const mockInvoices = [
  {
    id: "INV-2024-003",
    period: "Tháng 3/2024",
    amount: 8500000,
    status: "pending",
    dueDate: "2024-03-31",
    createdAt: "2024-03-01"
  },
  {
    id: "INV-2024-002",
    period: "Tháng 2/2024",
    amount: 7200000,
    status: "paid",
    dueDate: "2024-02-29",
    paidAt: "2024-02-25"
  },
  {
    id: "INV-2024-001",
    period: "Tháng 1/2024",
    amount: 6800000,
    status: "paid",
    dueDate: "2024-01-31",
    paidAt: "2024-01-28"
  },
]

const mockTopUpRequests = [
  {
    id: "REQ001",
    amount: 5000000,
    requestedBy: "Nguyen Manager",
    status: "pending",
    createdAt: "2024-03-15 10:30"
  },
  {
    id: "REQ002",
    amount: 10000000,
    requestedBy: "Nguyen Manager",
    status: "approved",
    createdAt: "2024-03-10 14:00",
    approvedAt: "2024-03-10 15:30"
  },
]

export default function CompanyBillingPage() {
  const [isTopUpDialogOpen, setIsTopUpDialogOpen] = useState(false)
  const [topUpAmount, setTopUpAmount] = useState("")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Đã thanh toán</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Chờ thanh toán</Badge>
      case "overdue":
        return <Badge className="bg-red-100 text-red-800">Quá hạn</Badge>
      case "approved":
        return <Badge className="bg-blue-100 text-blue-800">Đã duyệt</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleTopUpRequest = () => {
    console.log("Top up request:", topUpAmount)
    setIsTopUpDialogOpen(false)
    setTopUpAmount("")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Thanh toán & Công nợ</h1>
          <p className="text-muted-foreground">Quản lý tài khoản và thanh toán doanh nghiệp</p>
        </div>
        <Dialog open={isTopUpDialogOpen} onOpenChange={setIsTopUpDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground">
              <Plus className="mr-2 h-4 w-4" />
              Yêu cầu nạp tiền
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yêu cầu nạp tiền tài khoản</DialogTitle>
              <DialogDescription>
                Gửi yêu cầu nạp tiền vào tài khoản doanh nghiệp
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="rounded-lg bg-muted p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Số dư hiện tại:</span>
                  <span className="font-bold">{mockBillingInfo.balance.toLocaleString("vi-VN")} VND</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Hạn mức tín dụng:</span>
                  <span className="font-medium">{mockBillingInfo.creditLimit.toLocaleString("vi-VN")} VND</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Số tiền cần nạp (VND)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="5000000"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {[5000000, 10000000, 20000000, 50000000].map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => setTopUpAmount(amount.toString())}
                  >
                    {(amount / 1000000).toLocaleString()}M
                  </Button>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsTopUpDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleTopUpRequest} className="bg-primary text-primary-foreground">
                Gửi yêu cầu
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Account Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Số dư tài khoản</p>
                <p className="text-2xl font-bold">{mockBillingInfo.balance.toLocaleString("vi-VN")}</p>
                <p className="text-xs text-muted-foreground">VND</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Công nợ hiện tại</p>
                <p className="text-2xl font-bold">{mockBillingInfo.outstandingAmount.toLocaleString("vi-VN")}</p>
                <p className="text-xs text-muted-foreground">Hạn: {mockBillingInfo.dueDate}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                <Receipt className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hạn mức tín dụng</p>
                <p className="text-2xl font-bold">{mockBillingInfo.creditLimit.toLocaleString("vi-VN")}</p>
                <p className="text-xs text-muted-foreground">VND</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Invoices */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Hóa đơn</CardTitle>
              <CardDescription>Lịch sử hóa đơn và thanh toán</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã HĐ</TableHead>
                  <TableHead>Kỳ</TableHead>
                  <TableHead>Số tiền</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-mono text-sm">{invoice.id}</TableCell>
                    <TableCell>{invoice.period}</TableCell>
                    <TableCell className="font-medium">
                      {invoice.amount.toLocaleString("vi-VN")}
                    </TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top Up Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Yêu cầu nạp tiền</CardTitle>
            <CardDescription>Các yêu cầu nạp tiền gần đây</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã YC</TableHead>
                  <TableHead>Số tiền</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTopUpRequests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-mono text-sm">{req.id}</TableCell>
                    <TableCell className="font-medium">
                      {req.amount.toLocaleString("vi-VN")}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {req.createdAt}
                    </TableCell>
                    <TableCell>{getStatusBadge(req.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Phương thức thanh toán</CardTitle>
          <CardDescription>Chọn phương thức để thanh toán công nợ</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <Button variant="outline" className="h-auto flex-col gap-2 p-6">
              <CreditCard className="h-8 w-8 text-primary" />
              <span className="font-medium">Chuyển khoản ngân hàng</span>
              <span className="text-xs text-muted-foreground">Vietcombank, BIDV, Techcombank...</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 p-6">
              <Wallet className="h-8 w-8 text-primary" />
              <span className="font-medium">Ví điện tử</span>
              <span className="text-xs text-muted-foreground">MoMo, ZaloPay, VNPay</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 p-6">
              <Receipt className="h-8 w-8 text-primary" />
              <span className="font-medium">Thanh toán trực tiếp</span>
              <span className="text-xs text-muted-foreground">Tại văn phòng MetroBus</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
