"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type StatusType = 
  | "ACTIVE" | "SUCCESS" | "COMPLETED" | "APPROVED" | "CHECK_IN" | "CHECK_OUT" | "VERIFIED"
  | "PENDING" | "PRINTING" | "READY_FOR_PICKUP" | "SHIPPED" | "MANUAL_REVIEW" | "IN_PROGRESS"
  | "LOCKED" | "EXPIRED" | "CANCELLED" | "FAILED" | "REJECTED" | "INVALID"
  | "DISABLED" | "EMPTY"

interface StatusBadgeProps {
  status: StatusType | string
  className?: string
}

const statusConfig: Record<string, { label: string; className: string }> = {
  // Success states (secondary/green)
  ACTIVE: { label: "Hoạt động", className: "bg-secondary text-secondary-foreground" },
  SUCCESS: { label: "Thành công", className: "bg-secondary text-secondary-foreground" },
  COMPLETED: { label: "Hoàn thành", className: "bg-secondary text-secondary-foreground" },
  APPROVED: { label: "Đã duyệt", className: "bg-secondary text-secondary-foreground" },
  CHECK_IN: { label: "Vào trạm", className: "bg-secondary text-secondary-foreground" },
  CHECK_OUT: { label: "Ra trạm", className: "bg-secondary text-secondary-foreground" },
  VERIFIED: { label: "Đã xác thực", className: "bg-secondary text-secondary-foreground" },
  
  // Warning states (accent/yellow)
  PENDING: { label: "Đang chờ", className: "bg-accent text-accent-foreground" },
  PRINTING: { label: "Đang in", className: "bg-accent text-accent-foreground" },
  READY_FOR_PICKUP: { label: "Sẵn sàng nhận", className: "bg-accent text-accent-foreground" },
  SHIPPED: { label: "Đang giao", className: "bg-accent text-accent-foreground" },
  MANUAL_REVIEW: { label: "Cần xem xét", className: "bg-accent text-accent-foreground" },
  
  // Primary state (blue)
  IN_PROGRESS: { label: "Đang xử lý", className: "bg-primary text-primary-foreground" },
  
  // Danger states (red)
  LOCKED: { label: "Đã khóa", className: "bg-destructive text-destructive-foreground" },
  EXPIRED: { label: "Hết hạn", className: "bg-destructive text-destructive-foreground" },
  CANCELLED: { label: "Đã hủy", className: "bg-destructive text-destructive-foreground" },
  FAILED: { label: "Thất bại", className: "bg-destructive text-destructive-foreground" },
  REJECTED: { label: "Từ chối", className: "bg-destructive text-destructive-foreground" },
  INVALID: { label: "Không hợp lệ", className: "bg-destructive text-destructive-foreground" },
  
  // Muted states
  DISABLED: { label: "Vô hiệu", className: "bg-muted text-muted-foreground" },
  EMPTY: { label: "Trống", className: "bg-muted text-muted-foreground" },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, className: "bg-muted text-muted-foreground" }
  
  return (
    <Badge className={cn(config.className, className)}>
      {config.label}
    </Badge>
  )
}
