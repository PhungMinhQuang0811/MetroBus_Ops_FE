"use client"

import { useState } from "react"
import { 
  Search, 
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Printer,
  MapPin,
  Phone,
  User,
  CreditCard,
  MoreHorizontal,
  Eye,
  ArrowLeft,
  Filter
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

type OrderStatus = "PRINTING" | "READY_FOR_PICKUP" | "SHIPPED" | "COMPLETED"

interface Order {
  id: string
  customerName: string
  phone: string
  email: string
  citizenId: string
  cardUid: string
  deliveryMethod: "PICKUP" | "SHIPPING"
  pickupStation?: string
  shippingAddress?: string
  status: OrderStatus
  createdAt: string
  updatedAt: string
  planType: string
  amount: number
}

const mockOrders: Order[] = [
  {
    id: "ORD-2024-001234",
    customerName: "Nguyen Van A",
    phone: "0901234567",
    email: "nguyenvana@email.com",
    citizenId: "079123456789",
    cardUid: "VTC-2024-001234",
    deliveryMethod: "PICKUP",
    pickupStation: "Ben Thanh",
    status: "PRINTING",
    createdAt: "2024-01-15 08:30:00",
    updatedAt: "2024-01-15 08:30:00",
    planType: "Vé tháng thường",
    amount: 200000
  },
  {
    id: "ORD-2024-001235",
    customerName: "Tran Thi B",
    phone: "0912345678",
    email: "tranthib@email.com",
    citizenId: "079234567890",
    cardUid: "VTC-2024-001235",
    deliveryMethod: "SHIPPING",
    shippingAddress: "123 Nguyen Hue, Q1, TP.HCM",
    status: "READY_FOR_PICKUP",
    createdAt: "2024-01-14 14:20:00",
    updatedAt: "2024-01-15 09:00:00",
    planType: "Vé tháng HSSV",
    amount: 100000
  },
  {
    id: "ORD-2024-001236",
    customerName: "Le Van C",
    phone: "0923456789",
    email: "levanc@email.com",
    citizenId: "079345678901",
    cardUid: "VTC-2024-001236",
    deliveryMethod: "PICKUP",
    pickupStation: "Suoi Tien",
    status: "SHIPPED",
    createdAt: "2024-01-13 10:15:00",
    updatedAt: "2024-01-14 16:30:00",
    planType: "Vé tháng thường",
    amount: 200000
  },
  {
    id: "ORD-2024-001237",
    customerName: "Pham Thi D",
    phone: "0934567890",
    email: "phamthid@email.com",
    citizenId: "079456789012",
    cardUid: "VTC-2024-001237",
    deliveryMethod: "PICKUP",
    pickupStation: "Ben Thanh",
    status: "COMPLETED",
    createdAt: "2024-01-12 09:00:00",
    updatedAt: "2024-01-13 11:20:00",
    planType: "Vé tháng ưu tiên",
    amount: 150000
  },
  {
    id: "ORD-2024-001238",
    customerName: "Hoang Van E",
    phone: "0945678901",
    email: "hoangvane@email.com",
    citizenId: "079567890123",
    cardUid: "VTC-2024-001238",
    deliveryMethod: "SHIPPING",
    shippingAddress: "456 Le Loi, Q3, TP.HCM",
    status: "PRINTING",
    createdAt: "2024-01-15 10:45:00",
    updatedAt: "2024-01-15 10:45:00",
    planType: "Vé tháng thường",
    amount: 200000
  }
]

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: React.ElementType }> = {
  PRINTING: { label: "Đang in", color: "bg-primary/10 text-primary border-primary/30", icon: Printer },
  READY_FOR_PICKUP: { label: "Sẵn sàng", color: "bg-warning/10 text-warning border-warning/30", icon: Package },
  SHIPPED: { label: "Đã gửi", color: "bg-info/10 text-info border-info/30", icon: Truck },
  COMPLETED: { label: "Hoàn thành", color: "bg-secondary/10 text-secondary border-secondary/30", icon: CheckCircle2 }
}

const getNextStatus = (currentStatus: OrderStatus, deliveryMethod: "PICKUP" | "SHIPPING"): OrderStatus | null => {
  if (currentStatus === "PRINTING") return "READY_FOR_PICKUP"
  if (currentStatus === "READY_FOR_PICKUP" && deliveryMethod === "SHIPPING") return "SHIPPED"
  if (currentStatus === "READY_FOR_PICKUP" && deliveryMethod === "PICKUP") return "COMPLETED"
  if (currentStatus === "SHIPPED") return "COMPLETED"
  return null
}

export default function StaffOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showDetailSheet, setShowDetailSheet] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [pendingAction, setPendingAction] = useState<{ order: Order; newStatus: OrderStatus } | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.cardUid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phone.includes(searchQuery)
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleStatusChange = (order: Order, newStatus: OrderStatus) => {
    setPendingAction({ order, newStatus })
    setShowConfirmModal(true)
  }

  const confirmStatusChange = () => {
    if (!pendingAction) return
    
    setIsProcessing(true)
    
    setTimeout(() => {
      setOrders(prev => prev.map(o => 
        o.id === pendingAction.order.id 
          ? { ...o, status: pendingAction.newStatus, updatedAt: new Date().toISOString() }
          : o
      ))
      setIsProcessing(false)
      setShowConfirmModal(false)
      setPendingAction(null)
    }, 1000)
  }

  const handleReprint = (order: Order) => {
    setPendingAction({ order, newStatus: "PRINTING" })
    setShowConfirmModal(true)
  }

  const viewOrderDetail = (order: Order) => {
    setSelectedOrder(order)
    setShowDetailSheet(true)
  }

  const statusCounts = {
    all: orders.length,
    PRINTING: orders.filter(o => o.status === "PRINTING").length,
    READY_FOR_PICKUP: orders.filter(o => o.status === "READY_FOR_PICKUP").length,
    SHIPPED: orders.filter(o => o.status === "SHIPPED").length,
    COMPLETED: orders.filter(o => o.status === "COMPLETED").length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Quản lý đơn hàng thẻ</h1>
        <p className="text-muted-foreground">Xử lý đơn đặt thẻ vật lý - in thẻ, giao hàng, nhận tại quầy</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setStatusFilter("PRINTING")}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Đang in</p>
                <p className="text-2xl font-bold text-primary">{statusCounts.PRINTING}</p>
              </div>
              <Printer className="h-8 w-8 text-primary/30" />
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-warning/50 transition-colors" onClick={() => setStatusFilter("READY_FOR_PICKUP")}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sẵn sàng</p>
                <p className="text-2xl font-bold text-warning">{statusCounts.READY_FOR_PICKUP}</p>
              </div>
              <Package className="h-8 w-8 text-warning/30" />
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-info/50 transition-colors" onClick={() => setStatusFilter("SHIPPED")}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Đã gửi</p>
                <p className="text-2xl font-bold text-info">{statusCounts.SHIPPED}</p>
              </div>
              <Truck className="h-8 w-8 text-info/30" />
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-secondary/50 transition-colors" onClick={() => setStatusFilter("COMPLETED")}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hoàn thành</p>
                <p className="text-2xl font-bold text-secondary">{statusCounts.COMPLETED}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-secondary/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo mã đơn, tên KH, số thẻ, SĐT..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả ({statusCounts.all})</SelectItem>
                  <SelectItem value="PRINTING">Đang in ({statusCounts.PRINTING})</SelectItem>
                  <SelectItem value="READY_FOR_PICKUP">Sẵn sàng ({statusCounts.READY_FOR_PICKUP})</SelectItem>
                  <SelectItem value="SHIPPED">Đã gửi ({statusCounts.SHIPPED})</SelectItem>
                  <SelectItem value="COMPLETED">Hoàn thành ({statusCounts.COMPLETED})</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {statusFilter !== "all" && (
              <Button variant="ghost" size="sm" onClick={() => setStatusFilter("all")}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Xem tất cả
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Danh sách đơn hàng</CardTitle>
          <CardDescription>
            Hiển thị {filteredOrders.length} / {orders.length} đơn hàng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đơn</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Mã thẻ</TableHead>
                <TableHead>Giao hàng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Cập nhật</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Package className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">Không tìm thấy đơn hàng nào</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => {
                  const statusInfo = statusConfig[order.status]
                  const StatusIcon = statusInfo.icon
                  const nextStatus = getNextStatus(order.status, order.deliveryMethod)
                  
                  return (
                    <TableRow key={order.id}>
                      <TableCell>
                        <span className="font-mono text-sm font-medium">{order.id}</span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.customerName}</p>
                          <p className="text-sm text-muted-foreground">{order.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">{order.cardUid}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          {order.deliveryMethod === "PICKUP" ? (
                            <>
                              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="text-sm">{order.pickupStation}</span>
                            </>
                          ) : (
                            <>
                              <Truck className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="text-sm">Giao hàng</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusInfo.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          {new Date(order.updatedAt).toLocaleDateString("vi-VN")}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => viewOrderDetail(order)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {nextStatus && (
                              <DropdownMenuItem onClick={() => handleStatusChange(order, nextStatus)}>
                                {nextStatus === "READY_FOR_PICKUP" && (
                                  <>
                                    <Package className="h-4 w-4 mr-2" />
                                    Đánh dấu sẵn sàng
                                  </>
                                )}
                                {nextStatus === "SHIPPED" && (
                                  <>
                                    <Truck className="h-4 w-4 mr-2" />
                                    Đánh dấu đã gửi
                                  </>
                                )}
                                {nextStatus === "COMPLETED" && (
                                  <>
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    Hoàn thành đơn
                                  </>
                                )}
                              </DropdownMenuItem>
                            )}
                            {order.status !== "PRINTING" && order.status !== "COMPLETED" && (
                              <DropdownMenuItem onClick={() => handleReprint(order)}>
                                <Printer className="h-4 w-4 mr-2" />
                                In lại thẻ
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Detail Sheet */}
      <Sheet open={showDetailSheet} onOpenChange={setShowDetailSheet}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Chi tiết đơn hàng</SheetTitle>
            <SheetDescription>
              {selectedOrder?.id}
            </SheetDescription>
          </SheetHeader>
          {selectedOrder && (
            <div className="mt-6 space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Trạng thái</span>
                <Badge variant="outline" className={statusConfig[selectedOrder.status].color}>
                  {statusConfig[selectedOrder.status].label}
                </Badge>
              </div>

              {/* Customer Info */}
              <div className="rounded-lg border p-4 space-y-3">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  Thông tin khách hàng
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Họ tên:</span>
                    <span className="font-medium">{selectedOrder.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Số điện thoại:</span>
                    <span className="font-medium">{selectedOrder.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{selectedOrder.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">CCCD:</span>
                    <span className="font-mono">{selectedOrder.citizenId}</span>
                  </div>
                </div>
              </div>

              {/* Card Info */}
              <div className="rounded-lg border p-4 space-y-3">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" />
                  Thông tin thẻ
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mã thẻ:</span>
                    <span className="font-mono font-medium">{selectedOrder.cardUid}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gói vé:</span>
                    <span className="font-medium">{selectedOrder.planType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Số tiền:</span>
                    <span className="font-medium text-primary">{selectedOrder.amount.toLocaleString()}đ</span>
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="rounded-lg border p-4 space-y-3">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  {selectedOrder.deliveryMethod === "PICKUP" ? (
                    <MapPin className="h-4 w-4 text-primary" />
                  ) : (
                    <Truck className="h-4 w-4 text-primary" />
                  )}
                  Thông tin giao hàng
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hình thức:</span>
                    <span className="font-medium">
                      {selectedOrder.deliveryMethod === "PICKUP" ? "Nhận tại quầy" : "Giao hàng"}
                    </span>
                  </div>
                  {selectedOrder.deliveryMethod === "PICKUP" ? (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Trạm nhận:</span>
                      <span className="font-medium">{selectedOrder.pickupStation}</span>
                    </div>
                  ) : (
                    <div>
                      <span className="text-muted-foreground">Địa chỉ:</span>
                      <p className="font-medium mt-1">{selectedOrder.shippingAddress}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Timeline */}
              <div className="rounded-lg border p-4 space-y-3">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Thời gian
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tạo đơn:</span>
                    <span>{new Date(selectedOrder.createdAt).toLocaleString("vi-VN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cập nhật:</span>
                    <span>{new Date(selectedOrder.updatedAt).toLocaleString("vi-VN")}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {getNextStatus(selectedOrder.status, selectedOrder.deliveryMethod) && (
                <Button 
                  className="w-full" 
                  onClick={() => {
                    const nextStatus = getNextStatus(selectedOrder.status, selectedOrder.deliveryMethod)
                    if (nextStatus) {
                      handleStatusChange(selectedOrder, nextStatus)
                    }
                  }}
                >
                  Chuyển trạng thái tiếp theo
                </Button>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận thay đổi trạng thái</DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn thay đổi trạng thái đơn hàng này?
            </DialogDescription>
          </DialogHeader>
          {pendingAction && (
            <div className="py-4">
              <div className="rounded-lg border p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Mã đơn:</span>
                  <span className="font-mono font-medium">{pendingAction.order.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Trạng thái mới:</span>
                  <Badge variant="outline" className={statusConfig[pendingAction.newStatus].color}>
                    {statusConfig[pendingAction.newStatus].label}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmModal(false)} disabled={isProcessing}>
              Hủy
            </Button>
            <Button onClick={confirmStatusChange} disabled={isProcessing}>
              {isProcessing ? "Đang xử lý..." : "Xác nhận"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
