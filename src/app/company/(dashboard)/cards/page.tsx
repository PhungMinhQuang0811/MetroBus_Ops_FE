"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Search, 
  CreditCard,
  Wallet,
  Lock,
  Unlock,
  MoreHorizontal,
  User
} from "lucide-react"

// Mock data
const mockCards = [
  {
    id: "CARD001",
    cardNumber: "9704 **** **** 1234",
    employeeName: "Nguyen Van A",
    department: "Kinh doanh",
    balance: 250000,
    status: "active",
    monthlyLimit: 2000000,
    monthlyUsed: 450000
  },
  {
    id: "CARD002",
    cardNumber: "9704 **** **** 5678",
    employeeName: "Tran Thi B",
    department: "Marketing",
    balance: 180000,
    status: "active",
    monthlyLimit: 3000000,
    monthlyUsed: 1200000
  },
  {
    id: "CARD003",
    cardNumber: "9704 **** **** 9012",
    employeeName: "Le Van C",
    department: "IT",
    balance: 0,
    status: "blocked",
    monthlyLimit: 2000000,
    monthlyUsed: 2000000
  },
]

export default function CompanyCardsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCards, setSelectedCards] = useState<string[]>([])
  const [isTopUpDialogOpen, setIsTopUpDialogOpen] = useState(false)
  const [topUpAmount, setTopUpAmount] = useState("")

  const filteredCards = mockCards.filter(card =>
    card.cardNumber.includes(searchQuery) ||
    card.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>
      case "blocked":
        return <Badge className="bg-red-100 text-red-800">Bị khóa</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const toggleCardSelection = (cardId: string) => {
    setSelectedCards(prev =>
      prev.includes(cardId)
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    )
  }

  const toggleAllCards = () => {
    if (selectedCards.length === filteredCards.length) {
      setSelectedCards([])
    } else {
      setSelectedCards(filteredCards.map(c => c.id))
    }
  }

  const handleBulkTopUp = () => {
    console.log("Bulk top up:", selectedCards, "Amount:", topUpAmount)
    setIsTopUpDialogOpen(false)
    setTopUpAmount("")
    setSelectedCards([])
  }

  const totalBalance = mockCards.reduce((sum, card) => sum + card.balance, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Quản lý thẻ doanh nghiệp</h1>
          <p className="text-muted-foreground">Quản lý thẻ và hạn mức cho nhân viên</p>
        </div>
        <Button 
          className="bg-primary text-primary-foreground"
          onClick={() => setIsTopUpDialogOpen(true)}
          disabled={selectedCards.length === 0}
        >
          <Wallet className="mr-2 h-4 w-4" />
          Nạp tiền hàng loạt ({selectedCards.length})
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockCards.length}</p>
                <p className="text-sm text-muted-foreground">Tổng số thẻ</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <Wallet className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalBalance.toLocaleString("vi-VN")}</p>
                <p className="text-sm text-muted-foreground">Tổng số dư (VND)</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <Lock className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {mockCards.filter(c => c.status === "blocked").length}
                </p>
                <p className="text-sm text-muted-foreground">Thẻ bị khóa</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo số thẻ, tên nhân viên..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="blocked">Bị khóa</SelectItem>
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
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedCards.length === filteredCards.length && filteredCards.length > 0}
                    onCheckedChange={toggleAllCards}
                  />
                </TableHead>
                <TableHead>Thẻ</TableHead>
                <TableHead>Nhân viên</TableHead>
                <TableHead>Số dư</TableHead>
                <TableHead>Hạn mức tháng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCards.map((card) => (
                <TableRow key={card.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedCards.includes(card.id)}
                      onCheckedChange={() => toggleCardSelection(card.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-dark">
                        <CreditCard className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-mono">{card.cardNumber}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{card.employeeName}</p>
                      <p className="text-sm text-muted-foreground">{card.department}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {card.balance.toLocaleString("vi-VN")} VND
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 flex-1 rounded-full bg-muted">
                          <div 
                            className="h-2 rounded-full bg-primary"
                            style={{ width: `${(card.monthlyUsed / card.monthlyLimit) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {Math.round((card.monthlyUsed / card.monthlyLimit) * 100)}%
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {card.monthlyUsed.toLocaleString("vi-VN")} / {card.monthlyLimit.toLocaleString("vi-VN")}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(card.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <Wallet className="mr-1 h-4 w-4" />
                        Nạp
                      </Button>
                      {card.status === "active" ? (
                        <Button variant="ghost" size="sm">
                          <Lock className="h-4 w-4 text-destructive" />
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm">
                          <Unlock className="h-4 w-4 text-green-600" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Bulk Top Up Dialog */}
      <Dialog open={isTopUpDialogOpen} onOpenChange={setIsTopUpDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nạp tiền hàng loạt</DialogTitle>
            <DialogDescription>
              Nạp tiền cho {selectedCards.length} thẻ đã chọn
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground">Thẻ đã chọn:</p>
              <p className="font-medium">{selectedCards.length} thẻ</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Số tiền nạp mỗi thẻ (VND)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="200000"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {[100000, 200000, 500000, 1000000].map((amount) => (
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
            {topUpAmount && (
              <div className="rounded-lg bg-primary/10 p-4">
                <p className="text-sm text-muted-foreground">Tổng tiền cần nạp:</p>
                <p className="text-xl font-bold text-primary">
                  {(parseInt(topUpAmount) * selectedCards.length).toLocaleString("vi-VN")} VND
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTopUpDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleBulkTopUp} className="bg-primary text-primary-foreground">
              Xác nhận nạp tiền
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
