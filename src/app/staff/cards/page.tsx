"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { PortalLayout } from "@/components/layouts/portal-layout"
import { 
  Search, 
  Plus, 
  CreditCard, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  Edit,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  Wallet,
  QrCode,
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
const mockCards = [
  { 
    id: "CARD001", 
    cardNumber: "9704 **** **** 1234",
    holderName: "Nguyen Van A",
    phone: "0901234567",
    type: "standard",
    status: "active",
    balance: 150000,
    createdAt: "2024-01-15"
  },
  { 
    id: "CARD002", 
    cardNumber: "9704 **** **** 5678",
    holderName: "Tran Thi B",
    phone: "0909876543",
    type: "student",
    status: "active",
    balance: 75000,
    createdAt: "2024-02-20"
  },
  { 
    id: "CARD003", 
    cardNumber: "9704 **** **** 9012",
    holderName: "Le Van C",
    phone: "0912345678",
    type: "elderly",
    status: "blocked",
    balance: 0,
    createdAt: "2024-01-10"
  },
]

const cardTypes = [
  { value: "standard", label: "Thẻ thường" },
  { value: "student", label: "Thẻ sinh viên" },
  { value: "elderly", label: "Thẻ người cao tuổi" },
  { value: "disabled", label: "Thẻ người khuyết tật" },
  { value: "corporate", label: "Thẻ doanh nghiệp" },
]

export default function StaffCardsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCard, setSelectedCard] = useState<typeof mockCards[0] | null>(null)
  const [isIssueDialogOpen, setIsIssueDialogOpen] = useState(false)
  const [isTopUpDialogOpen, setIsTopUpDialogOpen] = useState(false)
  const [topUpAmount, setTopUpAmount] = useState("")
  
  // New card form
  const [newCard, setNewCard] = useState({
    holderName: "",
    phone: "",
    email: "",
    idNumber: "",
    cardType: "standard",
    initialBalance: ""
  })

  const filteredCards = mockCards.filter(card => 
    card.cardNumber.includes(searchQuery) ||
    card.holderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.phone.includes(searchQuery)
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>
      case "blocked":
        return <Badge className="bg-red-100 text-red-800">Bị khóa</Badge>
      case "expired":
        return <Badge className="bg-yellow-100 text-yellow-800">Hết hạn</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getCardTypeBadge = (type: string) => {
    const typeConfig: Record<string, { label: string; className: string }> = {
      standard: { label: "Thường", className: "bg-blue-100 text-blue-800" },
      student: { label: "Sinh viên", className: "bg-purple-100 text-purple-800" },
      elderly: { label: "NCT", className: "bg-orange-100 text-orange-800" },
      disabled: { label: "NKT", className: "bg-pink-100 text-pink-800" },
      corporate: { label: "DN", className: "bg-cyan-100 text-cyan-800" },
    }
    const config = typeConfig[type] || { label: type, className: "" }
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const handleIssueCard = () => {
    console.log("Issuing new card:", newCard)
    setIsIssueDialogOpen(false)
    setNewCard({
      holderName: "",
      phone: "",
      email: "",
      idNumber: "",
      cardType: "standard",
      initialBalance: ""
    })
  }

  const handleTopUp = () => {
    console.log("Top up card:", selectedCard?.id, "Amount:", topUpAmount)
    setIsTopUpDialogOpen(false)
    setTopUpAmount("")
    setSelectedCard(null)
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Quản lý thẻ</h1>
            <p className="text-muted-foreground">Phát hành, nạp tiền và quản lý thẻ khách hàng</p>
          </div>
          <Dialog open={isIssueDialogOpen} onOpenChange={setIsIssueDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground">
                <Plus className="mr-2 h-4 w-4" />
                Phát hành thẻ mới
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Phát hành thẻ mới</DialogTitle>
                <DialogDescription>
                  Nhập thông tin khách hàng để phát hành thẻ
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="holderName">Họ và tên *</Label>
                  <Input
                    id="holderName"
                    placeholder="Nguyen Van A"
                    value={newCard.holderName}
                    onChange={(e) => setNewCard({...newCard, holderName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại *</Label>
                  <Input
                    id="phone"
                    placeholder="0901234567"
                    value={newCard.phone}
                    onChange={(e) => setNewCard({...newCard, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={newCard.email}
                    onChange={(e) => setNewCard({...newCard, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idNumber">CMND/CCCD *</Label>
                  <Input
                    id="idNumber"
                    placeholder="0123456789"
                    value={newCard.idNumber}
                    onChange={(e) => setNewCard({...newCard, idNumber: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardType">Loại thẻ *</Label>
                  <Select 
                    value={newCard.cardType} 
                    onValueChange={(value) => setNewCard({...newCard, cardType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại thẻ" />
                    </SelectTrigger>
                    <SelectContent>
                      {cardTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="initialBalance">Số dư ban đầu (VND)</Label>
                  <Input
                    id="initialBalance"
                    type="number"
                    placeholder="100000"
                    value={newCard.initialBalance}
                    onChange={(e) => setNewCard({...newCard, initialBalance: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsIssueDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleIssueCard} className="bg-primary text-primary-foreground">
                  Phát hành thẻ
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo số thẻ, tên, SĐT..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Loại thẻ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {cardTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="blocked">Bị khóa</SelectItem>
                  <SelectItem value="expired">Hết hạn</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Cards List */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách thẻ ({filteredCards.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Số thẻ</TableHead>
                  <TableHead>Chủ thẻ</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Số dư</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCards.map((card) => (
                  <TableRow key={card.id}>
                    <TableCell className="font-mono">{card.cardNumber}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{card.holderName}</p>
                        <p className="text-sm text-muted-foreground">{card.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getCardTypeBadge(card.type)}</TableCell>
                    <TableCell className="font-medium">
                      {card.balance.toLocaleString("vi-VN")} VND
                    </TableCell>
                    <TableCell>{getStatusBadge(card.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedCard(card)
                            setIsTopUpDialogOpen(true)
                          }}
                        >
                          <Wallet className="mr-1 h-4 w-4" />
                          Nạp tiền
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top Up Dialog */}
        <Dialog open={isTopUpDialogOpen} onOpenChange={setIsTopUpDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nạp tiền vào thẻ</DialogTitle>
              <DialogDescription>
                Nạp tiền cho thẻ {selectedCard?.cardNumber}
              </DialogDescription>
            </DialogHeader>
            {selectedCard && (
              <div className="space-y-4 py-4">
                <div className="rounded-lg bg-muted p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{selectedCard.holderName}</p>
                      <p className="text-sm text-muted-foreground">{selectedCard.cardNumber}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Số dư hiện tại:</span>
                    <span className="font-semibold">{selectedCard.balance.toLocaleString("vi-VN")} VND</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="topUpAmount">Số tiền nạp (VND) *</Label>
                  <Input
                    id="topUpAmount"
                    type="number"
                    placeholder="100000"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {[50000, 100000, 200000, 500000].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      onClick={() => setTopUpAmount(amount.toString())}
                    >
                      {amount.toLocaleString("vi-VN")}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsTopUpDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleTopUp} className="bg-primary text-primary-foreground">
                Xác nhận nạp tiền
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PortalLayout>
  )
}
