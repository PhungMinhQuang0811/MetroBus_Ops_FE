"use client"

import { useState } from "react"
import { 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Eye,
  Building2,
  DollarSign,
  Clock,
  FileText,
  AlertTriangle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

// Mock data - danh sách yêu cầu rút tiền
const payoutRequests = [
  {
    id: "PO-001",
    operatorId: "OP001",
    operatorName: "Công ty TNHH Vận tải Sài Gòn",
    amount: 125000000,
    bankAccountNo: "1234567890",
    bankName: "Vietcombank",
    walletBalance: 180000000,
    note: "Thanh toán kỳ T12/2024",
    requestedAt: "2024-12-20 10:30",
    requestedBy: "Nguyễn Văn A",
    status: "PENDING"
  },
  {
    id: "PO-002",
    operatorId: "OP002",
    operatorName: "Công ty CP Xe buýt Hà Nội",
    amount: 98000000,
    bankAccountNo: "0987654321",
    bankName: "Techcombank",
    walletBalance: 150000000,
    note: "Rút tiền đối soát tháng 12",
    requestedAt: "2024-12-19 14:15",
    requestedBy: "Trần Thị B",
    status: "PENDING"
  },
  {
    id: "PO-003",
    operatorId: "OP003",
    operatorName: "HTX Vận tải Đà Nẵng",
    amount: 45000000,
    bankAccountNo: "5678901234",
    bankName: "BIDV",
    walletBalance: 60000000,
    note: "",
    requestedAt: "2024-12-18 09:00",
    requestedBy: "Lê Văn C",
    status: "APPROVED"
  },
  {
    id: "PO-004",
    operatorId: "OP001",
    operatorName: "Công ty TNHH Vận tải Sài Gòn",
    amount: 200000000,
    bankAccountNo: "1234567890",
    bankName: "Vietcombank",
    walletBalance: 180000000,
    note: "Yêu cầu rút gấp",
    requestedAt: "2024-12-17 16:45",
    requestedBy: "Nguyễn Văn A",
    status: "REJECTED",
    rejectionReason: "Số dư ví không đủ. Vui lòng chờ đợi kỳ đối soát tiếp theo."
  }
]

export default function PayoutsPage() {
  const [requests, setRequests] = useState(payoutRequests)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedRequest, setSelectedRequest] = useState<typeof payoutRequests[0] | null>(null)
  const [detailSheetOpen, setDetailSheetOpen] = useState(false)
  const [actionDialogOpen, setActionDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<"approve" | "reject">("approve")
  const [actionNote, setActionNote] = useState("")

  const filteredRequests = requests.filter(req => {
    const matchSearch = req.operatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       req.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = statusFilter === "all" || req.status === statusFilter
    return matchSearch && matchStatus
  })

  const pendingCount = requests.filter(r => r.status === "PENDING").length
  const totalPendingAmount = requests
    .filter(r => r.status === "PENDING")
    .reduce((sum, r) => sum + r.amount, 0)

  const handleViewDetail = (request: typeof payoutRequests[0]) => {
    setSelectedRequest(request)
    setDetailSheetOpen(true)
  }

  const handleAction = (request: typeof payoutRequests[0], type: "approve" | "reject") => {
    setSelectedRequest(request)
    setActionType(type)
    setActionNote("")
    setActionDialogOpen(true)
  }

  const handleConfirmAction = () => {
    // API call here
    setActionDialogOpen(false)
    setDetailSheetOpen(false)
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Duyệt yêu cầu Rút tiền</h1>
        <p className="text-muted-foreground">Xem xét và phê duyệt các yêu cầu rút tiền từ các đơn vị vận hành</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Chờ duyệt</CardTitle>
            <Clock className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">yêu cầu</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng tiền chờ duyệt</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPendingAmount)}</div>
            <p className="text-xs text-muted-foreground">VND</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Đã duyệt hôm nay</CardTitle>
            <CheckCircle className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">yêu cầu</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Từ chối hôm nay</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">yêu cầu</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm theo mã yêu cầu, tên đơn vị..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="PENDING">Chờ duyệt</SelectItem>
                <SelectItem value="APPROVED">Đã duyệt</SelectItem>
                <SelectItem value="REJECTED">Từ chối</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách yêu cầu rút tiền</CardTitle>
          <CardDescription>
            {filteredRequests.length} yêu cầu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã YC</TableHead>
                <TableHead>Đơn vị vận hành</TableHead>
                <TableHead className="text-right">Số tiền</TableHead>
                <TableHead>Ngân hàng</TableHead>
                <TableHead>Ngày yêu cầu</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-mono text-sm">{request.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{request.operatorName}</div>
                        <div className="text-xs text-muted-foreground">{request.operatorId}</div>
                      </div>
                    </div>
                  </TableCell>
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
                    <div className="flex items-center justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewDetail(request)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {request.status === "PENDING" && (
                        <>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-secondary hover:text-secondary"
                            onClick={() => handleAction(request, "approve")}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleAction(request, "reject")}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Sheet */}
      <Sheet open={detailSheetOpen} onOpenChange={setDetailSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
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

              {/* Operator Info */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Thông tin đơn vị</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Đơn vị</span>
                    <span className="font-medium">{selectedRequest.operatorName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mã đơn vị</span>
                    <span>{selectedRequest.operatorId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Số dư ví hiện tại</span>
                    <span className="font-medium text-primary">
                      {formatCurrency(selectedRequest.walletBalance)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Payout Info */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Thông tin rút tiền</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Số tiền yêu cầu</span>
                    <span className="font-bold text-lg">{formatCurrency(selectedRequest.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ngân hàng</span>
                    <span>{selectedRequest.bankName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Số tài khoản</span>
                    <span className="font-mono">{selectedRequest.bankAccountNo}</span>
                  </div>
                  {selectedRequest.note && (
                    <div className="pt-2 border-t">
                      <span className="text-muted-foreground">Ghi chú:</span>
                      <p className="mt-1">{selectedRequest.note}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Request Info */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Thông tin yêu cầu</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Người yêu cầu</span>
                    <span>{selectedRequest.requestedBy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Thời gian</span>
                    <span>{selectedRequest.requestedAt}</span>
                  </div>
                </CardContent>
              </Card>

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

              {/* Balance Warning */}
              {selectedRequest.status === "PENDING" && selectedRequest.amount > selectedRequest.walletBalance && (
                <Card className="border-warning bg-warning/10">
                  <CardContent className="flex items-center gap-3 py-4">
                    <AlertTriangle className="h-5 w-5 text-warning" />
                    <div>
                      <p className="font-medium text-foreground">Cảnh báo</p>
                      <p className="text-sm text-muted-foreground">
                        Số tiền yêu cầu vượt quá số dư ví hiện tại của đơn vị.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              {selectedRequest.status === "PENDING" && (
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => handleAction(selectedRequest, "reject")}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Từ chối
                  </Button>
                  <Button 
                    className="flex-1 bg-secondary hover:bg-secondary/90"
                    onClick={() => handleAction(selectedRequest, "approve")}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Phê duyệt
                  </Button>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" ? "Phê duyệt yêu cầu rút tiền" : "Từ chối yêu cầu rút tiền"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve" 
                ? "Xác nhận phê duyệt yêu cầu rút tiền này?"
                : "Vui lòng nhập lý do từ chối yêu cầu rút tiền."
              }
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Đơn vị</span>
                  <span className="font-medium">{selectedRequest.operatorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Số tiền</span>
                  <span className="font-bold">{formatCurrency(selectedRequest.amount)}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>{actionType === "approve" ? "Ghi chú (tùy chọn)" : "Lý do từ chối"}</Label>
                <Textarea
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  placeholder={actionType === "approve" ? "Nhập ghi chú..." : "Nhập lý do từ chối..."}
                  required={actionType === "reject"}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
              Hủy
            </Button>
            <Button 
              onClick={handleConfirmAction}
              className={actionType === "reject" ? "bg-destructive hover:bg-destructive/90" : "bg-secondary hover:bg-secondary/90"}
              disabled={actionType === "reject" && !actionNote.trim()}
            >
              {actionType === "approve" ? "Phê duyệt" : "Từ chối"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
