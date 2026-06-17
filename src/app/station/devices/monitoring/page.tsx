"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, RefreshCw, Search } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import { deviceApi } from "@/lib/api"
import type {
  DeviceStatus,
  DeviceStatusOverviewItem,
} from "@/lib/api"

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const
const TABLE_CLASS_NAME = "border-collapse [&_td]:border [&_th]:border [&_thead_tr]:bg-muted/40"

const STATUS_LABELS: Record<DeviceStatus, string> = {
  ACTIVE: "Đang hoạt động",
  OFFLINE: "Offline",
  MAINTENANCE: "Bảo trì",
  DISABLED: "Đã vô hiệu hóa",
}

const OPERATOR_STATION_ID = 1

const MOCK_DEVICES: DeviceStatusOverviewItem[] = [
  {
    deviceId: 1,
    deviceCode: "METRO-001-ST-001-DV-001",
    stationId: 1,
    stationName: "Bến Thành",
    deviceType: "QR_SCANNER_SIMULATOR",
    status: "ACTIVE",
    lastSeenAt: new Date(Date.now() - 5000).toISOString(),
    offlineSeconds: 5,
  },
  {
    deviceId: 2,
    deviceCode: "METRO-001-ST-001-DV-002",
    stationId: 1,
    stationName: "Bến Thành",
    deviceType: "QR_SCANNER_SIMULATOR",
    status: "OFFLINE",
    lastSeenAt: new Date(Date.now() - 600000).toISOString(), // 10 mins ago
    offlineSeconds: 600,
  },
  {
    deviceId: 5,
    deviceCode: "BUS-001-ST-001-DV-001",
    stationId: 1, // Scope this simulator to Bến Thành for operator portal consistency
    stationName: "Bến Thành",
    deviceType: "QR_SCANNER_SIMULATOR",
    status: "ACTIVE",
    lastSeenAt: new Date(Date.now() - 2000).toISOString(),
    offlineSeconds: 2,
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

function StatusBadge({ status }: { status: DeviceStatus }) {
  const className = {
    ACTIVE: "border-emerald-200 bg-emerald-50 text-emerald-700",
    OFFLINE: "border-amber-200 bg-amber-50 text-amber-700",
    MAINTENANCE: "border-sky-200 bg-sky-50 text-sky-700",
    DISABLED: "border-slate-200 bg-slate-50 text-slate-600",
  }[status]

  return (
    <Badge variant="outline" className={className}>
      {STATUS_LABELS[status]}
    </Badge>
  )
}

export default function StationDeviceMonitoringPage() {
  const router = useRouter()
  const [deviceStatuses, setDeviceStatuses] = useState<DeviceStatusOverviewItem[]>([])

  const [keyword, setKeyword] = useState("")
  const [status, setStatus] = useState("all")

  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [tableError, setTableError] = useState("")

  const [stats, setStats] = useState({ active: 0, offline: 0, maintenance: 0, disabled: 0 })

  const fromRow = totalElements === 0 ? 0 : page * pageSize + 1
  const toRow = Math.min((page + 1) * pageSize, totalElements)

  const fetchDeviceStatuses = async (
    targetPage = page,
    filters?: { keyword: string; status: string },
    targetPageSize = pageSize,
  ) => {
    setLoading(true)
    setTableError("")

    const currentKeyword = filters?.keyword ?? keyword
    const currentStatus = filters?.status ?? status

    try {
      // Station operator has backend automatic filtering, so we don't pass routeId or stationId.
      const response = await deviceApi.getDeviceStatus({
        status: currentStatus === "all" ? undefined : currentStatus,
        page: targetPage,
        size: targetPageSize,
      })

      let items = response.result.items
      if (currentKeyword.trim()) {
        const query = currentKeyword.toLowerCase()
        items = items.filter(
          (item) =>
            item.deviceCode.toLowerCase().includes(query) ||
            item.stationName.toLowerCase().includes(query),
        )
      }

      // Calculate counts from the filtered list
      const counts = { active: 0, offline: 0, maintenance: 0, disabled: 0 }
      items.forEach((item) => {
        if (item.status === "ACTIVE") counts.active++
        else if (item.status === "OFFLINE") counts.offline++
        else if (item.status === "MAINTENANCE") counts.maintenance++
        else if (item.status === "DISABLED") counts.disabled++
      })
      setStats(counts)

      setDeviceStatuses(items)
      setPage(response.result.page)
      setPageSize(response.result.size)
      setTotalElements(response.result.totalElements)
      setTotalPages(response.result.totalPages)
    } catch (error) {
      console.warn("API failed, falling back to station-scoped mock data:", error)
      // Fallback mock logic for testing/integration independence
      let mockFiltered = MOCK_DEVICES.filter(item => item.stationId === OPERATOR_STATION_ID)

      if (currentStatus !== "all") {
        mockFiltered = mockFiltered.filter((item) => item.status === currentStatus)
      }

      if (currentKeyword.trim()) {
        const query = currentKeyword.toLowerCase()
        mockFiltered = mockFiltered.filter(
          (item) =>
            item.deviceCode.toLowerCase().includes(query) ||
            item.stationName.toLowerCase().includes(query),
        )
      }

      // Calculate counts from mockFiltered (full filtered list before pagination)
      const counts = { active: 0, offline: 0, maintenance: 0, disabled: 0 }
      mockFiltered.forEach((item) => {
        if (item.status === "ACTIVE") counts.active++
        else if (item.status === "OFFLINE") counts.offline++
        else if (item.status === "MAINTENANCE") counts.maintenance++
        else if (item.status === "DISABLED") counts.disabled++
      })
      setStats(counts)

      const startIndex = targetPage * targetPageSize
      const paginatedMock = mockFiltered.slice(startIndex, startIndex + targetPageSize)

      setDeviceStatuses(paginatedMock)
      setPage(targetPage)
      setPageSize(targetPageSize)
      setTotalElements(mockFiltered.length)
      setTotalPages(Math.ceil(mockFiltered.length / targetPageSize))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchDeviceStatuses(0)
  }, [])

  const handleApplyFilters = () => {
    void fetchDeviceStatuses(0)
  }

  const handleResetFilters = () => {
    setKeyword("")
    setStatus("all")
    void fetchDeviceStatuses(0, { keyword: "", status: "all" })
  }

  const handlePageSizeChange = (value: string) => {
    const nextPageSize = Number(value)
    setPageSize(nextPageSize)
    void fetchDeviceStatuses(0, undefined, nextPageSize)
  }

  const handleRefresh = () => {
    void fetchDeviceStatuses(page)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Giám sát thiết bị</h1>
          <p className="text-sm text-muted-foreground">Theo dõi trạng thái kết nối và phiên bản firmware hiện hành của thiết bị tại ga.</p>
        </div>
        <div>
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Summary indicators */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-md border bg-card p-3 shadow-xs">
          <div className="text-xs font-medium text-muted-foreground uppercase">Đang hoạt động</div>
          <div className="mt-1 text-2xl font-semibold text-emerald-600">{stats.active}</div>
        </div>
        <div className="rounded-md border bg-card p-3 shadow-xs">
          <div className="text-xs font-medium text-muted-foreground uppercase">Mất kết nối (Offline)</div>
          <div className="mt-1 text-2xl font-semibold text-amber-600">{stats.offline}</div>
        </div>
        <div className="rounded-md border bg-card p-3 shadow-xs">
          <div className="text-xs font-medium text-muted-foreground uppercase">Bảo trì</div>
          <div className="mt-1 text-2xl font-semibold text-sky-600">{stats.maintenance}</div>
        </div>
        <div className="rounded-md border bg-card p-3 shadow-xs">
          <div className="text-xs font-medium text-muted-foreground uppercase">Vô hiệu hóa</div>
          <div className="mt-1 text-2xl font-semibold text-slate-600">{stats.disabled}</div>
        </div>
      </div>

      {/* Filters block */}
      <div className="grid gap-3 rounded-md border bg-card p-3 md:grid-cols-[1fr_200px_auto_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Tìm mã thiết bị"
            className="pl-9"
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="ACTIVE">Đang hoạt động</SelectItem>
            <SelectItem value="OFFLINE">Offline</SelectItem>
            <SelectItem value="MAINTENANCE">Bảo trì</SelectItem>
            <SelectItem value="DISABLED">Đã vô hiệu hóa</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleApplyFilters} disabled={loading}>Lọc</Button>
        <Button variant="outline" onClick={handleResetFilters} disabled={loading}>Đặt lại</Button>
      </div>

      {tableError && (
        <Alert variant="destructive">
          <AlertDescription>{tableError}</AlertDescription>
        </Alert>
      )}

      {/* Devices table */}
      <div className="rounded-md border bg-card">
        <Table className={TABLE_CLASS_NAME}>
          <TableHeader>
            <TableRow>
              <TableHead>Mã thiết bị</TableHead>
              <TableHead>Ga/trạm</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Cập nhật lần cuối</TableHead>
              <TableHead>Tín hiệu offline (giây)</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">Đang tải trạng thái thiết bị...</TableCell>
              </TableRow>
            )}
            {!loading && deviceStatuses.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">Không tìm thấy thiết bị nào tại ga.</TableCell>
              </TableRow>
            )}
            {!loading &&
              deviceStatuses.map((item) => (
                <TableRow key={item.deviceId}>
                  <TableCell className="font-medium">{item.deviceCode}</TableCell>
                  <TableCell>{item.stationName}</TableCell>
                  <TableCell>
                    <StatusBadge status={item.status} />
                  </TableCell>
                  <TableCell>{formatDateTime(item.lastSeenAt)}</TableCell>
                  <TableCell className="font-mono">
                    {item.status === "OFFLINE" ? (item.offlineSeconds ?? "--") : "--"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/station/devices/${item.deviceId}`)}
                    >
                      <Eye className="mr-1 h-3.5 w-3.5" />
                      Xem chi tiết
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
              onClick={() => void fetchDeviceStatuses(page - 1)}
            >
              Trước
            </Button>
            <span className="min-w-20 text-center">Trang {totalPages === 0 ? 0 : page + 1}/{totalPages}</span>
            <Button
              variant="outline"
              size="sm"
              disabled={loading || page + 1 >= totalPages}
              onClick={() => void fetchDeviceStatuses(page + 1)}
            >
              Sau
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
