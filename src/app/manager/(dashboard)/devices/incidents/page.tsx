"use client"

import { useEffect, useState } from "react"
import { Eye, RefreshCw, Search } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { deviceApi, incidentApi, stationApi } from "@/lib/api"
import type { Device, Incident, IncidentDetail, Station } from "@/lib/api"
import { getApiErrorMessage } from "@/lib/messages"

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const
const TABLE_CLASS_NAME = "border-collapse [&_td]:border [&_th]:border [&_thead_tr]:bg-muted/40"

const SEVERITY_LABELS: Record<string, string> = {
  HIGH: "Nghiêm trọng",
  MEDIUM: "Trung bình",
  LOW: "Thấp",
}

const TYPE_LABELS: Record<string, string> = {
  CONNECTION: "Mất kết nối",
  GATE_JAMMED: "Kẹt cổng",
  SCANNER_ERROR: "Lỗi đầu đọc",
  DEVICE_ERROR: "Lỗi thiết bị",
}

const MOCK_INCIDENTS: IncidentDetail[] = [
  {
    id: "INC-000001",
    deviceId: 1,
    deviceCode: "METRO-001-ST-001-DV-001",
    deviceType: "QR_SCANNER_SIMULATOR",
    deviceStatus: "ACTIVE",
    stationId: 1,
    stationCode: "ST-001",
    stationName: "Bến Thành",
    routeId: 1,
    routeCode: "METRO-001",
    routeName: "Metro Line 1",
    incidentType: "CONNECTION",
    severity: "HIGH",
    message: "Mất tín hiệu kết nối thiết bị",
    occurredAt: new Date(Date.now() - 3600000).toISOString(), // 1h ago
    receivedAt: new Date(Date.now() - 3598000).toISOString(),
    resolvedAt: null,
    payload: {
      pingLatencyMs: 5000,
      packetLossRatio: 1.0,
      interface: "eth0",
    },
  },
  {
    id: "INC-000002",
    deviceId: 2,
    deviceCode: "METRO-001-ST-001-DV-002",
    deviceType: "QR_SCANNER_SIMULATOR",
    deviceStatus: "OFFLINE",
    stationId: 1,
    stationCode: "ST-001",
    stationName: "Bến Thành",
    routeId: 1,
    routeCode: "METRO-001",
    routeName: "Metro Line 1",
    incidentType: "GATE_JAMMED",
    severity: "HIGH",
    message: "Cánh tay chắn thanh chắn bị kẹt",
    occurredAt: new Date(Date.now() - 7200000).toISOString(), // 2h ago
    receivedAt: new Date(Date.now() - 7195000).toISOString(),
    resolvedAt: new Date(Date.now() - 3600000).toISOString(), // resolved 1h ago
    payload: {
      motorOverheatErrorCode: "ERR_BARRIER_MOTOR_OVERHEAT",
      voltage: 220,
      retryAttempts: 3,
    },
  },
  {
    id: "INC-000003",
    deviceId: 3,
    deviceCode: "METRO-001-ST-002-DV-001",
    deviceType: "QR_SCANNER_SIMULATOR",
    deviceStatus: "MAINTENANCE",
    stationId: 2,
    stationCode: "ST-002",
    stationName: "Nhà hát Thành phố",
    routeId: 1,
    routeCode: "METRO-001",
    routeName: "Metro Line 1",
    incidentType: "SCANNER_ERROR",
    severity: "MEDIUM",
    message: "Đầu đọc quét camera timeout",
    occurredAt: new Date(Date.now() - 86400000).toISOString(), // 1d ago
    receivedAt: new Date(Date.now() - 86395000).toISOString(),
    resolvedAt: null,
    payload: {
      hardwareModuleId: "SCANNER_V2_USB",
      voltageRawValue: 4.2,
      cameraFps: 0,
    },
  },
]

function formatDateTime(value?: string | null) {
  if (!value) return "--"

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date)
}

function SeverityBadge({ severity }: { severity: string }) {
  const className = {
    HIGH: "border-red-200 bg-red-50 text-red-700",
    MEDIUM: "border-amber-200 bg-amber-50 text-amber-700",
    LOW: "border-sky-200 bg-sky-50 text-sky-700",
  }[severity] ?? "border-slate-200 bg-slate-50 text-slate-600"

  return (
    <Badge variant="outline" className={className}>
      {SEVERITY_LABELS[severity] ?? severity}
    </Badge>
  )
}

function ResolutionBadge({ resolvedAt }: { resolvedAt?: string | null }) {
  const className = resolvedAt
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : "border-red-200 bg-red-50 text-red-700"

  return (
    <Badge variant="outline" className={className}>
      {resolvedAt ? "Đã xử lý" : "Đang mở"}
    </Badge>
  )
}

export default function DeviceIncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [stationOptions, setStationOptions] = useState<Station[]>([])
  const [deviceOptions, setDeviceOptions] = useState<Device[]>([])

  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [stationId, setStationId] = useState("all")
  const [deviceIdFilter, setDeviceIdFilter] = useState("all")
  const [severity, setSeverity] = useState("all")
  const [incidentType, setIncidentType] = useState("all")
  const [resolved, setResolved] = useState("all")

  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [tableError, setTableError] = useState("")

  const [detailOpen, setDetailOpen] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState("")
  const [selectedIncident, setSelectedIncident] = useState<IncidentDetail | null>(null)

  const fromRow = totalElements === 0 ? 0 : page * pageSize + 1
  const toRow = Math.min((page + 1) * pageSize, totalElements)

  const loadFilterOptions = async () => {
    try {
      const [stationsRes, devicesRes] = await Promise.all([
        stationApi.listStations({ page: 0, size: 100 }),
        deviceApi.listDevices({ page: 0, size: 100 }),
      ])
      setStationOptions(stationsRes.result.items)
      setDeviceOptions(devicesRes.result.items)
    } catch (error) {
      console.error("Failed to load filter options", error)
    }
  }

  const fetchIncidents = async (
    targetPage = page,
    filters?: {
      from: string
      to: string
      stationId: string
      deviceIdFilter: string
      severity: string
      incidentType: string
      resolved: string
    },
    targetPageSize = pageSize,
  ) => {
    setLoading(true)
    setTableError("")

    const currentFrom = filters?.from ?? from
    const currentTo = filters?.to ?? to
    const currentStationId = filters?.stationId ?? stationId
    const currentDeviceIdFilter = filters?.deviceIdFilter ?? deviceIdFilter
    const currentSeverity = filters?.severity ?? severity
    const currentIncidentType = filters?.incidentType ?? incidentType
    const currentResolved = filters?.resolved ?? resolved

    try {
      const response = await incidentApi.searchIncidents({
        from: currentFrom ? new Date(currentFrom).toISOString() : undefined,
        to: currentTo ? new Date(currentTo).toISOString() : undefined,
        stationId: currentStationId === "all" ? undefined : Number(currentStationId),
        deviceId: currentDeviceIdFilter === "all" ? undefined : Number(currentDeviceIdFilter),
        severity: currentSeverity === "all" ? undefined : currentSeverity,
        incidentType: currentIncidentType === "all" ? undefined : currentIncidentType,
        resolved: currentResolved === "all" ? undefined : currentResolved === "true",
        page: targetPage,
        size: targetPageSize,
      })

      setIncidents(response.result.items)
      setPage(response.result.page)
      setPageSize(response.result.size)
      setTotalElements(response.result.totalElements)
      setTotalPages(response.result.totalPages)
    } catch (error) {
      console.warn("Incident search API failed, using mock data:", error)
      // Fallback mock logic for testing/integration independence
      let mockFiltered = [...MOCK_INCIDENTS]

      if (currentStationId !== "all") {
        mockFiltered = mockFiltered.filter((item) => item.stationId === Number(currentStationId))
      }

      if (currentDeviceIdFilter !== "all") {
        mockFiltered = mockFiltered.filter((item) => item.deviceId === Number(currentDeviceIdFilter))
      }

      if (currentSeverity !== "all") {
        mockFiltered = mockFiltered.filter((item) => item.severity === currentSeverity)
      }

      if (currentIncidentType !== "all") {
        mockFiltered = mockFiltered.filter((item) => item.incidentType === currentIncidentType)
      }

      if (currentResolved !== "all") {
        const wantResolved = currentResolved === "true"
        mockFiltered = mockFiltered.filter((item) => (wantResolved ? Boolean(item.resolvedAt) : !item.resolvedAt))
      }

      if (currentFrom) {
        const fromTime = new Date(currentFrom).getTime()
        mockFiltered = mockFiltered.filter((item) => new Date(item.occurredAt).getTime() >= fromTime)
      }

      if (currentTo) {
        const toTime = new Date(currentTo).getTime()
        mockFiltered = mockFiltered.filter((item) => new Date(item.occurredAt).getTime() <= toTime)
      }

      const startIndex = targetPage * targetPageSize
      const paginatedMock = mockFiltered.slice(startIndex, startIndex + targetPageSize)

      setIncidents(paginatedMock)
      setPage(targetPage)
      setPageSize(targetPageSize)
      setTotalElements(mockFiltered.length)
      setTotalPages(Math.ceil(mockFiltered.length / targetPageSize))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadFilterOptions()
    void fetchIncidents(0)
  }, [])

  const handleApplyFilters = () => {
    void fetchIncidents(0)
  }

  const handleResetFilters = () => {
    setFrom("")
    setTo("")
    setStationId("all")
    setDeviceIdFilter("all")
    setSeverity("all")
    setIncidentType("all")
    setResolved("all")
    void fetchIncidents(0, {
      from: "",
      to: "",
      stationId: "all",
      deviceIdFilter: "all",
      severity: "all",
      incidentType: "all",
      resolved: "all",
    })
  }

  const handlePageSizeChange = (value: string) => {
    const nextPageSize = Number(value)
    setPageSize(nextPageSize)
    void fetchIncidents(0, undefined, nextPageSize)
  }

  const handleRefresh = () => {
    void fetchIncidents(page)
  }

  const handleViewIncidentDetail = async (incident: Incident) => {
    setSelectedIncident(null)
    setDetailOpen(true)
    setDetailLoading(true)
    setDetailError("")

    try {
      const response = await incidentApi.getIncidentDetail(incident.id)
      setSelectedIncident(response.result)
    } catch (error) {
      console.warn("Failed to get incident detail, falling back to mock:", error)
      const mockDetail = MOCK_INCIDENTS.find((item) => item.id === incident.id)
      if (mockDetail) {
        setSelectedIncident(mockDetail)
      } else {
        setDetailError(getApiErrorMessage(error))
      }
    } finally {
      setDetailLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Sự cố thiết bị</h1>
          <p className="text-sm text-muted-foreground">Theo dõi và truy vết sự cố phát sinh tại các thiết bị soát vé.</p>
        </div>
        <div>
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Filters block */}
      <div className="grid gap-3 rounded-md border bg-card p-3 md:grid-cols-[repeat(4,1fr)_auto_auto] lg:grid-cols-[repeat(7,1fr)_auto_auto]">
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Từ ngày</label>
          <Input type="date" value={from} onChange={(event) => setFrom(event.target.value)} className="h-9" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Đến ngày</label>
          <Input type="date" value={to} onChange={(event) => setTo(event.target.value)} className="h-9" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Ga/trạm</label>
          <Select value={stationId} onValueChange={setStationId}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Tất cả ga" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả ga</SelectItem>
              {stationOptions.map((station) => (
                <SelectItem key={station.id} value={String(station.id)}>{station.stationCode}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Thiết bị</label>
          <Select value={deviceIdFilter} onValueChange={setDeviceIdFilter}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Tất cả thiết bị" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả thiết bị</SelectItem>
              {deviceOptions.map((device) => (
                <SelectItem key={device.id} value={String(device.id)}>{device.deviceCode}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Mức độ</label>
          <Select value={severity} onValueChange={setSeverity}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Tất cả mức độ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả mức độ</SelectItem>
              <SelectItem value="HIGH">Nghiêm trọng (High)</SelectItem>
              <SelectItem value="MEDIUM">Trung bình (Medium)</SelectItem>
              <SelectItem value="LOW">Thấp (Low)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Loại sự cố</label>
          <Select value={incidentType} onValueChange={setIncidentType}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Tất cả loại" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại</SelectItem>
              <SelectItem value="CONNECTION">Mất kết nối</SelectItem>
              <SelectItem value="GATE_JAMMED">Kẹt cổng</SelectItem>
              <SelectItem value="SCANNER_ERROR">Lỗi đầu đọc</SelectItem>
              <SelectItem value="DEVICE_ERROR">Lỗi thiết bị</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Trạng thái</label>
          <Select value={resolved} onValueChange={setResolved}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="false">Đang mở (Open)</SelectItem>
              <SelectItem value="true">Đã xử lý (Resolved)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end pt-1">
          <Button onClick={handleApplyFilters} disabled={loading} className="w-full">Lọc</Button>
        </div>
        <div className="flex items-end pt-1">
          <Button variant="outline" onClick={handleResetFilters} disabled={loading} className="w-full">Đặt lại</Button>
        </div>
      </div>

      {tableError && (
        <Alert variant="destructive">
          <AlertDescription>{tableError}</AlertDescription>
        </Alert>
      )}

      {/* Incidents Table */}
      <div className="rounded-md border bg-card">
        <Table className={TABLE_CLASS_NAME}>
          <TableHeader>
            <TableRow>
              <TableHead>Thời điểm xảy ra</TableHead>
              <TableHead>Ga/trạm</TableHead>
              <TableHead>Thiết bị</TableHead>
              <TableHead>Loại sự cố</TableHead>
              <TableHead>Mức độ</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Thời điểm xử lý</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">Đang tải danh sách sự cố...</TableCell>
              </TableRow>
            )}
            {!loading && incidents.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">Không có sự cố nào.</TableCell>
              </TableRow>
            )}
            {!loading &&
              incidents.map((incident) => (
                <TableRow key={incident.id}>
                  <TableCell className="font-mono">{formatDateTime(incident.occurredAt)}</TableCell>
                  <TableCell>
                    {/* Render station name from options or list fallback */}
                    {stationOptions.find((s) => s.id === incident.stationId)?.stationName ?? `Ga trạm ${incident.stationId}`}
                  </TableCell>
                  <TableCell className="font-medium">{incident.deviceCode}</TableCell>
                  <TableCell>{TYPE_LABELS[incident.incidentType] ?? incident.incidentType}</TableCell>
                  <TableCell>
                    <SeverityBadge severity={incident.severity} />
                  </TableCell>
                  <TableCell>
                    <ResolutionBadge resolvedAt={incident.resolvedAt} />
                  </TableCell>
                  <TableCell>{formatDateTime(incident.resolvedAt)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => void handleViewIncidentDetail(incident)}>
                      <Eye className="mr-1 h-3.5 w-3.5" />
                      Xem
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        {/* Pagination block */}
        <div className="flex flex-col gap-3 border-t p-3 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <span>Rows per page</span>
            <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
              <SelectTrigger className="h-8 w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={String(option)}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>{fromRow}-{toRow} of {totalElements}</div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={loading || page <= 0}
              onClick={() => void fetchIncidents(page - 1)}
            >
              Trước
            </Button>
            <span className="min-w-20 text-center">Trang {totalPages === 0 ? 0 : page + 1}/{totalPages}</span>
            <Button
              variant="outline"
              size="sm"
              disabled={loading || page + 1 >= totalPages}
              onClick={() => void fetchIncidents(page + 1)}
            >
              Sau
            </Button>
          </div>
        </div>
      </div>

      {/* Incident Detail Modal */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết sự cố thiết bị</DialogTitle>
            <DialogDescription>Xem thông tin chi tiết, trạng thái hoạt động và raw payload của sự cố.</DialogDescription>
          </DialogHeader>

          {detailLoading && (
            <div className="py-8 text-center text-sm text-muted-foreground">Đang tải thông tin chi tiết sự cố...</div>
          )}

          {detailError && (
            <Alert variant="destructive">
              <AlertDescription>{detailError}</AlertDescription>
            </Alert>
          )}

          {selectedIncident && !detailLoading && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="font-mono text-base font-bold">{selectedIncident.id}</div>
                <div className="flex gap-2">
                  <SeverityBadge severity={selectedIncident.severity} />
                  <ResolutionBadge resolvedAt={selectedIncident.resolvedAt} />
                </div>
              </div>

              {/* Grid detail */}
              <div className="grid gap-3 text-sm md:grid-cols-2">
                <div>
                  <span className="text-xs text-muted-foreground">Loại sự cố</span>
                  <div className="font-medium">{TYPE_LABELS[selectedIncident.incidentType] ?? selectedIncident.incidentType}</div>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Thời gian xảy ra</span>
                  <div className="font-medium">{formatDateTime(selectedIncident.occurredAt)}</div>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Thời gian nhận</span>
                  <div className="font-medium">{formatDateTime(selectedIncident.receivedAt)}</div>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Thời gian xử lý</span>
                  <div className="font-medium">{formatDateTime(selectedIncident.resolvedAt)}</div>
                </div>
              </div>

              {/* Device context */}
              <div className="rounded-md border p-3">
                <div className="mb-2 text-xs font-semibold text-muted-foreground uppercase">Thiết bị & Vị trí</div>
                <div className="grid gap-2 text-sm md:grid-cols-2">
                  <div><span className="text-muted-foreground">Mã thiết bị:</span> <span className="font-medium">{selectedIncident.deviceCode}</span></div>
                  <div><span className="text-muted-foreground">Loại thiết bị:</span> <span className="font-medium">{selectedIncident.deviceType}</span></div>
                  <div><span className="text-muted-foreground">Trạng thái thiết bị:</span> <span className="font-medium">{selectedIncident.deviceStatus}</span></div>
                  <div><span className="text-muted-foreground">Ga/trạm:</span> <span className="font-medium">{selectedIncident.stationName} ({selectedIncident.stationCode})</span></div>
                  <div className="md:col-span-2"><span className="text-muted-foreground">Tuyến đường:</span> <span className="font-medium">{selectedIncident.routeCode} - {selectedIncident.routeName}</span></div>
                </div>
              </div>

              {/* Payload/Message */}
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Nội dung sự cố (Message)</span>
                <div className="rounded-md border bg-muted/20 p-2 text-sm font-medium">{selectedIncident.message}</div>
              </div>

              {/* Raw Payload log */}
              {selectedIncident.payload && (
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Raw Payload (Dữ liệu gốc MongoDB)</span>
                  <pre className="max-h-40 overflow-auto rounded-md bg-slate-950 p-2.5 font-mono text-xs text-slate-100">
                    {JSON.stringify(selectedIncident.payload, null, 2)}
                  </pre>
                </div>
              )}

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDetailOpen(false)}>Đóng</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
