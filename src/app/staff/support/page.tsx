"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { PortalLayout } from "@/components/layouts/portal-layout"
import { 
  Search, 
  MessageSquare, 
  Phone, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  CreditCard,
  RefreshCw,
  Headphones,
  LayoutDashboard
} from "lucide-react"
import { ROUTES } from "@/lib/routes"

const staffNavItems = [
  { label: "Dashboard", href: ROUTES.staff.home, icon: LayoutDashboard },
  { label: "Quản lý ca", href: ROUTES.staff.shift, icon: Clock },
  { label: "Quản lý thẻ", href: ROUTES.staff.cards, icon: CreditCard },
  { label: "Hỗ trợ", href: ROUTES.staff.support, icon: Headphones },
]

// Mock data
const mockTickets = [
  {
    id: "TK001",
    customerName: "Nguyen Van A",
    phone: "0901234567",
    subject: "Thẻ bị khóa không rõ lý do",
    category: "card_issue",
    status: "open",
    priority: "high",
    createdAt: "2024-03-15 09:30",
    lastUpdated: "2024-03-15 10:15"
  },
  {
    id: "TK002",
    customerName: "Tran Thi B",
    phone: "0909876543",
    subject: "Không thể nạp tiền qua app",
    category: "topup",
    status: "in_progress",
    priority: "medium",
    createdAt: "2024-03-15 08:45",
    lastUpdated: "2024-03-15 09:00"
  },
  {
    id: "TK003",
    customerName: "Le Van C",
    phone: "0912345678",
    subject: "Yêu cầu hoàn tiền chuyến đi bị lỗi",
    category: "refund",
    status: "resolved",
    priority: "low",
    createdAt: "2024-03-14 14:20",
    lastUpdated: "2024-03-15 08:00"
  },
]

const categories = [
  { value: "card_issue", label: "Vấn đề thẻ" },
  { value: "topup", label: "Nạp tiền" },
  { value: "refund", label: "Hoàn tiền" },
  { value: "trip", label: "Chuyến đi" },
  { value: "account", label: "Tài khoản" },
  { value: "other", label: "Khác" },
]

export default function StaffSupportPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTicket, setSelectedTicket] = useState<typeof mockTickets[0] | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [response, setResponse] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-blue-100 text-blue-800">Mở</Badge>
      case "in_progress":
        return <Badge className="bg-yellow-100 text-yellow-800">Đang xử lý</Badge>
      case "resolved":
        return <Badge className="bg-green-100 text-green-800">Đã giải quyết</Badge>
      case "closed":
        return <Badge className="bg-gray-100 text-gray-800">Đã đóng</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">Cao</Badge>
      case "medium":
        return <Badge className="bg-orange-100 text-orange-800">Trung bình</Badge>
      case "low":
        return <Badge className="bg-gray-100 text-gray-800">Thấp</Badge>
      default:
        return <Badge variant="secondary">{priority}</Badge>
    }
  }

  const getCategoryLabel = (category: string) => {
    return categories.find(c => c.value === category)?.label || category
  }

  const filteredTickets = mockTickets.filter(ticket => {
    const matchesSearch = 
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (activeTab === "all") return matchesSearch
    return matchesSearch && ticket.status === activeTab
  })

  const handleRespond = () => {
    console.log("Responding to ticket:", selectedTicket?.id, "Response:", response)
    setIsDetailDialogOpen(false)
    setResponse("")
  }

  const stats = {
    open: mockTickets.filter(t => t.status === "open").length,
    inProgress: mockTickets.filter(t => t.status === "in_progress").length,
    resolved: mockTickets.filter(t => t.status === "resolved").length,
  }

  return (
    <PortalLayout
      portalName="Staff Portal"
      navItems={staffNavItems}
      userName="Nhan Vien A"
      userRole="Nhân viên bán vé"
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Hỗ trợ khách hàng</h1>
          <p className="text-muted-foreground">Xử lý yêu cầu và khiếu nại từ khách hàng</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Yêu cầu mới</p>
                  <p className="text-2xl font-bold">{stats.open}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <AlertCircle className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Đang xử lý</p>
                  <p className="text-2xl font-bold">{stats.inProgress}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                  <RefreshCw className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Đã giải quyết hôm nay</p>
                  <p className="text-2xl font-bold">{stats.resolved}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Tabs */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm yêu cầu..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Phân loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tickets Table */}
        <Card>
          <CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">Tất cả</TabsTrigger>
                <TabsTrigger value="open">Mới ({stats.open})</TabsTrigger>
                <TabsTrigger value="in_progress">Đang xử lý ({stats.inProgress})</TabsTrigger>
                <TabsTrigger value="resolved">Đã giải quyết</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Vấn đề</TableHead>
                  <TableHead>Phân loại</TableHead>
                  <TableHead>Ưu tiên</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-mono">{ticket.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{ticket.customerName}</p>
                        <p className="text-sm text-muted-foreground">{ticket.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {ticket.subject}
                    </TableCell>
                    <TableCell>{getCategoryLabel(ticket.category)}</TableCell>
                    <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                    <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedTicket(ticket)
                          setIsDetailDialogOpen(true)
                        }}
                      >
                        Xử lý
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Ticket Detail Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Chi tiết yêu cầu #{selectedTicket?.id}</DialogTitle>
              <DialogDescription>
                Xem và xử lý yêu cầu hỗ trợ từ khách hàng
              </DialogDescription>
            </DialogHeader>
            {selectedTicket && (
              <div className="space-y-4">
                {/* Customer Info */}
                <div className="rounded-lg bg-muted p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{selectedTicket.customerName}</p>
                      <p className="text-sm text-muted-foreground">{selectedTicket.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Ticket Info */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Phân loại:</span>
                    <span>{getCategoryLabel(selectedTicket.category)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Độ ưu tiên:</span>
                    {getPriorityBadge(selectedTicket.priority)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Trạng thái:</span>
                    {getStatusBadge(selectedTicket.status)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Tạo lúc:</span>
                    <span>{selectedTicket.createdAt}</span>
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <Label>Vấn đề</Label>
                  <p className="rounded-lg bg-muted p-3">{selectedTicket.subject}</p>
                </div>

                {/* Response */}
                <div className="space-y-2">
                  <Label htmlFor="response">Phản hồi</Label>
                  <Textarea
                    id="response"
                    placeholder="Nhập phản hồi cho khách hàng..."
                    rows={4}
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Select defaultValue={selectedTicket.status}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Mở</SelectItem>
                      <SelectItem value="in_progress">Đang xử lý</SelectItem>
                      <SelectItem value="resolved">Đã giải quyết</SelectItem>
                      <SelectItem value="closed">Đã đóng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleRespond} className="bg-primary text-primary-foreground">
                Gửi phản hồi
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PortalLayout>
  )
}
