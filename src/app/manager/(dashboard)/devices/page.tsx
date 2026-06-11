"use client"

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, Copy, Download, Eye, FileUp, MoreHorizontal, Pencil, Plus, Search, Upload } from "lucide-react"

import { ConfirmationModal } from "@/components/confirmation-modal"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { ApiError, deviceApi, stationApi } from "@/lib/api"
import type {
  ConfirmImportDeviceItem,
  Device,
  DeviceCreateRequest,
  DeviceDirection,
  DeviceEditableStatus,
  DeviceImportError,
  DeviceImportPreviewItem,
  DeviceStatus,
  DeviceType,
  DeviceUpdateRequest,
  PreviewImportDevicesResponse,
  Station,
} from "@/lib/api"
import { getApiErrorMessage, getApiErrorMessageFromBackendMessage } from "@/lib/messages"

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const
const TABLE_CLASS_NAME = "border-collapse [&_td]:border [&_th]:border [&_thead_tr]:bg-muted/40"

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

function isImportErrorResponse(error: unknown): error is ApiError<PreviewImportDevicesResponse> {
  return error instanceof ApiError && Boolean((error.response.result as PreviewImportDevicesResponse | null)?.errors?.length)
}

export default function DevicesPage() {
  const router = useRouter()
  const [devices, setDevices] = useState<Device[]>([])
  const [stationOptions, setStationOptions] = useState<Station[]>([])
  const [keyword, setKeyword] = useState("")
  const [stationId, setStationId] = useState("all")
  const [deviceType, setDeviceType] = useState("all")
  const [status, setStatus] = useState("all")
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [tableError, setTableError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const [formOpen, setFormOpen] = useState(false)
  const [editingDevice, setEditingDevice] = useState<Device | null>(null)
  const [formStationId, setFormStationId] = useState("")
  const [formDeviceType, setFormDeviceType] = useState<DeviceType>("QR_SCANNER_SIMULATOR")
  const [formDirection, setFormDirection] = useState<DeviceDirection>("ENTRY")
  const [formStatus, setFormStatus] = useState<DeviceEditableStatus>("ACTIVE")
  const [firmwareVersion, setFirmwareVersion] = useState("")
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState("")

  const [secretDevice, setSecretDevice] = useState<ConfirmImportDeviceItem | null>(null)
  const [statusDevice, setStatusDevice] = useState<Device | null>(null)
  const [statusLoading, setStatusLoading] = useState(false)

  const [importOpen, setImportOpen] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importPreviewItems, setImportPreviewItems] = useState<DeviceImportPreviewItem[]>([])
  const [importPreviewSummary, setImportPreviewSummary] = useState<{ totalRows: number; validRows: number; invalidRows: number } | null>(null)
  const [importErrors, setImportErrors] = useState<DeviceImportError[]>([])
  const [importedDevices, setImportedDevices] = useState<ConfirmImportDeviceItem[]>([])
  const [importError, setImportError] = useState("")
  const [importLoading, setImportLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const fromRow = totalElements === 0 ? 0 : page * pageSize + 1
  const toRow = Math.min((page + 1) * pageSize, totalElements)

  const loadStationOptions = async () => {
    try {
      const response = await stationApi.listStations({ page: 0, size: 100 })
      setStationOptions(response.result.items)
    } catch (error) {
      setTableError(getApiErrorMessage(error))
    }
  }

  const loadDevices = async (
    targetPage = page,
    filters?: { keyword: string; stationId: string; deviceType: string; status: string },
    targetPageSize = pageSize,
  ) => {
    setLoading(true)
    setTableError("")

    const currentKeyword = filters?.keyword ?? keyword
    const currentStationId = filters?.stationId ?? stationId
    const currentDeviceType = filters?.deviceType ?? deviceType
    const currentStatus = filters?.status ?? status

    try {
      const response = await deviceApi.listDevices({
        keyword: currentKeyword.trim() || undefined,
        stationId: currentStationId === "all" ? undefined : Number(currentStationId),
        deviceType: currentDeviceType === "all" ? undefined : currentDeviceType as DeviceType,
        status: currentStatus === "all" ? undefined : currentStatus as DeviceStatus,
        page: targetPage,
        size: targetPageSize,
      })

      setDevices(response.result.items)
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
    void loadStationOptions()
    void loadDevices(0)
  }, [])

  const resetDeviceForm = () => {
    setEditingDevice(null)
    setFormStationId("")
    setFormDeviceType("QR_SCANNER_SIMULATOR")
    setFormDirection("ENTRY")
    setFormStatus("ACTIVE")
    setFirmwareVersion("")
    setFormError("")
  }

  const openCreateDevice = () => {
    resetDeviceForm()
    setFormStationId(stationId === "all" ? String(stationOptions[0]?.id ?? "") : stationId)
    setFormOpen(true)
  }

  const openEditDevice = (device: Device) => {
    setEditingDevice(device)
    setFormStationId(String(device.stationId))
    setFormDeviceType(device.deviceType)
    setFormDirection(device.direction)
    setFormStatus(device.status === "OFFLINE" ? "ACTIVE" : device.status)
    setFirmwareVersion(device.firmwareVersion ?? "")
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

    const createPayload = normalizeCreateDeviceForm(formStationId, formDeviceType, formDirection, firmwareVersion)
    const validationError = validateDevicePayload(createPayload)
    if (validationError) {
      setFormError(validationError)
      return
    }

    setFormLoading(true)
    setFormError("")

    try {
      if (editingDevice) {
        await deviceApi.updateDevice(editingDevice.id, normalizeUpdateDeviceForm(formStationId, formDeviceType, formDirection, formStatus, firmwareVersion))
        setSuccessMessage("Thiết bị đã được cập nhật.")
      } else {
        const response = await deviceApi.createDevice(createPayload)
        setSuccessMessage("Thiết bị đã được tạo.")
        if (response.result.deviceSecret) setSecretDevice({ ...response.result, row: 0 })
      }

      setFormOpen(false)
      resetDeviceForm()
      await loadDevices(editingDevice ? page : 0)
    } catch (error) {
      setFormError(getApiErrorMessage(error))
    } finally {
      setFormLoading(false)
    }
  }

  const handleApplyFilters = () => {
    setSuccessMessage("")
    void loadDevices(0)
  }

  const handleResetFilters = () => {
    const resetFilters = { keyword: "", stationId: "all", deviceType: "all", status: "all" }
    setKeyword("")
    setStationId("all")
    setDeviceType("all")
    setStatus("all")
    setSuccessMessage("")
    void loadDevices(0, resetFilters)
  }

  const handlePageSizeChange = (value: string) => {
    const nextPageSize = Number(value)
    setPageSize(nextPageSize)
    setSuccessMessage("")
    void loadDevices(0, undefined, nextPageSize)
  }

  const handleToggleStatus = async () => {
    if (!statusDevice) return

    setStatusLoading(true)
    setTableError("")

    try {
      if (statusDevice.status === "DISABLED") {
        await deviceApi.enableDevice(statusDevice.id)
        setSuccessMessage("Thiết bị đã được kích hoạt.")
      } else {
        await deviceApi.disableDevice(statusDevice.id)
        setSuccessMessage("Thiết bị đã được vô hiệu hóa.")
      }

      setStatusDevice(null)
      await loadDevices(page)
    } catch (error) {
      setTableError(getApiErrorMessage(error))
    } finally {
      setStatusLoading(false)
    }
  }

  const resetImportState = () => {
    setImportFile(null)
    setImportPreviewItems([])
    setImportPreviewSummary(null)
    setImportErrors([])
    setImportedDevices([])
    setImportError("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleImportFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    setImportFile(file)
    setImportPreviewItems([])
    setImportPreviewSummary(null)
    setImportErrors([])
    setImportedDevices([])
    setImportError("")
  }

  const handleOpenImportFilePicker = () => {
    fileInputRef.current?.click()
  }

  const handleDownloadTemplate = () => {
    const link = document.createElement("a")
    link.href = "/templates/device-import-template.xlsx"
    link.download = "device-import-template.xlsx"
    link.click()
  }

  const handleChooseAnotherImportFile = () => {
    resetImportState()
    fileInputRef.current?.click()
  }

  const handlePreviewImport = async () => {
    if (!importFile) {
      setImportError("Vui lòng chọn file .xlsx để preview.")
      return
    }

    setImportLoading(true)
    setImportError("")
    setImportErrors([])
    setImportedDevices([])
    setImportPreviewSummary(null)

    try {
      const response = await deviceApi.previewImportDevices(importFile)
      setImportPreviewSummary({
        totalRows: response.result.totalRows,
        validRows: response.result.validRows,
        invalidRows: response.result.invalidRows,
      })
      setImportPreviewItems(response.result.items)
      setImportErrors(response.result.errors)
    } catch (error) {
      setImportError(getApiErrorMessage(error))
    } finally {
      setImportLoading(false)
    }
  }

  const handleConfirmImport = async () => {
    if (!importFile) {
      setImportError("Vui lòng chọn file .xlsx để import.")
      return
    }

    setImportLoading(true)
    setImportError("")
    setImportErrors([])
    setImportedDevices([])

    try {
      const response = await deviceApi.confirmImportDevices(importFile)
      setImportedDevices(response.result.items)
      setSuccessMessage(`Import thiết bị hoàn tất. Đã tạo ${response.result.imported} thiết bị.`)
      await loadDevices(0)
    } catch (error) {
      if (isImportErrorResponse(error)) {
        setImportErrors(error.response.result.errors)
        setImportError("File có lỗi nên chưa có thiết bị nào được tạo.")
      } else {
        setImportError(getApiErrorMessage(error))
      }
    } finally {
      setImportLoading(false)
    }
  }

  const copySecret = async (device: ConfirmImportDeviceItem) => {
    const text = `deviceCode: ${device.deviceCode}\ndeviceSecret: ${device.deviceSecret ?? ""}`
    await navigator.clipboard?.writeText(text)
  }

  const hasInvalidImportRows = importErrors.length > 0
  const hasPreview = importPreviewItems.length > 0
  const canConfirmImport = Boolean(importFile && hasPreview && !hasInvalidImportRows && importedDevices.length === 0)

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Quản lý thiết bị</h1>
          <p className="text-sm text-muted-foreground">Khai báo thiết bị AFC Cấp 2 theo ga/trạm trong operator hiện tại.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setImportOpen(true)}>
            <FileUp className="h-4 w-4" />
            Import
          </Button>
          <Button onClick={openCreateDevice}>
            <Plus className="h-4 w-4" />
            Tạo thiết bị
          </Button>
        </div>
      </div>

      {successMessage && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-3 rounded-md border bg-card p-3 md:grid-cols-[minmax(220px,1fr)_220px_220px_180px_auto_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Tìm mã thiết bị, ga/trạm" className="pl-9" />
        </div>
        <Select value={stationId} onValueChange={setStationId}>
          <SelectTrigger>
            <SelectValue placeholder="Ga/trạm" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả ga/trạm</SelectItem>
            {stationOptions.map((station) => (
              <SelectItem key={station.id} value={String(station.id)}>{station.stationCode}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={deviceType} onValueChange={setDeviceType}>
          <SelectTrigger>
            <SelectValue placeholder="Loại thiết bị" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả loại</SelectItem>
            <SelectItem value="QR_SCANNER_SIMULATOR">QR scanner simulator</SelectItem>
          </SelectContent>
        </Select>
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

      <div className="rounded-md border">
        <Table className={TABLE_CLASS_NAME}>
          <TableHeader>
            <TableRow>
              <TableHead>Mã thiết bị</TableHead>
              <TableHead>Ga/trạm</TableHead>
              <TableHead>Mã tuyến</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Hướng</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Firmware</TableHead>
              <TableHead>Last seen</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">Đang tải thiết bị...</TableCell>
              </TableRow>
            )}
            {!loading && devices.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">Không có thiết bị phù hợp.</TableCell>
              </TableRow>
            )}
            {!loading && devices.map((device) => (
              <TableRow key={device.id}>
                <TableCell className="font-medium">{device.deviceCode}</TableCell>
                <TableCell>
                  <div>{device.stationCode}</div>
                  <div className="text-xs text-muted-foreground">{device.stationName}</div>
                </TableCell>
                <TableCell>{device.routeCode}</TableCell>
                <TableCell>{DEVICE_TYPE_LABELS[device.deviceType] ?? device.deviceType}</TableCell>
                <TableCell>{DIRECTION_LABELS[device.direction]}</TableCell>
                <TableCell><StatusBadge status={device.status} /></TableCell>
                <TableCell>{device.firmwareVersion ?? "--"}</TableCell>
                <TableCell>{formatDateTime(device.lastSeenAt)}</TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label={`Thao tác với thiết bị ${device.deviceCode}`}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/manager/devices/${device.id}`)}>
                          <Eye className="h-4 w-4" />
                          Xem
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditDevice(device)}>
                          <Pencil className="h-4 w-4" />
                          Sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className={device.status === "DISABLED" ? "" : "text-destructive focus:text-destructive"}
                          onClick={() => setStatusDevice(device)}
                        >
                          {device.status === "DISABLED" ? "Enable" : "Disable"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
            <Button variant="outline" size="sm" disabled={loading || page <= 0} onClick={() => void loadDevices(page - 1)}>Trước</Button>
            <span className="min-w-20 text-center">Trang {totalPages === 0 ? 0 : page + 1}/{totalPages}</span>
            <Button variant="outline" size="sm" disabled={loading || page + 1 >= totalPages} onClick={() => void loadDevices(page + 1)}>Sau</Button>
          </div>
        </div>
      </div>

      <Dialog open={formOpen} onOpenChange={(open) => {
        setFormOpen(open)
        if (!open) resetDeviceForm()
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingDevice ? "Cập nhật thiết bị" : "Tạo thiết bị"}</DialogTitle>
            <DialogDescription>
              Backend tự sinh device code và secret khi tạo mới. Secret chỉ trả một lần sau khi tạo/import.
            </DialogDescription>
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
            {editingDevice && (
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
                {editingDevice.status === "OFFLINE" && (
                  <p className="text-xs text-muted-foreground">OFFLINE là trạng thái runtime nên không gửi từ form cập nhật.</p>
                )}
              </div>
            )}
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

      <Dialog open={Boolean(secretDevice)} onOpenChange={(open) => !open && setSecretDevice(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thiết bị đã được tạo</DialogTitle>
            <DialogDescription>Device secret chỉ hiển thị một lần. Dùng thông tin này cho mock Cấp 2/thiết bị.</DialogDescription>
          </DialogHeader>
          {secretDevice && (
            <div className="space-y-3">
              <div className="rounded-md border bg-muted/30 p-3 font-mono text-sm">
                <div>deviceCode: {secretDevice.deviceCode}</div>
                <div>deviceSecret: {secretDevice.deviceSecret}</div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => void copySecret(secretDevice)}>
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
                <Button type="button" onClick={() => setSecretDevice(null)}>Đóng</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={importOpen} onOpenChange={(open) => {
        setImportOpen(open)
        if (!open) resetImportState()
      }}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Import thiết bị</DialogTitle>
            <DialogDescription>File chỉ cần stationCode, deviceType, direction và firmwareVersion. Backend tự sinh code/secret.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {importError && <Alert variant="destructive"><AlertDescription>{importError}</AlertDescription></Alert>}
            {importPreviewSummary && (
              <Alert>
                <AlertDescription>
                  Tổng dòng: {importPreviewSummary.totalRows} | Hợp lệ: {importPreviewSummary.validRows} | Lỗi: {importPreviewSummary.invalidRows}
                </AlertDescription>
              </Alert>
            )}
            <input ref={fileInputRef} type="file" accept=".xlsx" className="hidden" onChange={handleImportFileChange} />
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              {!hasPreview && importedDevices.length === 0 && (
                <Button type="button" variant="outline" onClick={handleOpenImportFilePicker}>
                  <Upload className="h-4 w-4" />
                  Chọn file
                </Button>
              )}
              <Button type="button" variant="outline" onClick={handleDownloadTemplate}>
                <Download className="h-4 w-4" />
                Tải template
              </Button>
              <span className="text-sm text-muted-foreground">{importFile?.name ?? "Chưa chọn file import."}</span>
            </div>

            {!hasPreview && importedDevices.length === 0 && (
              <div className="rounded-md border">
                <div className="border-b px-3 py-2 text-sm font-medium">Preview</div>
                <div className="p-3 text-sm text-muted-foreground">
                  {importFile ? `File đã chọn: ${importFile.name}` : "Chưa chọn file import."}
                </div>
              </div>
            )}

            {hasPreview && importedDevices.length === 0 && (
              <div className="rounded-md border">
                <Table className={TABLE_CLASS_NAME}>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Row</TableHead>
                      <TableHead>Mã ga/trạm</TableHead>
                      <TableHead>Tên ga/trạm</TableHead>
                      <TableHead>Loại</TableHead>
                      <TableHead>Hướng</TableHead>
                      <TableHead>Firmware</TableHead>
                      <TableHead>Kết quả</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {importPreviewItems.map((item) => (
                      <TableRow key={`${item.row}-${item.stationCode ?? "empty"}`}>
                        <TableCell>{item.row}</TableCell>
                        <TableCell>{item.stationCode ?? "--"}</TableCell>
                        <TableCell>{item.stationName ?? "--"}</TableCell>
                        <TableCell>{item.deviceType ?? "--"}</TableCell>
                        <TableCell>{item.direction ?? "--"}</TableCell>
                        <TableCell>{item.firmwareVersion ?? "--"}</TableCell>
                        <TableCell>{item.valid ? "Hợp lệ" : item.errors.map((error) => getApiErrorMessageFromBackendMessage(error.message)).join(", ")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {importErrors.length > 0 && (
              <div className="space-y-3">
                <Alert variant="destructive"><AlertDescription>File có dòng dữ liệu không hợp lệ.</AlertDescription></Alert>
                <Table className={TABLE_CLASS_NAME}>
                  <TableHeader>
                    <TableRow><TableHead>Row</TableHead><TableHead>Field</TableHead><TableHead>Lỗi</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {importErrors.map((error, index) => (
                      <TableRow key={`${error.row}-${error.field}-${index}`}>
                        <TableCell>{error.row}</TableCell>
                        <TableCell>{error.field}</TableCell>
                        <TableCell>{getApiErrorMessageFromBackendMessage(error.message)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {importedDevices.length > 0 && (
              <div className="space-y-3">
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>Import thành công. Secret chỉ hiển thị một lần.</AlertDescription>
                </Alert>
                <Table className={TABLE_CLASS_NAME}>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Row</TableHead>
                      <TableHead>Mã thiết bị</TableHead>
                      <TableHead>Ga/trạm</TableHead>
                      <TableHead>Hướng</TableHead>
                      <TableHead>Device secret</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {importedDevices.map((device) => (
                      <TableRow key={`${device.row}-${device.deviceCode}`}>
                        <TableCell>{device.row}</TableCell>
                        <TableCell>{device.deviceCode}</TableCell>
                        <TableCell>{device.stationCode}</TableCell>
                        <TableCell>{DIRECTION_LABELS[device.direction]}</TableCell>
                        <TableCell className="font-mono text-xs">{device.deviceSecret ?? "--"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            <DialogFooter>
              {hasPreview && importedDevices.length === 0 && (
                <Button type="button" variant="outline" disabled={importLoading} onClick={handleChooseAnotherImportFile}>Chọn file khác</Button>
              )}
              <Button type="button" variant="outline" disabled={importLoading} onClick={() => setImportOpen(false)}>Đóng</Button>
              {!hasPreview && importedDevices.length === 0 && (
                <Button type="button" disabled={importLoading} onClick={() => void handlePreviewImport()}>
                  {importLoading ? "Đang preview..." : "Preview"}
                </Button>
              )}
              {hasPreview && importedDevices.length === 0 && (
                hasInvalidImportRows
                  ? <Button type="button" disabled={importLoading || !importFile} onClick={() => void handlePreviewImport()}>{importLoading ? "Đang preview..." : "Preview lại"}</Button>
                  : <Button type="button" disabled={!canConfirmImport || importLoading} onClick={() => void handleConfirmImport()}>{importLoading ? "Đang import..." : "Xác nhận import"}</Button>
              )}
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmationModal
        open={Boolean(statusDevice)}
        onOpenChange={(open) => !open && setStatusDevice(null)}
        title={statusDevice?.status === "DISABLED" ? "Kích hoạt thiết bị?" : "Vô hiệu hóa thiết bị?"}
        description={statusDevice ? `Bạn đang thao tác với thiết bị ${statusDevice.deviceCode} tại ${statusDevice.stationCode}.` : ""}
        confirmText={statusDevice?.status === "DISABLED" ? "Enable" : "Disable"}
        variant={statusDevice?.status === "DISABLED" ? "default" : "destructive"}
        loading={statusLoading}
        onConfirm={() => void handleToggleStatus()}
      />
    </div>
  )
}
