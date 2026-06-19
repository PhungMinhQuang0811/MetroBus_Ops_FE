"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { Activity, AlertTriangle, BarChart3, Gauge, RefreshCw, Server, Settings2, Ticket } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { dashboardApi, routeApi, stationApi } from "@/lib/api"
import type {
  DashboardAlertItem,
  DashboardBucket,
  DashboardRecentIncidentItem,
  DashboardRouteStationSummaryItem,
  DashboardSummaryResponse,
  DashboardTransactionTimelineItem,
  Station,
  TransitRoute,
} from "@/lib/api"
import { getApiErrorMessage } from "@/lib/messages"
import { ROUTES } from "@/lib/routes"
import { cn } from "@/lib/utils"

const TABLE_CLASS_NAME = "border-collapse [&_td]:border [&_th]:border [&_thead_tr]:bg-muted/40"

function toDatetimeLocal(date: Date) {
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)

  return offsetDate.toISOString().slice(0, 16)
}

function toApiDateTime(value: string) {
  if (!value) return undefined
  const date = new Date(value)

  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

function parseNumericFilter(value: string) {
  if (value === "all" || value.trim() === "") return undefined
  const numericValue = Number(value)

  return Number.isInteger(numericValue) && numericValue > 0 ? numericValue : undefined
}

function formatNumber(value?: number | null) {
  return new Intl.NumberFormat("vi-VN").format(value ?? 0)
}

function formatPercent(value?: number | null) {
  return `${new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 2 }).format(value ?? 0)}%`
}

function formatDateTime(value?: string | null) {
  if (!value) return "--"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

function formatTimePoint(value: string, bucket: DashboardBucket) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    ...(bucket === "hour" ? { hour: "2-digit" as const } : {}),
  }).format(date)
}

function getSeverityClassName(severity?: string) {
  const normalized = severity?.toUpperCase()

  if (normalized === "CRITICAL" || normalized === "HIGH") return "border-rose-200 bg-rose-50 text-rose-700"
  if (normalized === "MEDIUM") return "border-amber-200 bg-amber-50 text-amber-700"

  return "border-sky-200 bg-sky-50 text-sky-700"
}

function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = "default",
}: {
  label: string
  value: string
  detail?: string
  icon: typeof Ticket
  tone?: "default" | "danger" | "warning" | "success"
}) {
  const toneClassName = {
    default: "bg-sky-50 text-sky-700",
    danger: "bg-rose-50 text-rose-700",
    warning: "bg-amber-50 text-amber-700",
    success: "bg-emerald-50 text-emerald-700",
  }[tone]

  return (
    <Card className="gap-3 rounded-md py-4 shadow-none">
      <CardContent className="flex items-start justify-between gap-3 px-4">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-normal">{value}</p>
          {detail && <p className="mt-1 text-xs text-muted-foreground">{detail}</p>}
        </div>
        <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-md", toneClassName)}>
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyRow({ colSpan, label }: { colSpan: number; label: string }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-20 text-center text-muted-foreground">
        {label}
      </TableCell>
    </TableRow>
  )
}

export function ManagerDashboardPage() {
  const now = useMemo(() => new Date(), [])
  const [from, setFrom] = useState(() => toDatetimeLocal(new Date(now.getTime() - 24 * 60 * 60 * 1000)))
  const [to, setTo] = useState(() => toDatetimeLocal(now))
  const [routeId, setRouteId] = useState("all")
  const [stationId, setStationId] = useState("all")
  const [bucket, setBucket] = useState<DashboardBucket>("hour")
  const [routeOptions, setRouteOptions] = useState<TransitRoute[]>([])
  const [stationOptions, setStationOptions] = useState<Station[]>([])
  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null)
  const [timeline, setTimeline] = useState<DashboardTransactionTimelineItem[]>([])
  const [routeStationSummaries, setRouteStationSummaries] = useState<DashboardRouteStationSummaryItem[]>([])
  const [recentIncidents, setRecentIncidents] = useState<DashboardRecentIncidentItem[]>([])
  const [alerts, setAlerts] = useState<DashboardAlertItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [filterError, setFilterError] = useState("")

  const buildFilterQuery = (nextValues?: { from?: string; to?: string; routeId?: string; stationId?: string }) => ({
    from: toApiDateTime(nextValues?.from ?? from),
    to: toApiDateTime(nextValues?.to ?? to),
    routeId: parseNumericFilter(nextValues?.routeId ?? routeId),
    stationId: parseNumericFilter(nextValues?.stationId ?? stationId),
  })

  const hasInvalidTimeRange = (nextFrom = from, nextTo = to) => {
    return Boolean(nextFrom && nextTo && nextFrom > nextTo)
  }

  const chartItems = timeline.map((item) => ({
    ...item,
    label: formatTimePoint(item.timePoint, bucket),
  }))

  const decisionTotal = summary?.transactionSummary.total ?? 0
  const decisionItems = [
    { label: "Mở cổng", value: summary?.transactionSummary.openGate ?? 0, className: "bg-emerald-500" },
    { label: "Từ chối", value: summary?.transactionSummary.deny ?? 0, className: "bg-rose-500" },
    { label: "Đã nhận", value: summary?.transactionSummary.acceptedForForwarding ?? 0, className: "bg-sky-500" },
  ]

  const loadOptions = async () => {
    try {
      const [routesResponse, stationsResponse] = await Promise.all([
        routeApi.listRoutes({ page: 0, size: 100 }),
        stationApi.listStations({ page: 0, size: 100 }),
      ])

      setRouteOptions(routesResponse.result.items)
      setStationOptions(stationsResponse.result.items)
    } catch (loadError) {
      setError(getApiErrorMessage(loadError))
    }
  }

  const loadDashboard = async (nextValues?: { from?: string; to?: string; routeId?: string; stationId?: string; bucket?: DashboardBucket }) => {
    const nextFrom = nextValues?.from ?? from
    const nextTo = nextValues?.to ?? to
    const nextBucket = nextValues?.bucket ?? bucket
    const nextFilterQuery = buildFilterQuery(nextValues)

    if (hasInvalidTimeRange(nextFrom, nextTo)) {
      setFilterError("Thời gian bắt đầu phải trước hoặc bằng thời gian kết thúc.")
      return
    }

    setFilterError("")
    setError("")
    setLoading(true)

    try {
      const [
        summaryResponse,
        timelineResponse,
        routeStationResponse,
        incidentsResponse,
        alertsResponse,
      ] = await Promise.all([
        dashboardApi.getSummary(nextFilterQuery),
        dashboardApi.getTransactionTimeline({ ...nextFilterQuery, bucket: nextBucket }),
        dashboardApi.getRouteStationSummaries(nextFilterQuery),
        dashboardApi.getRecentIncidents({ ...nextFilterQuery, limit: 5 }),
        dashboardApi.getAlerts({ ...nextFilterQuery, limit: 6 }),
      ])

      setSummary(summaryResponse.result)
      setTimeline(timelineResponse.result.items)
      setRouteStationSummaries(routeStationResponse.result.items)
      setRecentIncidents(incidentsResponse.result.items)
      setAlerts(alertsResponse.result.items)
    } catch (loadError) {
      setError(getApiErrorMessage(loadError))
      setSummary(null)
      setTimeline([])
      setRouteStationSummaries([])
      setRecentIncidents([])
      setAlerts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadOptions()
    void loadDashboard()
  }, [])

  const handleResetFilters = () => {
    const nextTo = new Date()
    const nextFromValue = toDatetimeLocal(new Date(nextTo.getTime() - 24 * 60 * 60 * 1000))
    const nextToValue = toDatetimeLocal(nextTo)

    setFrom(nextFromValue)
    setTo(nextToValue)
    setRouteId("all")
    setStationId("all")
    setBucket("hour")
    setFilterError("")
    void loadDashboard({ from: nextFromValue, to: nextToValue, routeId: "all", stationId: "all", bucket: "hour" })
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Dashboard vận hành Cấp 4</h1>
          <p className="text-sm text-muted-foreground">
            Tổng hợp giao dịch, thiết bị, sự cố, lô dữ liệu và trạng thái áp dụng cấu hình.
          </p>
        </div>
        <Button variant="outline" onClick={() => void loadDashboard()} disabled={loading} className="gap-2">
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          Làm mới
        </Button>
      </div>

      <div className="rounded-md border bg-card p-3">
        <div className="grid gap-3 lg:grid-cols-6">
          <Input type="datetime-local" value={from} onChange={(event) => setFrom(event.target.value)} aria-label="Từ ngày giờ" />
          <Input type="datetime-local" value={to} onChange={(event) => setTo(event.target.value)} aria-label="Đến ngày giờ" />
          <Select value={routeId} onValueChange={setRouteId}>
            <SelectTrigger><SelectValue placeholder="Tuyến" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả tuyến</SelectItem>
              {routeOptions.map((route) => <SelectItem key={route.id} value={String(route.id)}>{route.routeCode}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={stationId} onValueChange={setStationId}>
            <SelectTrigger><SelectValue placeholder="Ga/trạm" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả ga/trạm</SelectItem>
              {stationOptions.map((station) => <SelectItem key={station.id} value={String(station.id)}>{station.stationCode}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={bucket} onValueChange={(value) => setBucket(value as DashboardBucket)}>
            <SelectTrigger><SelectValue placeholder="Bucket" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="hour">Theo giờ</SelectItem>
              <SelectItem value="day">Theo ngày</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleResetFilters} disabled={loading} className="flex-1">Đặt lại</Button>
            <Button onClick={() => void loadDashboard()} disabled={loading} className="flex-1">Áp dụng</Button>
          </div>
        </div>
        {filterError && <p className="mt-2 text-sm text-destructive">{filterError}</p>}
      </div>

      {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Ticket} label="Giao dịch vé" value={formatNumber(summary?.transactionSummary.total)} detail={`Mở cổng ${formatNumber(summary?.transactionSummary.openGate)} | Từ chối ${formatNumber(summary?.transactionSummary.deny)}`} tone="success" />
        <StatCard icon={Gauge} label="Tỷ lệ từ chối" value={formatPercent(summary?.transactionSummary.denyRate)} detail={`Đã nhận ${formatNumber(summary?.transactionSummary.acceptedForForwarding)}`} tone={(summary?.transactionSummary.denyRate ?? 0) > 5 ? "warning" : "default"} />
        <StatCard icon={Server} label="Thiết bị offline" value={formatNumber(summary?.deviceSummary.offline)} detail={`Active ${formatNumber(summary?.deviceSummary.active)} | Bảo trì ${formatNumber(summary?.deviceSummary.maintenance)}`} tone={(summary?.deviceSummary.offline ?? 0) > 0 ? "danger" : "success"} />
        <StatCard icon={AlertTriangle} label="Sự cố mở" value={formatNumber(summary?.incidentSummary.open)} detail={`High ${formatNumber(summary?.incidentSummary.high)} | Tổng ${formatNumber(summary?.incidentSummary.total)}`} tone={(summary?.incidentSummary.open ?? 0) > 0 ? "warning" : "success"} />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card className="rounded-md shadow-none">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Giao dịch vé theo thời gian</CardTitle>
            <Button variant="ghost" size="sm" asChild><Link href={ROUTES.manager.transactions}>Xem giao dịch vé</Link></Button>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              {chartItems.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Không có dữ liệu giao dịch.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartItems}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
                    <YAxis tickLine={false} axisLine={false} fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="openGate" name="Mở cổng" fill="#16a34a" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="deny" name="Từ chối" fill="#e11d48" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="acceptedForForwarding" name="Đã nhận" fill="#0284c7" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-md shadow-none">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Quyết định xử lý</CardTitle>
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            {decisionItems.map((item) => {
              const percent = decisionTotal === 0 ? 0 : (item.value / decisionTotal) * 100

              return (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{item.label}</span>
                    <span className="font-medium">{formatNumber(item.value)} ({formatPercent(percent)})</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-md bg-muted">
                    <div className={cn("h-full rounded-md", item.className)} style={{ width: `${Math.min(percent, 100)}%` }} />
                  </div>
                </div>
              )
            })}
            <Button variant="outline" size="sm" asChild><Link href={ROUTES.manager.transactions}>Xem giao dịch bị từ chối</Link></Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card className="rounded-md shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Giao dịch theo tuyến/station</CardTitle>
          </CardHeader>
          <CardContent>
            <Table className={TABLE_CLASS_NAME}>
              <TableHeader>
                <TableRow>
                  <TableHead>Route/Station</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Open</TableHead>
                  <TableHead className="text-right">Deny</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {routeStationSummaries.length === 0 && <EmptyRow colSpan={4} label="Không có dữ liệu tuyến/station." />}
                {routeStationSummaries.slice(0, 8).map((item) => (
                  <TableRow key={`${item.routeId}-${item.stationId}`}>
                    <TableCell>
                      <div className="font-medium">{item.routeCode ?? item.routeId}</div>
                      <div className="text-xs text-muted-foreground">{item.stationCode ?? item.stationId} {item.stationName ? `- ${item.stationName}` : ""}</div>
                    </TableCell>
                    <TableCell className="text-right">{formatNumber(item.total)}</TableCell>
                    <TableCell className="text-right">{formatNumber(item.openGate)}</TableCell>
                    <TableCell className="text-right">{formatNumber(item.deny)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="rounded-md shadow-none">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Thiết bị theo trạng thái</CardTitle>
            <Button variant="ghost" size="sm" asChild><Link href={ROUTES.manager.deviceMonitoring}>Xem giám sát</Link></Button>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {[
              ["Active", summary?.deviceSummary.active, "border-emerald-200 bg-emerald-50 text-emerald-700"],
              ["Maintenance", summary?.deviceSummary.maintenance, "border-amber-200 bg-amber-50 text-amber-700"],
              ["Disabled", summary?.deviceSummary.disabled, "border-slate-200 bg-slate-50 text-slate-700"],
              ["Offline", summary?.deviceSummary.offline, "border-rose-200 bg-rose-50 text-rose-700"],
            ].map(([label, value, className]) => (
              <div key={label} className="rounded-md border p-4">
                <Badge variant="outline" className={className as string}>{label}</Badge>
                <div className="mt-3 text-2xl font-semibold">{formatNumber(value as number)}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card className="rounded-md shadow-none">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Sự cố thiết bị gần đây</CardTitle>
            <Button variant="ghost" size="sm" asChild><Link href={ROUTES.manager.deviceIncidents}>Xem sự cố</Link></Button>
          </CardHeader>
          <CardContent>
            <Table className={TABLE_CLASS_NAME}>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Station</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Severity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentIncidents.length === 0 && <EmptyRow colSpan={4} label="Không có sự cố gần đây." />}
                {recentIncidents.map((incident) => (
                  <TableRow key={incident.incidentId}>
                    <TableCell>{formatDateTime(incident.occurredAt)}</TableCell>
                    <TableCell>{incident.stationCode ?? incident.stationId ?? "--"}</TableCell>
                    <TableCell>{incident.deviceCode ?? incident.deviceId ?? "--"}</TableCell>
                    <TableCell><Badge variant="outline" className={getSeverityClassName(incident.severity)}>{incident.severity}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="rounded-md shadow-none">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Cấu hình vận hành</CardTitle>
            <Button variant="ghost" size="sm" asChild><Link href={ROUTES.manager.controlSyncs}>Xem trạng thái áp dụng</Link></Button>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            {[
              ["Pending", summary?.controlSyncSummary.pending, "border-amber-200 bg-amber-50 text-amber-700"],
              ["Applied", summary?.controlSyncSummary.applied, "border-emerald-200 bg-emerald-50 text-emerald-700"],
              ["Failed", summary?.controlSyncSummary.failed, "border-rose-200 bg-rose-50 text-rose-700"],
            ].map(([label, value, className]) => (
              <div key={label} className="rounded-md border p-4">
                <Badge variant="outline" className={className as string}>{label}</Badge>
                <div className="mt-3 text-2xl font-semibold">{formatNumber(value as number)}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card className="rounded-md shadow-none">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Batch dữ liệu</CardTitle>
            <Button variant="ghost" size="sm" asChild><Link href={ROUTES.manager.dataBatches}>Xem batch</Link></Button>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            {[
              ["Created", summary?.batchSummary.created, "border-slate-200 bg-slate-50 text-slate-700"],
              ["Submitted", summary?.batchSummary.submitted, "border-sky-200 bg-sky-50 text-sky-700"],
              ["Accepted", summary?.batchSummary.accepted, "border-emerald-200 bg-emerald-50 text-emerald-700"],
              ["Rejected", summary?.batchSummary.rejected, "border-orange-200 bg-orange-50 text-orange-700"],
              ["Failed", summary?.batchSummary.failed, "border-rose-200 bg-rose-50 text-rose-700"],
              ["Total", summary?.batchSummary.total, "border-violet-200 bg-violet-50 text-violet-700"],
            ].map(([label, value, className]) => (
              <div key={label} className="rounded-md border p-4">
                <Badge variant="outline" className={className as string}>{label}</Badge>
                <div className="mt-3 text-2xl font-semibold">{formatNumber(value as number)}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-md shadow-none">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Cảnh báo cần chú ý</CardTitle>
            <Settings2 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.length === 0 && <div className="rounded-md border p-4 text-sm text-muted-foreground">Không có cảnh báo cần xử lý.</div>}
            {alerts.map((alert, index) => (
              <div key={`${alert.type}-${alert.resourceId ?? index}`} className="rounded-md border p-3">
                <div className="flex items-center justify-between gap-3">
                  <Badge variant="outline" className={getSeverityClassName(alert.severity)}>{alert.severity}</Badge>
                  <span className="text-xs text-muted-foreground">{alert.type}</span>
                </div>
                <p className="mt-2 text-sm font-medium">{alert.message}</p>
                {(alert.resourceType || alert.resourceId) && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {alert.resourceType ?? "resource"}: {alert.resourceId ?? "--"}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {loading && (
        <div className="fixed bottom-4 right-4 flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm shadow-sm">
          <Activity className="h-4 w-4 animate-pulse text-primary" />
          Đang tải dashboard...
        </div>
      )}
    </div>
  )
}
