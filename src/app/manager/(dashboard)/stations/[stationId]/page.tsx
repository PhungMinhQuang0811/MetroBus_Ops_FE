"use client"

import { FormEvent, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Pencil } from "lucide-react"

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
import { Label } from "@/components/ui/label"
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
import { routeApi, stationApi } from "@/lib/api"
import type { MasterDataStatus, StationDetail, StationMutationRequest, TransitRoute } from "@/lib/api"
import { getApiErrorMessage } from "@/lib/messages"

const TABLE_CLASS_NAME = "border-collapse [&_td]:border [&_th]:border [&_thead_tr]:bg-muted/40"

const STATUS_LABELS: Record<MasterDataStatus, string> = {
  ACTIVE: "Đang hoạt động",
  DISABLED: "Đã vô hiệu hóa",
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

function StatusBadge({ status }: { status: MasterDataStatus }) {
  return (
    <Badge variant="outline" className={status === "ACTIVE" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-50 text-slate-600"}>
      {STATUS_LABELS[status]}
    </Badge>
  )
}

function DeviceStatusBadge({ status }: { status: string }) {
  const normalizedStatus = status.toUpperCase()
  const statusClassName =
    normalizedStatus === "ACTIVE"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : normalizedStatus === "MAINTENANCE"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-slate-200 bg-slate-50 text-slate-600"

  return <Badge variant="outline" className={statusClassName}>{status}</Badge>
}

function getParamId(value: string | string[] | undefined) {
  const rawValue = Array.isArray(value) ? value[0] : value
  const id = Number(rawValue)

  return Number.isInteger(id) && id > 0 ? id : null
}

function getRouteLabel(route: TransitRoute) {
  return `${route.routeCode} - ${route.routeName}`
}

function normalizeStationForm(routeId: string, stationName: string, stationOrder: string, distance: string): StationMutationRequest {
  return {
    routeId: Number(routeId),
    stationName: stationName.trim(),
    stationOrder: Number(stationOrder),
    distance: distance.trim() ? Number(distance) : 0,
  }
}

export default function StationDetailPage() {
  const router = useRouter()
  const params = useParams<{ stationId: string }>()
  const stationId = getParamId(params.stationId)

  const [stationDetail, setStationDetail] = useState<StationDetail | null>(null)
  const [routeOptions, setRouteOptions] = useState<TransitRoute[]>([])
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState("")

  const [formOpen, setFormOpen] = useState(false)
  const [formRouteId, setFormRouteId] = useState("")
  const [stationName, setStationName] = useState("")
  const [stationOrder, setStationOrder] = useState("")
  const [distance, setDistance] = useState("0.00")
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState("")

  const loadStationDetail = async () => {
    if (!stationId) {
      setPageError("Mã ga/trạm không hợp lệ.")
      setLoading(false)
      return
    }

    setLoading(true)
    setPageError("")

    try {
      const response = await stationApi.getStation(stationId)
      setStationDetail(response.result)
    } catch (error) {
      setPageError(getApiErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  const loadRouteOptions = async () => {
    try {
      const response = await routeApi.listRoutes({ page: 0, size: 100 })
      setRouteOptions(response.result.items)
    } catch (error) {
      setPageError(getApiErrorMessage(error))
    }
  }

  useEffect(() => {
    void loadStationDetail()
    void loadRouteOptions()
  }, [stationId])

  const openEditStation = () => {
    if (!stationDetail) return

    setFormRouteId(String(stationDetail.routeId))
    setStationName(stationDetail.stationName)
    setStationOrder(String(stationDetail.stationOrder))
    setDistance(String(stationDetail.distance ?? 0))
    setFormError("")
    setFormOpen(true)
  }

  const handleSubmitStation = async (event: FormEvent) => {
    event.preventDefault()
    if (!stationDetail) return

    const payload = normalizeStationForm(formRouteId, stationName, stationOrder, distance)
    if (!Number.isInteger(payload.routeId) || payload.routeId < 1) {
      setFormError("Vui lòng chọn tuyến.")
      return
    }

    if (!payload.stationName) {
      setFormError("Vui lòng nhập tên ga/trạm.")
      return
    }

    if (!Number.isInteger(payload.stationOrder) || payload.stationOrder < 1) {
      setFormError("Thứ tự ga/trạm phải là số nguyên lớn hơn hoặc bằng 1.")
      return
    }

    setFormLoading(true)
    setFormError("")

    try {
      await stationApi.updateStation(stationDetail.id, payload)
      setFormOpen(false)
      await loadStationDetail()
    } catch (error) {
      setFormError(getApiErrorMessage(error))
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <Button variant="ghost" className="mb-2 px-0" onClick={() => router.push("/manager/stations")}>
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
          <h1 className="text-2xl font-semibold text-foreground">Chi tiết ga/trạm {stationDetail?.stationCode ?? ""}</h1>
          <p className="text-sm text-muted-foreground">Thông tin ga/trạm và thiết bị liên quan.</p>
        </div>
        {stationDetail && (
          <Button onClick={openEditStation}>
            <Pencil className="h-4 w-4" />
            Sửa
          </Button>
        )}
      </div>

      {pageError && <Alert variant="destructive"><AlertDescription>{pageError}</AlertDescription></Alert>}
      {loading && <div className="rounded-md border p-4 text-sm text-muted-foreground">Đang tải chi tiết ga/trạm...</div>}

      {stationDetail && !loading && (
        <>
          <div className="grid gap-3 rounded-md border bg-card p-4 text-sm md:grid-cols-2">
            <div><span className="text-muted-foreground">Tuyến</span><div className="font-medium">{stationDetail.routeCode} - {stationDetail.routeName}</div></div>
            <div><span className="text-muted-foreground">Mã ga/trạm</span><div className="font-medium">{stationDetail.stationCode}</div></div>
            <div><span className="text-muted-foreground">Tên ga/trạm</span><div className="font-medium">{stationDetail.stationName}</div></div>
            <div><span className="text-muted-foreground">Thứ tự</span><div className="font-medium">{stationDetail.stationOrder}</div></div>
            <div><span className="text-muted-foreground">Cự ly (km)</span><div className="font-medium">{stationDetail.distance ?? "0.00"}</div></div>
            <div><span className="text-muted-foreground">Trạng thái</span><div className="pt-1"><StatusBadge status={stationDetail.status} /></div></div>
            <div><span className="text-muted-foreground">Ngày tạo</span><div className="font-medium">{formatDateTime(stationDetail.createdAt)}</div></div>
            <div><span className="text-muted-foreground">Cập nhật</span><div className="font-medium">{formatDateTime(stationDetail.updatedAt)}</div></div>
          </div>

          <div className="rounded-md border bg-card p-4 text-sm">
            <div className="font-medium">Thiết bị tại ga/trạm</div>
            <div className="mt-2 grid gap-2 text-muted-foreground sm:grid-cols-5">
              <span>Tổng: {stationDetail.deviceSummary.total}</span>
              <span>Active: {stationDetail.deviceSummary.active}</span>
              <span>Offline: {stationDetail.deviceSummary.offline}</span>
              <span>Maintenance: {stationDetail.deviceSummary.maintenance}</span>
              <span>Disabled: {stationDetail.deviceSummary.disabled}</span>
            </div>
          </div>

          <div className="rounded-md border">
            <Table className={TABLE_CLASS_NAME}>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã thiết bị</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Hướng</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Firmware</TableHead>
                  <TableHead>Last seen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stationDetail.devices.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-20 text-center text-muted-foreground">Chưa có thiết bị tại ga/trạm.</TableCell>
                  </TableRow>
                )}
                {stationDetail.devices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell className="font-medium">{device.deviceCode}</TableCell>
                    <TableCell>{device.deviceType}</TableCell>
                    <TableCell>{device.direction}</TableCell>
                    <TableCell><DeviceStatusBadge status={device.status} /></TableCell>
                    <TableCell>{device.firmwareVersion ?? "--"}</TableCell>
                    <TableCell>{formatDateTime(device.lastSeenAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập nhật ga/trạm</DialogTitle>
            <DialogDescription>Chỉ cập nhật tuyến, tên ga/trạm, thứ tự và cự ly.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitStation} className="space-y-4">
            {formError && <Alert variant="destructive"><AlertDescription>{formError}</AlertDescription></Alert>}
            <div className="space-y-2">
              <Label>Tuyến</Label>
              <Select value={formRouteId} onValueChange={setFormRouteId}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn tuyến" />
                </SelectTrigger>
                <SelectContent>
                  {routeOptions.map((route) => (
                    <SelectItem key={route.id} value={String(route.id)}>{getRouteLabel(route)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="stationName">Tên ga/trạm</Label>
              <Input id="stationName" value={stationName} onChange={(event) => setStationName(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stationOrder">Thứ tự trong tuyến</Label>
              <Input id="stationOrder" type="number" min={1} step={1} value={stationOrder} onChange={(event) => setStationOrder(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="distance">Cự ly (km)</Label>
              <Input id="distance" type="number" min={0} step={0.01} value={distance} onChange={(event) => setDistance(event.target.value)} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" disabled={formLoading} onClick={() => setFormOpen(false)}>Hủy</Button>
              <Button type="submit" disabled={formLoading}>{formLoading ? "Đang lưu..." : "Lưu"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}