"use client"

import { useState } from "react"
import { 
  Plus, 
  DollarSign,
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  AlertTriangle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Mock data - ví đơn vị vận hành
const operatorWallet = {
  balance: 245000000,
  pendingPayout: 125000000,
  lastClearing: "2024-12-15",
  bankAccountNo: "1234567890",
  bankName: "Vietcombank",
  accountHolder: "Công ty TNHH Vận tải Sài Gòn"
}

// Mock data - lịch sử yêu cầu rút tiền
const payoutHistory = [
  {
    id: "PO-001",
    amount: 125000000,
    bankAccountNo: "1234567890",
    bankName: "Vietcombank",
    note: "Thanh toán kỳ T12/2024",
    requestedAt: "2024-12-20 10:30",
    status: "PENDING",
    processedAt: null,
    processedBy: null
  },
  {
    id: "PO-002",
    amount: 98000000,
    bankAccountNo: "1234567890",
    bankName: "Vietcombank",
    note: "Rút tiền đối soát tháng 11",
    requestedAt: "2024-11-25 14:15",
    status: "APPROVED",
    processedAt: "2024-11-26 09:00",
    processedBy: "Admin Platform"
  },
  {
    id: "PO-003",
    amount: 150000000,
    bankAccountNo: "1234567890",
    bankName: "Vietcombank",
    note: "Rút tiền gấp",
    requestedAt: "2024-11-10 16:45",
    status: "REJECTED",
    processedAt: "2024-11-11 10:30",
    processedBy: "Admin Platform",
    rejectionReason: "Số tiền vượt quá số dư khả dụng"
  },
  {
    id: "PO-004",
    amount: 75000000,
    bankAccountNo: "1234567890",
    bankName: "Vietcombank",
    note: "Thanh toán kỳ T10/2024",
    requestedAt: "2024-10-28 11:00",
    status: "APPROVED",
    processedAt: "2024-10-29 08:30",
    processedBy: "Admin Platform"
  }
]

export default function CompanyPayoutsPage() {
  const [requests, setRequests] = useState(payoutHistory)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [detailSheetOpen, setDetailSheetOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<typeof payoutHistory[0] | null>(null)
  const [formData, setFormData] = useState({
    amount: "",
    note: ""
  })

  const pendingAmount = requests
    .filter(r => r.status === "PENDING")
    .reduce((sum, r) => sum + r.amount, 0)
  
  const availableBalance = operatorWallet.balance - pendingAmount

  const handleCreate = () => {
    setFormData({ amount: "", note: "" })
    setCreateDialogOpen(true)
  }

  const handleViewDetail = (request: typeof payoutHistory[0]) => {
    setSelectedRequest(request)
    setDetailSheetOpen(true)
  }

  const handleSubmitRequest = () => {
    // API call here
    setCreateDialogOpen(false)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-accent text-accent-foreground">Chờ duyệt</Badge>
      case "APPROVED":
        return <Badge className="bg-secondary text-secondary-foreground">Đã duyệt</Badge>
      case "REJECTED":
        return <Badge className="bg-destructive text-destructive-foreground">Từ chối</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const isAmountValid = () => {
    const amount = Number(formData.amount)
    return amount > 0 && amount <= availableBalance
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Yêu cầu Rút tiền</h1>
          <p className="text-muted-foreground">Quản lý các yêu cầu rút tiền từ ví đơn vị vận hành</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Tạo yêu cầu rút tiền
        </Button>
      </div>

      {/* Wallet Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Số dư ví</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatCurrency(operatorWallet.balance)}</div>
            <p className="text-xs text-muted-foreground">Tổng số dư hiện tại</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Đang chờ duyệt</CardTitle>
            <Clock className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{formatCurrency(pendingAmount)}</div>
            <p className="text-xs text-muted-foreground">Số tiền đang xử lý</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Khả dụng rút</CardTitle>
            <CheckCircle className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{formatCurrency(availableBalance)}</div>
            <p className="text-xs text-muted-foreground">Có thể rút ngay</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Đối soát gần nhất</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{operatorWallet.lastClearing}</div>
            <p className="text-xs text-muted-foreground">Kỳ clearing cuối</p>
          </CardContent>
        </Card>
      </div>

      {/* Bank Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Thông tin tài khoản nhận tiền</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Chủ tài khoản</p>
              <p className="font-medium">{operatorWallet.accountHolder}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Số tài khoản</p>
              <p className="font-mono font-medium">{operatorWallet.bankAccountNo}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ngân hàng</p>
              <p className="font-medium">{operatorWallet.bankName}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch sử yêu cầu rút tiền</CardTitle>
          <CardDescription>Danh sách các yêu cầu rút tiền đã tạo</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã YC</TableHead>
                <TableHead className="text-right">Số tiền</TableHead>
                <TableHead>Ngân hàng</TableHead>
                <TableHead>Ngày yêu cầu</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-mono text-sm">{request.id}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(request.amount)}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{request.bankName}</div>
                      <div className="text-muted-foreground">{request.bankAccountNo}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{request.requestedAt}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleViewDetail(request)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tạo yêu cầu rút tiền</DialogTitle>
            <DialogDescription>
              Gửi yêu cầu rút tiền từ ví đơn vị vận hành
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Balance Info */}
            <Card className="bg-muted">
              <CardContent className="py-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Số dư khả dụng:</span>
                  <span className="font-bold text-secondary">{formatCurrency(availableBalance)}</span>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Label>Số tiền yêu cầu rút (VND)</Label>
              <Input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                placeholder="100000000"
              />
              {formData.amount && Number(formData.amount) > availableBalance && (
                <p className="text-sm text-destructive">Số tiền vượt quá số dư khả dụng</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Tài khoản nhận</Label>
              <Card className="bg-muted">
                <CardContent className="py-3 text-sm">
                  <div className="space-y-1">
                    <p>{operatorWallet.accountHolder}</p>
                    <p className="font-mono">{operatorWallet.bankAccountNo}</p>
                    <p className="text-muted-foreground">{operatorWallet.bankName}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-2">
              <Label>Ghi chú</Label>
              <Textarea
                value={formData.note}
                onChange={(e) => setFormData({...formData, note: e.target.value})}
                placeholder="VD: Thanh toán kỳ tháng 12"
              />
            </div>

            {/* Warning */}
            <Card className="border-accent bg-accent/10">
              <CardContent className="flex items-center gap-3 py-3">
                <AlertTriangle className="h-5 w-5 text-accent" />
                <p className="text-sm text-muted-foreground">
                  Yêu cầu rút tiền sẽ được Platform Manager xem xét và phê duyệt trong vòng 1-2 ngày làm việc.
                </p>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Hủy</Button>
            <Button onClick={handleSubmitRequest} disabled={!isAmountValid()}>
              Gửi yêu cầu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Sheet */}
      <Sheet open={detailSheetOpen} onOpenChange={setDetailSheetOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Chi tiết yêu cầu rút tiền</SheetTitle>
            <SheetDescription>Mã: {selectedRequest?.id}</SheetDescription>
          </SheetHeader>
          {selectedRequest && (
            <div className="mt-6 space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Trạng thái</span>
                {getStatusBadge(selectedRequest.status)}
              </div>

              {/* Amount */}
              <Card>
                <CardContent className="py-4 text-center">
                  <p className="text-sm text-muted-foreground">Số tiền yêu cầu</p>
                  <p className="text-3xl font-bold text-primary">
                    {formatCurrency(selectedRequest.amount)}
                  </p>
                </CardContent>
              </Card>

              {/* Bank Info */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Tài khoản nhận</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ngân hàng</span>
                    <span>{selectedRequest.bankName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Số tài khoản</span>
                    <span className="font-mono">{selectedRequest.bankAccountNo}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Lịch sử xử lý</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 mt-1.5 rounded-full bg-primary" />
                    <div>
                      <p className="font-medium">Tạo yêu cầu</p>
                      <p className="text-muted-foreground">{selectedRequest.requestedAt}</p>
                    </div>
                  </div>
                  {selectedRequest.processedAt && (
                    <div className="flex items-start gap-3">
                      <div className={`h-2 w-2 mt-1.5 rounded-full ${
                        selectedRequest.status === "APPROVED" ? "bg-secondary" : "bg-destructive"
                      }`} />
                      <div>
                        <p className="font-medium">
                          {selectedRequest.status === "APPROVED" ? "Đã phê duyệt" : "Bị từ chối"}
                        </p>
                        <p className="text-muted-foreground">{selectedRequest.processedAt}</p>
                        <p className="text-muted-foreground">Bởi: {selectedRequest.processedBy}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Note */}
              {selectedRequest.note && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Ghi chú</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{selectedRequest.note}</p>
                  </CardContent>
                </Card>
              )}

              {/* Rejection Reason */}
              {selectedRequest.status === "REJECTED" && selectedRequest.rejectionReason && (
                <Card className="border-destructive">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-destructive">Lý do từ chối</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{selectedRequest.rejectionReason}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
