"use client"

import { useEffect, useState } from "react"
import { Eye, RefreshCw } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { controlPackageApi } from "@/lib/api"
import type {
  ControlPackageType,
  ControlSync,
  ControlSyncDetail,
  ControlSyncStatus,
  SearchControlSyncsQuery,
} from "@/lib/api"
import { getApiErrorMessage } from "@/lib/messages"

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const
const TABLE_CLASS_NAME = "border-collapse [&_td]:border [&_th]:border [&_thead_tr]:bg-muted/40"

const PACKAGE_TYPE_LABELS: Record<ControlPackageType, string> = {
  DEVICE_CONFIG: "Cấu hình thiết bị",
  MEDIA_ACCESS_RULES: "Quy tắc media",
}

const STATUS_LABELS: Record<ControlSyncStatus, string> = {
  PENDING: "Chờ áp dụng",
  APPLIED: "Đã áp dụng",
  FAILED: "Lỗi",
}

const STATUS_CLASS: Record<ControlSyncStatus, string> = {
  PENDING: "border-amber-200 bg-amber-50 text-amber-700",
  APPLIED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  FAILED: "border-rose-200 bg-rose-50 text-rose-700",
}

interface ControlSyncsPageProps {
  scopeLabel: string
}

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
  }).format(date)
}

function StatusBadge({ status }: { status: ControlSyncStatus }) {
  return <Badge variant="outline" className={STATUS_CLASS[status]}>{STATUS_LABELS[status]}</Badge>
}

function Field({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div>
      <span className="text-muted-foreground">{label}</span>
      <div className="break-words font-medium">{value ?? "--"}</div>
    </div>
  )
}

export function ControlSyncsPage({ scopeLabel }: ControlSyncsPageProps) {
  const [syncs, setSyncs] = useState<ControlSync[]>([])
  const [packageType, setPackageType] = useState("all")
  const [version, setVersion] = useState("")
  const [stationId, setStationId] = useState("")
  const [status, setStatus] = useState("all")
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [tableError, setTableError] = useState("")
  const [filterError, setFilterError] = useState("")

  const [detailOpen, setDetailOpen] = useState(false)
  const [detail, setDetail] = useState<ControlSyncDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState("")

  const fromRow = totalElements === 0 ? 0 : page * pageSize + 1
  const toRow = Math.min((page + 1) * pageSize, totalElements)

  const toNumber = (value: string, label: string) => {
    if (!value.trim()) return undefined

    const parsed = Number(value)
    if (!Number.isInteger(parsed) || parsed < 0) {
      throw new Error(`${label} không hợp lệ.`)
    }

    return parsed
  }

  const buildQuery = (targetPage: number, targetPageSize: number): SearchControlSyncsQuery => ({
    packageType: packageType === "all" ? undefined : packageType as ControlPackageType,
    version: toNumber(version, "Version"),
    stationId: toNumber(stationId, "Station ID"),
    status: status === "all" ? undefined : status as ControlSyncStatus,
    page: targetPage,
    size: targetPageSize,
  })

  const loadSyncs = async (targetPage = page, targetPageSize = pageSize) => {
    setFilterError("")
    setLoading(true)
    setTableError("")

    let query: SearchControlSyncsQuery
    try {
      query = buildQuery(targetPage, targetPageSize)
    } catch (error) {
      setFilterError(error instanceof Error ? error.message : "Bộ lọc không hợp lệ.")
      setLoading(false)
      return
    }

    try {
      const response = await controlPackageApi.searchSyncs(query)
      setSyncs(response.result.items)
      setPage(response.result.page)
      setPageSize(response.result.size)
      setTotalElements(response.result.totalElements)
      setTotalPages(response.result.totalPages)
    } catch (error) {
      setTableError(getApiErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadSyncs(0)
  }, [])

  const resetFilters = () => {
    setPackageType("all")
    setVersion("")
    setStationId("")
    setStatus("all")
    setFilterError("")
    setTimeout(() => void loadSyncs(0), 0)
  }

  const openDetail = async (sync: ControlSync) => {
    setDetailOpen(true)
    setDetail(null)
    setDetailError("")
    setDetailLoading(true)

    try {
      const response = await controlPackageApi.getSyncDetail(sync.syncId)
      setDetail(response.result)
    } catch (error) {
      setDetailError(getApiErrorMessage(error))
    } finally {
      setDetailLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Trạng thái áp dụng</h1>
        <p className="text-sm text-muted-foreground">
          Theo dõi station_control_syncs sau khi control package được phát hành. Phạm vi dữ liệu: {scopeLabel}.
        </p>
      </div>

      <div className="rounded-md border bg-card p-3">
        <div className="grid gap-3 lg:grid-cols-4">
          <Select value={packageType} onValueChange={setPackageType}>
            <SelectTrigger><SelectValue placeholder="Package type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại</SelectItem>
              <SelectItem value="DEVICE_CONFIG">Cấu hình thiết bị</SelectItem>
              <SelectItem value="MEDIA_ACCESS_RULES">Quy tắc media</SelectItem>
            </SelectContent>
          </Select>
          <Input value={version} onChange={(event) => setVersion(event.target.value)} placeholder="Version" inputMode="numeric" />
          <Input value={stationId} onChange={(event) => setStationId(event.target.value)} placeholder="Station ID" inputMode="numeric" />
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger><SelectValue placeholder="Sync status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="PENDING">Chờ áp dụng</SelectItem>
              <SelectItem value="APPLIED">Đã áp dụng</SelectItem>
              <SelectItem value="FAILED">Lỗi</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mt-3 flex flex-wrap justify-end gap-2">
          <Button variant="outline" onClick={resetFilters} disabled={loading}>Đặt lại</Button>
          <Button onClick={() => void loadSyncs(0)} disabled={loading}>Lọc</Button>
        </div>
        {filterError && <p className="mt-2 text-sm text-destructive">{filterError}</p>}
      </div>

      {tableError && <Alert variant="destructive"><AlertDescription>{tableError}</AlertDescription></Alert>}

      <div className="rounded-md border">
        <Table className={TABLE_CLASS_NAME}>
          <TableHeader>
            <TableRow>
              <TableHead>Sync ID</TableHead>
              <TableHead>Ga/Trạm</TableHead>
              <TableHead>Package</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Retry</TableHead>
              <TableHead>Last attempt</TableHead>
              <TableHead>Applied at</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && <TableRow><TableCell colSpan={8} className="h-24 text-center text-muted-foreground">Đang tải trạng thái áp dụng...</TableCell></TableRow>}
            {!loading && syncs.length === 0 && <TableRow><TableCell colSpan={8} className="h-24 text-center text-muted-foreground">Chưa có trạng thái áp dụng phù hợp.</TableCell></TableRow>}
            {!loading && syncs.map((sync) => (
              <TableRow key={sync.syncId}>
                <TableCell className="font-medium">{sync.syncId}</TableCell>
                <TableCell>
                  <div>{sync.stationName}</div>
                  <div className="text-xs text-muted-foreground">{sync.stationCode} · ID {sync.stationId}</div>
                </TableCell>
                <TableCell>
                  <div>v{sync.version}</div>
                  <div className="text-xs text-muted-foreground">{PACKAGE_TYPE_LABELS[sync.packageType]}</div>
                </TableCell>
                <TableCell><StatusBadge status={sync.syncStatus} /></TableCell>
                <TableCell>{sync.retryCount}</TableCell>
                <TableCell>{formatDateTime(sync.lastAttemptAt)}</TableCell>
                <TableCell>{formatDateTime(sync.appliedAt)}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" aria-label={`Đồng bộ ngay ${sync.stationCode}`} onClick={async () => {
                      try {
                        await controlPackageApi.triggerDeviceSync(sync.stationCode)
                      } catch {
                        // handled by API error display
                      }
                    }}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label={`Xem sync ${sync.syncId}`} onClick={() => void openDetail(sync)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex flex-col gap-3 border-t p-3 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <span>Rows per page</span>
            <Select value={String(pageSize)} onValueChange={(value) => {
              const nextPageSize = Number(value)
              setPageSize(nextPageSize)
              void loadSyncs(0, nextPageSize)
            }}>
              <SelectTrigger className="h-8 w-24"><SelectValue /></SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map((option) => <SelectItem key={option} value={String(option)}>{option}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>{fromRow}-{toRow} of {totalElements}</div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={loading || page <= 0} onClick={() => void loadSyncs(page - 1)}>Trước</Button>
            <span className="min-w-20 text-center">Trang {totalPages === 0 ? 0 : page + 1}/{totalPages}</span>
            <Button variant="outline" size="sm" disabled={loading || page + 1 >= totalPages} onClick={() => void loadSyncs(page + 1)}>Sau</Button>
          </div>
        </div>
      </div>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết trạng thái áp dụng</DialogTitle>
            <DialogDescription>Thông tin áp dụng control package tại ga/trạm.</DialogDescription>
          </DialogHeader>
          {detailError && <Alert variant="destructive"><AlertDescription>{detailError}</AlertDescription></Alert>}
          {detailLoading && <div className="rounded-md border p-3 text-sm text-muted-foreground">Đang tải chi tiết...</div>}
          {detail && !detailLoading && (
            <div className="space-y-4">
              <div className="grid gap-3 rounded-md border bg-card p-3 text-sm md:grid-cols-2">
                <Field label="Sync ID" value={detail.syncId} />
                <Field label="Trạng thái" value={STATUS_LABELS[detail.syncStatus]} />
                <Field label="Ga/Trạm" value={`${detail.stationName} (${detail.stationCode})`} />
                <Field label="Tuyến" value={detail.routeName} />
                <Field label="Package" value={`v${detail.version} · ${PACKAGE_TYPE_LABELS[detail.packageType]}`} />
                <Field label="Package status" value={detail.packageStatus} />
                <Field label="Retry count" value={detail.retryCount} />
                <Field label="Last attempt" value={formatDateTime(detail.lastAttemptAt)} />
                <Field label="Applied at" value={formatDateTime(detail.appliedAt)} />
                <Field label="Updated at" value={formatDateTime(detail.updatedAt)} />
              </div>
              <div className="rounded-md border bg-muted/30 p-3 text-sm">
                <div className="mb-1 font-medium">Error message</div>
                <div className="whitespace-pre-wrap text-muted-foreground">{detail.errorMessage || "--"}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
