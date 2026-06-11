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
import { deviceApi, stationApi } from "@/lib/api"
import type {
  DeviceCreateRequest,
  DeviceDetail,
  DeviceDirection,
  DeviceEditableStatus,
  DeviceStatus,
  DeviceType,
  DeviceUpdateRequest,
  Station,
} from "@/lib/api"
import { getApiErrorMessage } from "@/lib/messages"

const DEVICE_TYPE_LABELS: Record<DeviceType, string> = {
  QR_SCANNER_SIMULATOR: "QR scanner simulator",
}

const DIRECTION_LABELS: Record<DeviceDirection, string> = {
  ENTRY: "Vào",
  EXIT: "Ra",
  BOTH: "Hai chiều",
}

const STATUS_LABELS: Record<DeviceStatus, string> = {
  ACTIVE: "Đang hoạt động",
  OFFLINE: "Offline",
  MAINTENANCE: "Bảo trì",
  DISABLED: "Đã vô hiệu hóa",
}

function getParamId(value: string | string[] | undefined) {
  const rawValue = Array.isArray(value) ? value[0] : value
  const id = Number(rawValue)

  return Number.isInteger(id) && id > 0 ? id : null
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

function getStationLabel(station: Station) {
  return `${station.stationCode} - ${station.stationName}`
}

function normalizeCreateDeviceForm(stationId: string, deviceType: DeviceType, direction: DeviceDirection, firmwareVersion: string): DeviceCreateRequest {
  return {
    stationId: Number(stationId),
    deviceType,
    direction,
    firmwareVersion: firmwareVersion.trim() || undefined,
  }
}

function normalizeUpdateDeviceForm(
  stationId: string,
  deviceType: DeviceType,
  direction: DeviceDirection,
  status: DeviceEditableStatus,
  firmwareVersion: string,
): DeviceUpdateRequest {
  return {
    ...normalizeCreateDeviceForm(stationId, deviceType, direction, firmwareVersion),
    status,
  }
}

export default function DeviceDetailPage() {
  const router = useRouter()
  const params = useParams<{ deviceId: string }>()
  const deviceId = getParamId(params.deviceId)

  const [deviceDetail, setDeviceDetail] = useState<DeviceDetail | null>(null)
  const [stationOptions, setStationOptions] = useState<Station[]>([])
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState("")

  const [formOpen, setFormOpen] = useState(false)
  const [formStationId, setFormStationId] = useState("")
  const [formDeviceType, setFormDeviceType] = useState<DeviceType>("QR_SCANNER_SIMULATOR")
  const [formDirection, setFormDirection] = useState<DeviceDirection>("ENTRY")
  const [formStatus, setFormStatus] = useState<DeviceEditableStatus>("ACTIVE")
  const [firmwareVersion, setFirmwareVersion] = useState("")
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState("")

  const loadDeviceDetail = async () => {
    if (!deviceId) {
      setPageError("Mã thiết bị không hợp lệ.")
      setLoading(false)
      return
    }

    setLoading(true)
    setPageError("")

    try {
      const response = await deviceApi.getDevice(deviceId)
      setDeviceDetail(response.result)
    } catch (error) {
      setPageError(getApiErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  const loadStationOptions = async () => {
    try {
      const response = await stationApi.listStations({ page: 0, size: 100 })
      setStationOptions(response.result.items)
    } catch (error) {
      setPageError(getApiErrorMessage(error))
    }
  }

  useEffect(() => {
    void loadDeviceDetail()
    void loadStationOptions()
  }, [deviceId])

  const openEditDevice = () => {
    if (!deviceDetail) return

    setFormStationId(String(deviceDetail.stationId))
    setFormDeviceType(deviceDetail.deviceType)
    setFormDirection(deviceDetail.direction)
    setFormStatus(deviceDetail.status === "OFFLINE" ? "ACTIVE" : deviceDetail.status)
    setFirmwareVersion(deviceDetail.firmwareVersion ?? "")
    setFormError("")
    setFormOpen(true)
  }

  const validateDevicePayload = (payload: DeviceCreateRequest) => {
    if (!Number.isInteger(payload.stationId) || payload.stationId < 1) return "Vui lòng chọn ga/trạm."
    if (!payload.deviceType) return "Vui lòng chọn loại thiết bị."
    if (!payload.direction) return "Vui lòng chọn hướng hoạt động."
    return ""
  }

  const handleSubmitDevice = async (event: FormEvent) => {
    event.preventDefault()
    if (!deviceDetail) return

    const createPayload = normalizeCreateDeviceForm(formStationId, formDeviceType, formDirection, firmwareVersion)
    const validationError = validateDevicePayload(createPayload)
    if (validationError) {
      setFormError(validationError)
      return
    }

    setFormLoading(true)
    setFormError("")

    try {
      await deviceApi.updateDevice(deviceDetail.id, normalizeUpdateDeviceForm(formStationId, formDeviceType, formDirection, formStatus, firmwareVersion))
      setFormOpen(false)
      await loadDeviceDetail()
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
          <Button variant="ghost" className="mb-2 px-0" onClick={() => router.push("/manager/devices")}>
            <ArrowLeft className="h-4 w-4" />
            Đóng
          </Button>
          <h1 className="text-2xl font-semibold text-foreground">Chi tiết thiết bị {deviceDetail?.deviceCode ?? ""}</h1>
          <p className="text-sm text-muted-foreground">Thông tin khai báo, ga/trạm hiện tại và vận hành gần đây.</p>
        </div>
      </div>

      {pageError && <Alert variant="destructive"><AlertDescription>{pageError}</AlertDescription></Alert>}
      {loading && <div className="rounded-md border p-4 text-sm text-muted-foreground">Đang tải chi tiết thiết bị...</div>}

      {deviceDetail && !loading && (
        <>
          <div className="rounded-md border bg-card p-4">
            <div className="mb-3 text-sm font-medium">Thông tin thiết bị</div>
            <div className="grid gap-3 text-sm md:grid-cols-2">
              <div><span className="text-muted-foreground">Device code</span><div className="font-medium">{deviceDetail.deviceCode}</div></div>
              <div><span className="text-muted-foreground">Device type</span><div className="font-medium">{DEVICE_TYPE_LABELS[deviceDetail.deviceType]}</div></div>
              <div><span className="text-muted-foreground">Direction</span><div className="font-medium">{DIRECTION_LABELS[deviceDetail.direction]}</div></div>
              <div><span className="text-muted-foreground">Status</span><div className="pt-1"><StatusBadge status={deviceDetail.status} /></div></div>
              <div><span className="text-muted-foreground">Created at</span><div className="font-medium">{formatDateTime(deviceDetail.createdAt)}</div></div>
              <div><span className="text-muted-foreground">Updated at</span><div className="font-medium">{formatDateTime(deviceDetail.updatedAt)}</div></div>
            </div>
          </div>

          <div className="rounded-md border bg-card p-4">
            <div className="mb-3 text-sm font-medium">Ga/trạm hiện tại</div>
            <div className="grid gap-3 text-sm md:grid-cols-2">
              <div><span className="text-muted-foreground">Station code</span><div className="font-medium">{deviceDetail.stationCode}</div></div>
              <div><span className="text-muted-foreground">Station name</span><div className="font-medium">{deviceDetail.stationName}</div></div>
              <div><span className="text-muted-foreground">Route</span><div className="font-medium">{deviceDetail.routeCode} - {deviceDetail.routeName}</div></div>
            </div>
          </div>

          <div className="rounded-md border bg-card p-4">
            <div className="mb-3 text-sm font-medium">Vận hành gần đây</div>
            <div className="grid gap-3 text-sm md:grid-cols-2">
              <div><span className="text-muted-foreground">Last seen</span><div className="font-medium">{formatDateTime(deviceDetail.lastSeenAt)}</div></div>
              <div><span className="text-muted-foreground">Firmware version</span><div className="font-medium">{deviceDetail.firmwareVersion ?? "--"}</div></div>
              <div className="md:col-span-2">
                <span className="text-muted-foreground">Incident gần nhất</span>
                {deviceDetail.latestIncident ? (
                  <div className="mt-1 grid gap-2 rounded-md border p-3 md:grid-cols-2">
                    <div>ID: {deviceDetail.latestIncident.incidentId}</div>
                    <div>Severity: {deviceDetail.latestIncident.severity}</div>
                    <div>Type: {deviceDetail.latestIncident.incidentType}</div>
                    <div>Time: {formatDateTime(deviceDetail.latestIncident.occurredAt)}</div>
                    <div className="md:col-span-2">Message: {deviceDetail.latestIncident.message}</div>
                  </div>
                ) : (
                  <div className="mt-1 font-medium">--</div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => router.push("/manager/devices")}>Đóng</Button>
            <Button onClick={openEditDevice}>
              <Pencil className="h-4 w-4" />
              Sửa
            </Button>
          </div>
        </>
      )}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập nhật thiết bị</DialogTitle>
            <DialogDescription>Không cập nhật device code hoặc device secret từ màn hình này.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitDevice} className="space-y-4">
            {formError && <Alert variant="destructive"><AlertDescription>{formError}</AlertDescription></Alert>}
            <div className="space-y-2">
              <Label>Ga/trạm</Label>
              <Select value={formStationId} onValueChange={setFormStationId}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn ga/trạm" />
                </SelectTrigger>
                <SelectContent>
                  {stationOptions.map((station) => (
                    <SelectItem key={station.id} value={String(station.id)}>{getStationLabel(station)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Loại thiết bị</Label>
                <Select value={formDeviceType} onValueChange={(value) => setFormDeviceType(value as DeviceType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="QR_SCANNER_SIMULATOR">QR scanner simulator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Hướng hoạt động</Label>
                <Select value={formDirection} onValueChange={(value) => setFormDirection(value as DeviceDirection)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ENTRY">Vào</SelectItem>
                    <SelectItem value="EXIT">Ra</SelectItem>
                    <SelectItem value="BOTH">Hai chiều</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Trạng thái quản trị</Label>
              <Select value={formStatus} onValueChange={(value) => setFormStatus(value as DeviceEditableStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Đang hoạt động</SelectItem>
                  <SelectItem value="MAINTENANCE">Bảo trì</SelectItem>
                  <SelectItem value="DISABLED">Đã vô hiệu hóa</SelectItem>
                </SelectContent>
              </Select>
              {deviceDetail?.status === "OFFLINE" && (
                <p className="text-xs text-muted-foreground">OFFLINE là trạng thái runtime nên không gửi từ form cập nhật.</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="firmwareVersion">Firmware version</Label>
              <Input id="firmwareVersion" value={firmwareVersion} onChange={(event) => setFirmwareVersion(event.target.value)} placeholder="1.0.0" />
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
