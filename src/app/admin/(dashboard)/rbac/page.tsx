"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Shield, Save, AlertTriangle, Info } from "lucide-react";

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  isCritical?: boolean;
}

interface Role {
  id: string;
  name: string;
  displayName: string;
  permissions: string[];
}

const allPermissions: Permission[] = [
  // Account Management
  { id: "account.view", name: "Xem tài khoản", description: "Xem danh sách và chi tiết tài khoản", category: "Tài khoản" },
  { id: "account.ban", name: "Khóa tài khoản", description: "Khóa/mở khóa tài khoản người dùng", category: "Tài khoản", isCritical: true },
  // Card Management
  { id: "card.view", name: "Xem thẻ", description: "Xem danh sách và chi tiết thẻ", category: "Thẻ" },
  { id: "card.create", name: "Tạo thẻ", description: "Tạo thẻ vật lý/ảo mới", category: "Thẻ" },
  { id: "card.revoke", name: "Thu hồi thẻ", description: "Thu hồi thẻ đang hoạt động", category: "Thẻ" },
  // Transaction
  { id: "transaction.view", name: "Xem giao dịch", description: "Xem lịch sử giao dịch", category: "Giao dịch" },
  { id: "transaction.refund", name: "Hoàn tiền", description: "Thực hiện hoàn tiền giao dịch", category: "Giao dịch", isCritical: true },
  // PSC
  { id: "psc.view", name: "Xem PSC", description: "Xem danh sách sự cố PSC", category: "PSC" },
  { id: "psc.resolve", name: "Xử lý PSC", description: "Điều chỉnh giá vé, mở khóa thẻ PSC", category: "PSC" },
  // Shift
  { id: "shift.view", name: "Xem ca trực", description: "Xem thông tin ca trực", category: "Ca trực" },
  { id: "shift.manage", name: "Quản lý ca trực", description: "Mở/đóng ca trực", category: "Ca trực" },
  // Route & Fare
  { id: "route.view", name: "Xem tuyến/trạm", description: "Xem danh sách tuyến và trạm", category: "Tuyến đường" },
  { id: "route.manage", name: "Quản lý tuyến/trạm", description: "Thêm/sửa/xóa tuyến và trạm", category: "Tuyến đường" },
  { id: "fare.view", name: "Xem biểu giá", description: "Xem chính sách giá vé", category: "Giá vé" },
  { id: "fare.manage", name: "Quản lý biểu giá", description: "Cập nhật chính sách giá vé", category: "Giá vé" },
  // Tenant & Clearing
  { id: "tenant.view", name: "Xem tenant", description: "Xem danh sách đơn vị vận hành", category: "Tenant" },
  { id: "tenant.manage", name: "Quản lý tenant", description: "Thêm/sửa đơn vị vận hành", category: "Tenant" },
  { id: "clearing.view", name: "Xem quyết toán", description: "Xem báo cáo quyết toán", category: "Quyết toán" },
  { id: "clearing.run", name: "Chạy quyết toán", description: "Thực hiện quyết toán", category: "Quyết toán", isCritical: true },
  // Payout
  { id: "payout.view", name: "Xem chi trả", description: "Xem yêu cầu chi trả", category: "Chi trả" },
  { id: "payout.approve", name: "Duyệt chi trả", description: "Duyệt/từ chối yêu cầu chi trả", category: "Chi trả", isCritical: true },
  // Admin
  { id: "rbac.manage", name: "Quản lý RBAC", description: "Cấu hình vai trò và quyền", category: "Quản trị", isCritical: true },
  { id: "logs.view", name: "Xem logs", description: "Xem nhật ký hệ thống", category: "Quản trị" },
  { id: "logs.export", name: "Xuất logs", description: "Xuất nhật ký ra file", category: "Quản trị" },
];

const initialRoles: Role[] = [
  {
    id: "PASSENGER",
    name: "PASSENGER",
    displayName: "Hành khách",
    permissions: ["card.view", "transaction.view"],
  },
  {
    id: "STAFF",
    name: "STAFF",
    displayName: "Nhân viên",
    permissions: ["card.view", "card.create", "card.revoke", "transaction.view", "psc.view", "psc.resolve", "shift.view", "shift.manage"],
  },
  {
    id: "COMPANY_MANAGER",
    name: "COMPANY_MANAGER",
    displayName: "Quản lý công ty",
    permissions: ["account.view", "card.view", "card.create", "card.revoke", "transaction.view", "psc.view", "shift.view", "shift.manage", "route.view", "route.manage", "fare.view", "fare.manage", "payout.view"],
  },
  {
    id: "PLATFORM_MANAGER",
    name: "PLATFORM_MANAGER",
    displayName: "Quản lý nền tảng",
    permissions: ["account.view", "card.view", "transaction.view", "tenant.view", "tenant.manage", "clearing.view", "clearing.run", "fare.view", "fare.manage", "payout.view", "payout.approve"],
  },
  {
    id: "ADMIN",
    name: "ADMIN",
    displayName: "Quản trị viên",
    permissions: allPermissions.map((p) => p.id),
  },
];

// Group permissions by category
const permissionsByCategory = allPermissions.reduce((acc, perm) => {
  if (!acc[perm.category]) {
    acc[perm.category] = [];
  }
  acc[perm.category].push(perm);
  return acc;
}, {} as Record<string, Permission[]>);

export default function AdminRBACPage() {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [selectedRole, setSelectedRole] = useState<string>("STAFF");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [pendingPermission, setPendingPermission] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const currentRole = roles.find((r) => r.id === selectedRole);
  const originalRole = initialRoles.find((r) => r.id === selectedRole);

  const handlePermissionToggle = (permissionId: string, permission: Permission) => {
    if (!currentRole) return;

    const hasPermission = currentRole.permissions.includes(permissionId);
    
    // If trying to add a critical permission, show warning
    if (!hasPermission && permission.isCritical) {
      setPendingPermission(permissionId);
      setShowWarningModal(true);
      return;
    }

    updatePermission(permissionId);
  };

  const updatePermission = (permissionId: string) => {
    if (!currentRole) return;

    const hasPermission = currentRole.permissions.includes(permissionId);
    const newPermissions = hasPermission
      ? currentRole.permissions.filter((p) => p !== permissionId)
      : [...currentRole.permissions, permissionId];

    setRoles((prev) =>
      prev.map((r) =>
        r.id === selectedRole ? { ...r, permissions: newPermissions } : r
      )
    );
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setShowSaveModal(false);
    setHasChanges(false);
  };

  const getPermissionChanges = () => {
    if (!currentRole || !originalRole) return { added: [], removed: [] };
    
    const added = currentRole.permissions.filter(
      (p) => !originalRole.permissions.includes(p)
    );
    const removed = originalRole.permissions.filter(
      (p) => !currentRole.permissions.includes(p)
    );
    
    return { added, removed };
  };

  const changes = getPermissionChanges();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Phân quyền RBAC</h1>
          <p className="text-muted-foreground">
            Cấu hình quyền truy cập cho từng vai trò trong hệ thống
          </p>
        </div>
        <Button
          onClick={() => setShowSaveModal(true)}
          disabled={!hasChanges}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          Lưu thay đổi
        </Button>
      </div>

      {/* Role Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Chọn vai trò
          </CardTitle>
          <CardDescription>
            Chọn vai trò để xem và chỉnh sửa quyền truy cập
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-full md:w-[300px]">
              <SelectValue placeholder="Chọn vai trò" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.displayName} ({role.name})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Permission Matrix */}
      {currentRole && (
        <Card>
          <CardHeader>
            <CardTitle>
              Ma trận quyền - {currentRole.displayName}
            </CardTitle>
            <CardDescription>
              Đánh dấu các quyền mà vai trò này được phép thực hiện
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(permissionsByCategory).map(([category, permissions]) => (
                <div key={category}>
                  <h3 className="font-semibold text-sm text-muted-foreground mb-3 uppercase tracking-wide">
                    {category}
                  </h3>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]"></TableHead>
                          <TableHead>Quyền</TableHead>
                          <TableHead>Mô tả</TableHead>
                          <TableHead className="w-[100px]">Mức độ</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {permissions.map((permission) => {
                          const isChecked = currentRole.permissions.includes(permission.id);
                          const wasOriginallyChecked = originalRole?.permissions.includes(permission.id);
                          const isChanged = isChecked !== wasOriginallyChecked;

                          return (
                            <TableRow 
                              key={permission.id}
                              className={isChanged ? "bg-accent/10" : ""}
                            >
                              <TableCell>
                                <Checkbox
                                  checked={isChecked}
                                  onCheckedChange={() => handlePermissionToggle(permission.id, permission)}
                                  disabled={selectedRole === "ADMIN" && permission.id === "rbac.manage"}
                                />
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{permission.name}</span>
                                  {isChanged && (
                                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                                      isChecked ? "bg-secondary/20 text-secondary" : "bg-destructive/20 text-destructive"
                                    }`}>
                                      {isChecked ? "Thêm" : "Xóa"}
                                    </span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-muted-foreground text-sm">
                                {permission.description}
                              </TableCell>
                              <TableCell>
                                {permission.isCritical ? (
                                  <span className="inline-flex items-center gap-1 text-xs text-destructive bg-destructive/10 px-2 py-1 rounded">
                                    <AlertTriangle className="h-3 w-3" />
                                    Quan trọng
                                  </span>
                                ) : (
                                  <span className="text-xs text-muted-foreground">Thường</span>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Critical Permission Warning Modal */}
      <Dialog open={showWarningModal} onOpenChange={setShowWarningModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-accent">
              <AlertTriangle className="h-5 w-5" />
              Cảnh báo quyền quan trọng
            </DialogTitle>
            <DialogDescription>
              Bạn đang cấp một quyền quan trọng cho vai trò này. Quyền này có thể
              ảnh hưởng đến bảo mật và tài chính của hệ thống.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
              <p className="text-sm">
                {allPermissions.find((p) => p.id === pendingPermission)?.description}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowWarningModal(false);
                setPendingPermission(null);
              }}
            >
              Hủy
            </Button>
            <Button
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
              onClick={() => {
                if (pendingPermission) {
                  updatePermission(pendingPermission);
                }
                setShowWarningModal(false);
                setPendingPermission(null);
              }}
            >
              Xác nhận cấp quyền
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Save Confirmation Modal */}
      <Dialog open={showSaveModal} onOpenChange={setShowSaveModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Xác nhận thay đổi RBAC
            </DialogTitle>
            <DialogDescription>
              Xem lại các thay đổi trước khi lưu
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="font-medium mb-2">
                Vai trò: {currentRole?.displayName}
              </p>
              
              {changes.added.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm font-medium text-secondary mb-1">
                    Quyền được thêm:
                  </p>
                  <ul className="text-sm space-y-1">
                    {changes.added.map((id) => (
                      <li key={id} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                        {allPermissions.find((p) => p.id === id)?.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {changes.removed.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-destructive mb-1">
                    Quyền bị xóa:
                  </p>
                  <ul className="text-sm space-y-1">
                    {changes.removed.map((id) => (
                      <li key={id} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                        {allPermissions.find((p) => p.id === id)?.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveModal(false)}>
              Hủy
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
