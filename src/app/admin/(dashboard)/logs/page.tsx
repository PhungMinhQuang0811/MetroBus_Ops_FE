"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  Download,
  FileText,
  AlertTriangle,
  Info,
  AlertCircle,
  Bug,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

interface LogEntry {
  id: string;
  timestamp: string;
  severity: "INFO" | "WARNING" | "ERROR" | "CRITICAL";
  type: string;
  message: string;
  actor?: string;
  target?: string;
  metadata?: Record<string, unknown>;
}

const mockLogs: LogEntry[] = [
  {
    id: "1",
    timestamp: "2024-03-20 15:45:23",
    severity: "INFO",
    type: "AUTH",
    message: "User login successful",
    actor: "nguyen_van_a",
    target: "session_abc123",
    metadata: { ip: "192.168.1.100", device: "Mobile" },
  },
  {
    id: "2",
    timestamp: "2024-03-20 15:44:10",
    severity: "WARNING",
    type: "PAYMENT",
    message: "Payment retry attempt exceeded threshold",
    actor: "tran_van_b",
    target: "payment_xyz789",
    metadata: { attempts: 3, amount: 50000 },
  },
  {
    id: "3",
    timestamp: "2024-03-20 15:42:55",
    severity: "ERROR",
    type: "VALIDATOR",
    message: "QR validation failed - invalid signature",
    actor: "gate_01",
    target: "qr_def456",
    metadata: { station: "BX_01", reason: "INVALID_SIGNATURE" },
  },
  {
    id: "4",
    timestamp: "2024-03-20 15:40:30",
    severity: "CRITICAL",
    type: "SYSTEM",
    message: "Database connection pool exhausted",
    target: "db_primary",
    metadata: { connections: 100, maxConnections: 100 },
  },
  {
    id: "5",
    timestamp: "2024-03-20 15:38:15",
    severity: "INFO",
    type: "ADMIN",
    message: "Account banned by administrator",
    actor: "admin",
    target: "user_12345",
    metadata: { reason: "Policy violation" },
  },
  {
    id: "6",
    timestamp: "2024-03-20 15:35:00",
    severity: "INFO",
    type: "CLEARING",
    message: "Daily clearing completed successfully",
    actor: "system",
    target: "clearing_20240320",
    metadata: { journeys: 15420, amount: 231300000 },
  },
  {
    id: "7",
    timestamp: "2024-03-20 15:30:45",
    severity: "WARNING",
    type: "CARD",
    message: "Card locked due to suspicious activity",
    actor: "fraud_detector",
    target: "card_vn123456",
    metadata: { score: 0.92, triggers: ["rapid_scans", "location_anomaly"] },
  },
  {
    id: "8",
    timestamp: "2024-03-20 15:28:20",
    severity: "ERROR",
    type: "PSC",
    message: "PSC resolution failed - insufficient funds",
    actor: "le_thi_c",
    target: "psc_incident_789",
    metadata: { required: 25000, available: 12000 },
  },
  {
    id: "9",
    timestamp: "2024-03-20 15:25:10",
    severity: "INFO",
    type: "TENANT",
    message: "New tenant onboarded",
    actor: "platform_manager",
    target: "tenant_metro_corp",
    metadata: { companyCode: "MC001", routes: 5 },
  },
  {
    id: "10",
    timestamp: "2024-03-20 15:20:00",
    severity: "CRITICAL",
    type: "SECURITY",
    message: "Multiple failed login attempts detected",
    actor: "unknown",
    target: "admin_account",
    metadata: { attempts: 10, blockedUntil: "2024-03-20 16:20:00" },
  },
];

const severityConfig = {
  INFO: { icon: Info, color: "text-primary", bgColor: "bg-primary/10" },
  WARNING: { icon: AlertTriangle, color: "text-accent", bgColor: "bg-accent/10" },
  ERROR: { icon: AlertCircle, color: "text-destructive", bgColor: "bg-destructive/10" },
  CRITICAL: { icon: Bug, color: "text-destructive", bgColor: "bg-destructive/20" },
};

export default function AdminLogsPage() {
  const [logs] = useState<LogEntry[]>(mockLogs);
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity =
      severityFilter === "all" || log.severity === severityFilter;
    const matchesType = typeFilter === "all" || log.type === typeFilter;
    return matchesSearch && matchesSeverity && matchesType;
  });

  const totalPages = Math.ceil(filteredLogs.length / pageSize);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const uniqueTypes = [...new Set(logs.map((log) => log.type))];

  const handleExport = async () => {
    setIsExporting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsExporting(false);
    // In a real app, this would trigger a file download
    alert("Xuất file CSV thành công!");
  };

  const criticalCount = logs.filter((l) => l.severity === "CRITICAL").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">System Logs</h1>
          <p className="text-muted-foreground">
            Xem và xuất nhật ký hoạt động hệ thống
          </p>
        </div>
        <Button onClick={handleExport} disabled={isExporting} className="gap-2">
          <Download className="h-4 w-4" />
          {isExporting ? "Đang xuất..." : "Xuất CSV"}
        </Button>
      </div>

      {/* Critical Alert Banner */}
      {criticalCount > 0 && (
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="p-2 rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-destructive">
                {criticalCount} sự cố nghiêm trọng cần xử lý
              </p>
              <p className="text-sm text-muted-foreground">
                Vui lòng kiểm tra và xử lý các sự cố CRITICAL ngay lập tức
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-destructive text-destructive hover:bg-destructive/10"
              onClick={() => setSeverityFilter("CRITICAL")}
            >
              Xem ngay
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Bộ lọc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo nội dung, actor, target..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Mức độ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả mức độ</SelectItem>
                <SelectItem value="INFO">Info</SelectItem>
                <SelectItem value="WARNING">Warning</SelectItem>
                <SelectItem value="ERROR">Error</SelectItem>
                <SelectItem value="CRITICAL">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                {uniqueTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSeverityFilter("all");
                setTypeFilter("all");
                setDateFrom("");
                setDateTo("");
              }}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reset
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <div className="space-y-2">
              <Label>Từ ngày</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Đến ngày</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Nhật ký hệ thống</CardTitle>
          <CardDescription>
            Hiển thị {paginatedLogs.length} / {filteredLogs.length} bản ghi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Thời gian</TableHead>
                  <TableHead className="w-[100px]">Mức độ</TableHead>
                  <TableHead className="w-[100px]">Loại</TableHead>
                  <TableHead>Nội dung</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead className="text-right">Chi tiết</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLogs.map((log) => {
                  const config = severityConfig[log.severity];
                  const Icon = config.icon;

                  return (
                    <TableRow
                      key={log.id}
                      className={
                        log.severity === "CRITICAL" ? "bg-destructive/5" : ""
                      }
                    >
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          {log.timestamp}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${config.bgColor} ${config.color}`}
                        >
                          <Icon className="h-3 w-3" />
                          {log.severity}
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={log.type} />
                      </TableCell>
                      <TableCell>
                        <p className="text-sm max-w-[300px] truncate">
                          {log.message}
                        </p>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {log.actor || "-"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedLog(log);
                            setShowDetailModal(true);
                          }}
                        >
                          Xem
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Trang {currentPage} / {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Log Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Chi tiết Log
            </DialogTitle>
            <DialogDescription>
              ID: {selectedLog?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Thời gian</Label>
                  <p className="text-sm font-medium">{selectedLog.timestamp}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Mức độ</Label>
                  <div
                    className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${severityConfig[selectedLog.severity].bgColor} ${severityConfig[selectedLog.severity].color}`}
                  >
                    {selectedLog.severity}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Loại</Label>
                  <p className="text-sm font-medium">{selectedLog.type}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Actor</Label>
                  <p className="text-sm font-medium">
                    {selectedLog.actor || "-"}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-muted-foreground">Target</Label>
                <p className="text-sm font-medium">
                  {selectedLog.target || "-"}
                </p>
              </div>

              <div className="space-y-1">
                <Label className="text-muted-foreground">Nội dung</Label>
                <p className="text-sm p-3 bg-muted/50 rounded-lg">
                  {selectedLog.message}
                </p>
              </div>

              {selectedLog.metadata && (
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Metadata (JSON)</Label>
                  <pre className="text-xs p-3 bg-foreground/5 rounded-lg overflow-x-auto font-mono">
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
