"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/status-badge";
import {
  Search,
  Ban,
  CheckCircle,
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
} from "lucide-react";

interface Account {
  id: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  status: "ACTIVE" | "BANNED" | "PENDING";
  createdAt: string;
  lastLogin: string;
  banReason?: string;
}

const mockAccounts: Account[] = [
  {
    id: "1",
    username: "nguyen_van_a",
    email: "nguyenvana@email.com",
    phone: "0901234567",
    role: "PASSENGER",
    status: "ACTIVE",
    createdAt: "2024-01-15",
    lastLogin: "2024-03-20 14:30",
  },
  {
    id: "2",
    username: "tran_van_b",
    email: "tranvanb@email.com",
    phone: "0912345678",
    role: "PASSENGER",
    status: "BANNED",
    createdAt: "2024-02-10",
    lastLogin: "2024-03-18 09:15",
    banReason: "Vi phạm điều khoản sử dụng - Gian lận vé",
  },
  {
    id: "3",
    username: "le_thi_c",
    email: "lethic@email.com",
    phone: "0923456789",
    role: "STAFF",
    status: "ACTIVE",
    createdAt: "2024-01-20",
    lastLogin: "2024-03-20 08:00",
  },
  {
    id: "4",
    username: "pham_van_d",
    email: "phamvand@email.com",
    phone: "0934567890",
    role: "COMPANY_MANAGER",
    status: "ACTIVE",
    createdAt: "2024-01-05",
    lastLogin: "2024-03-19 16:45",
  },
  {
    id: "5",
    username: "hoang_thi_e",
    email: "hoangthie@email.com",
    phone: "0945678901",
    role: "PASSENGER",
    status: "BANNED",
    createdAt: "2024-02-25",
    lastLogin: "2024-03-10 11:20",
    banReason: "Spam hệ thống",
  },
];

export default function AdminAccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [showBanModal, setShowBanModal] = useState(false);
  const [showUnbanModal, setShowUnbanModal] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch =
      account.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.phone.includes(searchQuery);
    const matchesRole = roleFilter === "all" || account.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || account.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleBan = async () => {
    if (!selectedAccount || !banReason.trim()) return;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === selectedAccount.id
          ? { ...acc, status: "BANNED" as const, banReason }
          : acc
      )
    );
    setIsLoading(false);
    setShowBanModal(false);
    setBanReason("");
    setSelectedAccount(null);
  };

  const handleUnban = async () => {
    if (!selectedAccount) return;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === selectedAccount.id
          ? { ...acc, status: "ACTIVE" as const, banReason: undefined }
          : acc
      )
    );
    setIsLoading(false);
    setShowUnbanModal(false);
    setSelectedAccount(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Quản lý tài khoản</h1>
        <p className="text-muted-foreground">
          Ban/Unban tài khoản người dùng trong hệ thống
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Tìm kiếm tài khoản</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo username, email, số điện thoại..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả vai trò</SelectItem>
                <SelectItem value="PASSENGER">Hành khách</SelectItem>
                <SelectItem value="STAFF">Nhân viên</SelectItem>
                <SelectItem value="COMPANY_MANAGER">Quản lý công ty</SelectItem>
                <SelectItem value="PLATFORM_MANAGER">Quản lý nền tảng</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                <SelectItem value="BANNED">Bị khóa</SelectItem>
                <SelectItem value="PENDING">Chờ xác thực</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Accounts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách tài khoản</CardTitle>
          <CardDescription>
            Tổng cộng {filteredAccounts.length} tài khoản
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tài khoản</TableHead>
                  <TableHead>Liên hệ</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Đăng nhập cuối</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAccounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{account.username}</p>
                          <p className="text-xs text-muted-foreground">
                            ID: {account.id}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          {account.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {account.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Shield className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{account.role}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={account.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {account.lastLogin}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {account.status === "ACTIVE" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => {
                            setSelectedAccount(account);
                            setShowBanModal(true);
                          }}
                        >
                          <Ban className="h-4 w-4 mr-1" />
                          Ban
                        </Button>
                      ) : account.status === "BANNED" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-secondary hover:text-secondary"
                          onClick={() => {
                            setSelectedAccount(account);
                            setShowUnbanModal(true);
                          }}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Unban
                        </Button>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Ban Modal */}
      <Dialog open={showBanModal} onOpenChange={setShowBanModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">
              Khóa tài khoản
            </DialogTitle>
            <DialogDescription>
              Bạn đang khóa tài khoản{" "}
              <strong>{selectedAccount?.username}</strong>. Hành động này sẽ
              ngăn người dùng đăng nhập và sử dụng dịch vụ.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedAccount && (
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{selectedAccount.username}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  {selectedAccount.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-3 w-3" />
                  {selectedAccount.role}
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="banReason">Lý do khóa tài khoản *</Label>
              <Textarea
                id="banReason"
                placeholder="Nhập lý do khóa tài khoản..."
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowBanModal(false);
                setBanReason("");
              }}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleBan}
              disabled={!banReason.trim() || isLoading}
            >
              {isLoading ? "Đang xử lý..." : "Xác nhận khóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unban Modal */}
      <Dialog open={showUnbanModal} onOpenChange={setShowUnbanModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-secondary">
              Mở khóa tài khoản
            </DialogTitle>
            <DialogDescription>
              Bạn đang mở khóa tài khoản{" "}
              <strong>{selectedAccount?.username}</strong>. Người dùng sẽ có thể
              đăng nhập và sử dụng dịch vụ trở lại.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedAccount && (
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{selectedAccount.username}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  {selectedAccount.email}
                </div>
                {selectedAccount.banReason && (
                  <div className="mt-3 p-3 bg-destructive/10 rounded border border-destructive/20">
                    <p className="text-xs font-medium text-destructive mb-1">
                      Lý do bị khóa:
                    </p>
                    <p className="text-sm">{selectedAccount.banReason}</p>
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUnbanModal(false)}>
              Hủy
            </Button>
            <Button
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              onClick={handleUnban}
              disabled={isLoading}
            >
              {isLoading ? "Đang xử lý..." : "Xác nhận mở khóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
