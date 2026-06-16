"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, Search } from "lucide-react"

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
import { deviceApi, routeApi, stationApi, transactionApi } from "@/lib/api"
import type {
  Device,
  ListTransactionsQuery,
  Station,
  TapType,
  TicketProcessingStatus,
  Transaction,
  TransactionDecision,
  TransactionReason,
  TransactionSyncStatus,
  TransitRoute,
} from "@/lib/api"
import { getApiErrorMessage } from "@/lib/messages"

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const
const TABLE_CLASS_NAME = "border-collapse [&_td]:border [&_th]:border [&_thead_tr]:bg-muted/40"

const TAP_TYPE_LABELS: Record<TapType, string> = {
  TAP_IN: "Vào",
  TAP_OUT: "Ra",
  CHECK: "Kiểm tra",
}

const DECISION_LABELS: Record<TransactionDecision, string> = {
  OPEN_GATE: "Mở cổng",
  DENY: "Từ chối",
  ACCEPTED_FOR_FORWARDING: "Đã nhận",
}

const SYNC_STATUS_LABELS: Record<TransactionSyncStatus, string> = {
  PENDING: "Chờ đồng bộ",
  SYNCED: "Đã đồng bộ",
  FAILED: "Lỗi",
}

const TICKET_PROCESSING_LABELS: Record<TicketProcessingStatus, string> = {
  PENDING: "Chờ xử lý",
  CONFIRMED: "Đã xác nhận",
  FAILED: "Lỗi",
}

const REASONS: TransactionReason[] = [
  "VALID",
  "DEVICE_DISABLED",
  "INVALID_DIRECTION",
  "MEDIA_BLACKLISTED",
  "CARD_INACTIVE",
  "CARD_CANCELLED",
  "UNKNOWN_MEDIA",
  "QR_EXPIRED",
  "QR_INVALID_SIGNATURE",
  "QR_REPLAYED",
  "ENTITLEMENT_EXPIRED",
  "ENTITLEMENT_INACTIVE",
  "TICKET_INVALID",
  "TICKET_EXPIRED",
  "TICKET_ALREADY_USED",
  "TICKET_SCOPE_INVALID",
  "ACTIVE_PRODUCT_CONFLICT",
]

interface TransactionsPageProps {
  detailBasePath: string
  stationScoped?: boolean
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
    second: "2-digit",
  }).format(date)
}

function toApiDateTime(value: string) {
  return value ? `${value}:00+07:00` : undefined
}

function parseNumericFilter(value: string) {
  if (value === "all" || value.trim() === "") return undefined
  const numericValue = Number(value)

  return Number.isInteger(numericValue) && numericValue > 0 ? numericValue : undefined
}

function DecisionBadge({ decision }: { decision: TransactionDecision }) {
  const className = {
    OPEN_GATE: "border-emerald-200 bg-emerald-50 text-emerald-700",
    DENY: "border-rose-200 bg-rose-50 text-rose-700",
    ACCEPTED_FOR_FORWARDING: "border-sky-200 bg-sky-50 text-sky-700",
  }[decision]

  return <Badge variant="outline" className={className}>{DECISION_LABELS[decision]}</Badge>
}

function SyncBadge({ status }: { status: TransactionSyncStatus }) {
  const className = {
    PENDING: "border-amber-200 bg-amber-50 text-amber-700",
    SYNCED: "border-emerald-200 bg-emerald-50 text-emerald-700",
    FAILED: "border-rose-200 bg-rose-50 text-rose-700",
  }[status]

  return <Badge variant="outline" className={className}>{SYNC_STATUS_LABELS[status]}</Badge>
}

export function TransactionsPage({ detailBasePath, stationScoped = false }: TransactionsPageProps) {
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [routeOptions, setRouteOptions] = useState<TransitRoute[]>([])
  const [stationOptions, setStationOptions] = useState<Station[]>([])
  const [deviceOptions, setDeviceOptions] = useState<Device[]>([])
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [routeId, setRouteId] = useState("all")
  const [stationId, setStationId] = useState("all")
  const [deviceId, setDeviceId] = useState("all")
  const [cardId, setCardId] = useState("")
  const [ticketId, setTicketId] = useState("")
  const [entitlementId, setEntitlementId] = useState("")
  const [tapType, setTapType] = useState("all")
  const [decision, setDecision] = useState("all")
  const [reason, setReason] = useState("all")
  const [syncStatus, setSyncStatus] = useState("all")
  const [ticketProcessingStatus, setTicketProcessingStatus] = useState("all")
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [tableError, setTableError] = useState("")
  const [filterError, setFilterError] = useState("")

  const fromRow = totalElements === 0 ? 0 : page * pageSize + 1
  const toRow = Math.min((page + 1) * pageSize, totalElements)

  const loadOptions = async () => {
    try {
      const [routesResponse, stationsResponse, devicesResponse] = await Promise.all([
        stationScoped ? Promise.resolve(null) : routeApi.listRoutes({ page: 0, size: 100 }),
        stationScoped ? Promise.resolve(null) : stationApi.listStations({ page: 0, size: 100 }),
        deviceApi.listDevices({ page: 0, size: 100 }),
      ])

      setRouteOptions(routesResponse?.result.items ?? [])
      setStationOptions(stationsResponse?.result.items ?? [])
      setDeviceOptions(devicesResponse.result.items)
    } catch (error) {
      setTableError(getApiErrorMessage(error))
    }
  }

  const buildQuery = (targetPage: number, targetPageSize: number): ListTransactionsQuery => ({
    from: toApiDateTime(from),
    to: toApiDateTime(to),
    routeId: stationScoped ? undefined : parseNumericFilter(routeId),
    stationId: stationScoped ? undefined : parseNumericFilter(stationId),
    deviceId: parseNumericFilter(deviceId),
    cardId: cardId.trim() || undefined,
    ticketId: ticketId.trim() || undefined,
    entitlementId: entitlementId.trim() || undefined,
    tapType: tapType === "all" ? undefined : tapType as TapType,
    decision: decision === "all" ? undefined : decision as TransactionDecision,
    reason: reason === "all" ? undefined : reason as TransactionReason,
    syncStatus: syncStatus === "all" ? undefined : syncStatus as TransactionSyncStatus,
    ticketProcessingStatus: ticketProcessingStatus === "all" ? undefined : ticketProcessingStatus as TicketProcessingStatus,
    page: targetPage,
    size: targetPageSize,
  })

  const loadTransactions = async (targetPage = page, targetPageSize = pageSize) => {
    if (from && to && from > to) {
      setFilterError("Thời gian bắt đầu phải trước hoặc bằng thời gian kết thúc.")
      return
    }

    setFilterError("")
    setLoading(true)
    setTableError("")

    try {
      const response = await transactionApi.searchTransactions(buildQuery(targetPage, targetPageSize))
      setTransactions(response.result.items)
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
    void loadOptions()
    void loadTransactions(0)
  }, [])

  const handleResetFilters = () => {
    setFrom("")
    setTo("")
    setFilterError("")
    setRouteId("all")
    setStationId("all")
    setDeviceId("all")
    setCardId("")
    setTicketId("")
    setEntitlementId("")
    setTapType("all")
    setDecision("all")
    setReason("all")
    setSyncStatus("all")
    setTicketProcessingStatus("all")
    setTimeout(() => void loadTransactions(0), 0)
  }

  const handlePageSizeChange = (value: string) => {
    const nextPageSize = Number(value)
    setPageSize(nextPageSize)
    void loadTransactions(0, nextPageSize)
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Giao dịch vé</h1>
        <p className="text-sm text-muted-foreground">
          Tra cứu transaction sinh ra từ lượt quét QR/card đã ghi nhận trong hệ thống AFC.
        </p>
      </div>

      <div className="rounded-md border bg-card p-3">
        <div className="grid gap-3 lg:grid-cols-4">
          <Input type="datetime-local" value={from} onChange={(event) => setFrom(event.target.value)} aria-label="Từ ngày giờ" />
          <Input type="datetime-local" value={to} onChange={(event) => setTo(event.target.value)} aria-label="Đến ngày giờ" />
          {!stationScoped && (
            <Select value={routeId} onValueChange={setRouteId}>
              <SelectTrigger><SelectValue placeholder="Tuyến" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả tuyến</SelectItem>
                {routeOptions.map((route) => <SelectItem key={route.id} value={String(route.id)}>{route.routeCode}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
          {!stationScoped && (
            <Select value={stationId} onValueChange={setStationId}>
              <SelectTrigger><SelectValue placeholder="Ga/trạm" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả ga/trạm</SelectItem>
                {stationOptions.map((station) => <SelectItem key={station.id} value={String(station.id)}>{station.stationCode}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
          <Select value={deviceId} onValueChange={setDeviceId}>
            <SelectTrigger><SelectValue placeholder="Thiết bị" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả thiết bị</SelectItem>
              {deviceOptions.map((device) => <SelectItem key={device.id} value={String(device.id)}>{device.deviceCode}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={cardId} onChange={(event) => setCardId(event.target.value)} placeholder="Card ID" className="pl-9" />
          </div>
          <Input value={ticketId} onChange={(event) => setTicketId(event.target.value)} placeholder="Ticket ID" />
          <Input value={entitlementId} onChange={(event) => setEntitlementId(event.target.value)} placeholder="Entitlement ID" />
          <Select value={tapType} onValueChange={setTapType}>
            <SelectTrigger><SelectValue placeholder="Tap type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả tap</SelectItem>
              <SelectItem value="TAP_IN">Vào</SelectItem>
              <SelectItem value="TAP_OUT">Ra</SelectItem>
              <SelectItem value="CHECK">Kiểm tra</SelectItem>
            </SelectContent>
          </Select>
          <Select value={decision} onValueChange={setDecision}>
            <SelectTrigger><SelectValue placeholder="Decision" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả decision</SelectItem>
              <SelectItem value="OPEN_GATE">Mở cổng</SelectItem>
              <SelectItem value="DENY">Từ chối</SelectItem>
              <SelectItem value="ACCEPTED_FOR_FORWARDING">Đã nhận</SelectItem>
            </SelectContent>
          </Select>
          <Select value={reason} onValueChange={setReason}>
            <SelectTrigger><SelectValue placeholder="Reason" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả reason</SelectItem>
              {REASONS.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={syncStatus} onValueChange={setSyncStatus}>
            <SelectTrigger><SelectValue placeholder="Sync status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả sync</SelectItem>
              <SelectItem value="PENDING">Chờ đồng bộ</SelectItem>
              <SelectItem value="SYNCED">Đã đồng bộ</SelectItem>
              <SelectItem value="FAILED">Lỗi</SelectItem>
            </SelectContent>
          </Select>
          <Select value={ticketProcessingStatus} onValueChange={setTicketProcessingStatus}>
            <SelectTrigger><SelectValue placeholder="Ticket processing" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả xử lý vé</SelectItem>
              <SelectItem value="PENDING">Chờ xử lý</SelectItem>
              <SelectItem value="CONFIRMED">Đã xác nhận</SelectItem>
              <SelectItem value="FAILED">Lỗi</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mt-3 flex flex-wrap justify-end gap-2">
          <Button variant="outline" onClick={handleResetFilters} disabled={loading}>Đặt lại</Button>
          <Button onClick={() => void loadTransactions(0)} disabled={loading}>Lọc</Button>
        </div>
        {filterError && <p className="mt-2 text-sm text-destructive">{filterError}</p>}
      </div>

      {tableError && <Alert variant="destructive"><AlertDescription>{tableError}</AlertDescription></Alert>}

      <div className="rounded-md border">
        <Table className={TABLE_CLASS_NAME}>
          <TableHeader>
            <TableRow>
              <TableHead>Occurred at</TableHead>
              <TableHead>Event ID</TableHead>
              <TableHead>Station</TableHead>
              <TableHead>Device</TableHead>
              <TableHead>Tap</TableHead>
              <TableHead>Decision</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Sync</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && <TableRow><TableCell colSpan={9} className="h-24 text-center text-muted-foreground">Đang tải giao dịch...</TableCell></TableRow>}
            {!loading && transactions.length === 0 && <TableRow><TableCell colSpan={9} className="h-24 text-center text-muted-foreground">Không có giao dịch phù hợp.</TableCell></TableRow>}
            {!loading && transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{formatDateTime(transaction.occurredAt)}</TableCell>
                <TableCell className="font-medium">{transaction.eventId}</TableCell>
                <TableCell>
                  <div>{transaction.stationCode ?? transaction.stationId}</div>
                  <div className="text-xs text-muted-foreground">{transaction.stationName ?? "--"}</div>
                </TableCell>
                <TableCell>{transaction.deviceCode}</TableCell>
                <TableCell>{TAP_TYPE_LABELS[transaction.tapType]}</TableCell>
                <TableCell><DecisionBadge decision={transaction.decision} /></TableCell>
                <TableCell className="max-w-48 truncate">{transaction.reason}</TableCell>
                <TableCell><SyncBadge status={transaction.syncStatus} /></TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    <Button variant="ghost" size="icon" aria-label={`Xem giao dịch ${transaction.eventId}`} onClick={() => router.push(`${detailBasePath}/${transaction.id}`)}>
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
            <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
              <SelectTrigger className="h-8 w-24"><SelectValue /></SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map((option) => <SelectItem key={option} value={String(option)}>{option}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>{fromRow}-{toRow} of {totalElements}</div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={loading || page <= 0} onClick={() => void loadTransactions(page - 1)}>Trước</Button>
            <span className="min-w-20 text-center">Trang {totalPages === 0 ? 0 : page + 1}/{totalPages}</span>
            <Button variant="outline" size="sm" disabled={loading || page + 1 >= totalPages} onClick={() => void loadTransactions(page + 1)}>Sau</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
