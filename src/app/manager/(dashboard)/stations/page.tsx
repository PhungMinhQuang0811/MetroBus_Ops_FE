"use client"

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, Download, Eye, FileUp, MoreHorizontal, Pencil, Plus, Search, Upload } from "lucide-react"

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
import { ApiError, routeApi, stationApi } from "@/lib/api"
import type {
  MasterDataStatus,
  PreviewImportStationsResponse,
  Station,
  StationImportError,
  StationImportPreviewItem,
  StationMutationRequest,
  TransitRoute,
} from "@/lib/api"
import { getApiErrorMessage, getApiErrorMessageFromBackendMessage } from "@/lib/messages"

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const
const TABLE_CLASS_NAME = "border-collapse [&_td]:border [&_th]:border [&_thead_tr]:bg-muted/40"

const STATUS_LABELS: Record<MasterDataStatus, string> = {
  ACTIVE: "Đang hoạt động",
  DISABLED: "Đã vô hiệu hóa",
}

function formatDateTime(value?: string) {
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

function normalizeStationForm(routeId: string, stationName: string, stationOrder: string): StationMutationRequest {
  return {
    routeId: Number(routeId),
    stationName: stationName.trim(),
    stationOrder: Number(stationOrder),
  }
}

function isImportErrorResponse(error: unknown): error is ApiError<PreviewImportStationsResponse> {
  return error instanceof ApiError && Boolean((error.response.result as PreviewImportStationsResponse | null)?.errors?.length)
}

function getRouteLabel(route: TransitRoute) {
  return `${route.routeCode} - ${route.routeName}`
}

export default function StationsPage() {
  const router = useRouter()
  const [stations, setStations] = useState<Station[]>([])
  const [routeOptions, setRouteOptions] = useState<TransitRoute[]>([])
  const [keyword, setKeyword] = useState("")
  const [routeId, setRouteId] = useState("all")
  const [status, setStatus] = useState("all")
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [tableError, setTableError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const [formOpen, setFormOpen] = useState(false)
  const [editingStation, setEditingStation] = useState<Station | null>(null)
  const [formRouteId, setFormRouteId] = useState("")
  const [stationName, setStationName] = useState("")
  const [stationOrder, setStationOrder] = useState("")
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState("")

  const [statusStation, setStatusStation] = useState<Station | null>(null)
  const [statusLoading, setStatusLoading] = useState(false)

  const [importOpen, setImportOpen] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importPreviewItems, setImportPreviewItems] = useState<StationImportPreviewItem[]>([])
  const [importPreviewSummary, setImportPreviewSummary] = useState<{ totalRows: number; validRows: number; invalidRows: number } | null>(null)
  const [importErrors, setImportErrors] = useState<StationImportError[]>([])
  const [importError, setImportError] = useState("")
  const [importLoading, setImportLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const fromRow = totalElements === 0 ? 0 : page * pageSize + 1
  const toRow = Math.min((page + 1) * pageSize, totalElements)

  const loadRouteOptions = async () => {
    try {
      const response = await routeApi.listRoutes({ page: 0, size: 100 })
      setRouteOptions(response.result.items)
    } catch (error) {
      setTableError(getApiErrorMessage(error))
    }
  }

  const loadStations = async (
    targetPage = page,
    filters?: { keyword: string; routeId: string; status: string },
    targetPageSize = pageSize,
  ) => {
    setLoading(true)
    setTableError("")

    const currentKeyword = filters?.keyword ?? keyword
    const currentRouteId = filters?.routeId ?? routeId
    const currentStatus = filters?.status ?? status

    try {
      const response = await stationApi.listStations({
        keyword: currentKeyword.trim() || undefined,
        routeId: currentRouteId === "all" ? undefined : Number(currentRouteId),
        status: currentStatus === "all" ? undefined : currentStatus as MasterDataStatus,
        page: targetPage,
        size: targetPageSize,
      })

      setStations(response.result.items)
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
    void loadRouteOptions()
    void loadStations(0)
  }, [])

  const resetStationForm = () => {
    setEditingStation(null)
    setFormRouteId("")
    setStationName("")
    setStationOrder("")
    setFormError("")
  }

  const openCreateStation = () => {
    resetStationForm()
    setFormRouteId(routeId === "all" ? String(routeOptions[0]?.id ?? "") : routeId)
    setFormOpen(true)
  }

  const openEditStation = (station: Station) => {
    setEditingStation(station)
    setFormRouteId(String(station.routeId))
    setStationName(station.stationName)
    setStationOrder(String(station.stationOrder))
    setFormError("")
    setFormOpen(true)
  }

  const handleSubmitStation = async (event: FormEvent) => {
    event.preventDefault()

    const payload = normalizeStationForm(formRouteId, stationName, stationOrder)
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
      if (editingStation) {
        await stationApi.updateStation(editingStation.id, payload)
        setSuccessMessage("Ga/trạm đã được cập nhật.")
      } else {
        await stationApi.createStation(payload)
        setSuccessMessage("Ga/trạm đã được tạo.")
      }

      setFormOpen(false)
      resetStationForm()
      await loadStations(editingStation ? page : 0)
    } catch (error) {
      setFormError(getApiErrorMessage(error))
    } finally {
      setFormLoading(false)
    }
  }

  const handleApplyFilters = () => {
    setSuccessMessage("")
    void loadStations(0)
  }

  const handleResetFilters = () => {
    const resetFilters = { keyword: "", routeId: "all", status: "all" }
    setKeyword("")
    setRouteId("all")
    setStatus("all")
    setSuccessMessage("")
    void loadStations(0, resetFilters)
  }

  const handlePageSizeChange = (value: string) => {
    const nextPageSize = Number(value)
    setPageSize(nextPageSize)
    setSuccessMessage("")
    void loadStations(0, undefined, nextPageSize)
  }

  const handleToggleStatus = async () => {
    if (!statusStation) return

    setStatusLoading(true)
    setTableError("")

    try {
      if (statusStation.status === "ACTIVE") {
        await stationApi.disableStation(statusStation.id)
        setSuccessMessage("Ga/trạm đã được vô hiệu hóa.")
      } else {
        await stationApi.enableStation(statusStation.id)
        setSuccessMessage("Ga/trạm đã được kích hoạt.")
      }

      setStatusStation(null)
      await loadStations(page)
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
    setImportError("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleImportFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    setImportFile(file)
    setImportPreviewItems([])
    setImportPreviewSummary(null)
    setImportErrors([])
    setImportError("")
  }

  const handleOpenImportFilePicker = () => {
    fileInputRef.current?.click()
  }

  const handleDownloadTemplate = () => {
    const link = document.createElement("a")
    link.href = "/templates/station-import-template.xlsx"
    link.download = "station-import-template.xlsx"
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
    setImportPreviewSummary(null)

    try {
      const response = await stationApi.previewImportStations(importFile)
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

    try {
      const response = await stationApi.confirmImportStations(importFile)
      setSuccessMessage(`Import ga/trạm hoàn tất. Đã tạo ${response.result.imported} ga/trạm.`)
      await loadStations(0)
      setImportOpen(false)
      resetImportState()
    } catch (error) {
      if (isImportErrorResponse(error)) {
        setImportErrors(error.response.result.errors)
        setImportError("File có lỗi nên chưa có ga/trạm nào được tạo.")
      } else {
        setImportError(getApiErrorMessage(error))
      }
    } finally {
      setImportLoading(false)
    }
  }

  const hasInvalidImportRows = importErrors.length > 0
  const hasPreview = importPreviewItems.length > 0
  const canConfirmImport = Boolean(importFile && hasPreview && !hasInvalidImportRows)

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Ga/Trạm</h1>
          <p className="text-sm text-muted-foreground">Quản lý ga/trạm theo tuyến trong operator hiện tại.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setImportOpen(true)}>
            <FileUp className="h-4 w-4" />
            Import
          </Button>
          <Button onClick={openCreateStation}>
            <Plus className="h-4 w-4" />
            Tạo ga/trạm
          </Button>
        </div>
      </div>

      {successMessage && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-3 rounded-md border bg-card p-3 md:grid-cols-[minmax(220px,1fr)_220px_180px_auto_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Tìm mã hoặc tên ga/trạm" className="pl-9" />
        </div>
        <Select value={routeId} onValueChange={setRouteId}>
          <SelectTrigger>
            <SelectValue placeholder="Tuyến" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả tuyến</SelectItem>
            {routeOptions.map((route) => (
              <SelectItem key={route.id} value={String(route.id)}>{route.routeCode}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="ACTIVE">Đang hoạt động</SelectItem>
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
              <TableHead>Mã ga/trạm</TableHead>
              <TableHead>Tên ga/trạm</TableHead>
              <TableHead>Mã tuyến</TableHead>
              <TableHead>Thứ tự</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Cập nhật</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">Đang tải ga/trạm...</TableCell>
              </TableRow>
            )}
            {!loading && stations.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">Không có ga/trạm phù hợp.</TableCell>
              </TableRow>
            )}
            {!loading && stations.map((station) => (
              <TableRow key={station.id}>
                <TableCell className="font-medium">{station.stationCode}</TableCell>
                <TableCell>{station.stationName}</TableCell>
                <TableCell>{station.routeCode}</TableCell>
                <TableCell>{station.stationOrder}</TableCell>
                <TableCell><StatusBadge status={station.status} /></TableCell>
                <TableCell>{formatDateTime(station.updatedAt ?? station.createdAt)}</TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label={`Thao tác với ga/trạm ${station.stationCode}`}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/manager/stations/${station.id}`)}>
                          <Eye className="h-4 w-4" />
                          Xem
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditStation(station)}>
                          <Pencil className="h-4 w-4" />
                          Sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className={station.status === "ACTIVE" ? "text-destructive focus:text-destructive" : ""}
                          onClick={() => setStatusStation(station)}
                        >
                          {station.status === "ACTIVE" ? "Disable" : "Enable"}
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
            <Button variant="outline" size="sm" disabled={loading || page <= 0} onClick={() => void loadStations(page - 1)}>Trước</Button>
            <span className="min-w-20 text-center">Trang {totalPages === 0 ? 0 : page + 1}/{totalPages}</span>
            <Button variant="outline" size="sm" disabled={loading || page + 1 >= totalPages} onClick={() => void loadStations(page + 1)}>Sau</Button>
          </div>
        </div>
      </div>

      <Dialog open={formOpen} onOpenChange={(open) => {
        setFormOpen(open)
        if (!open) resetStationForm()
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingStation ? "Cập nhật ga/trạm" : "Tạo ga/trạm"}</DialogTitle>
            <DialogDescription>Backend tự sinh mã ga/trạm theo tuyến. Trạng thái được quản lý bằng thao tác riêng.</DialogDescription>
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
              <Input id="stationName" value={stationName} onChange={(event) => setStationName(event.target.value)} placeholder="Bến Thành" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stationOrder">Thứ tự trong tuyến</Label>
              <Input id="stationOrder" type="number" min={1} step={1} value={stationOrder} onChange={(event) => setStationOrder(event.target.value)} placeholder="1" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" disabled={formLoading} onClick={() => setFormOpen(false)}>Hủy</Button>
              <Button type="submit" disabled={formLoading}>{formLoading ? "Đang lưu..." : "Lưu"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={importOpen} onOpenChange={(open) => {
        setImportOpen(open)
        if (!open) resetImportState()
      }}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Import ga/trạm</DialogTitle>
            <DialogDescription>Validate toàn bộ file trước khi tạo ga/trạm. Confirm sẽ gửi lại file gốc cho backend xử lý.</DialogDescription>
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
              {!hasPreview && (
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

            {!hasPreview && (
              <div className="rounded-md border">
                <div className="border-b px-3 py-2 text-sm font-medium">Preview</div>
                <div className="p-3 text-sm text-muted-foreground">
                  {importFile ? `File đã chọn: ${importFile.name}` : "Chưa chọn file import."}
                </div>
              </div>
            )}

            {hasPreview && (
              <div className="rounded-md border">
                <Table className={TABLE_CLASS_NAME}>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Row</TableHead>
                      <TableHead>Mã tuyến</TableHead>
                      <TableHead>Tên ga/trạm</TableHead>
                      <TableHead>Thứ tự</TableHead>
                      <TableHead>Kết quả</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {importPreviewItems.map((item) => (
                      <TableRow key={`${item.row}-${item.routeCode ?? "empty"}`}>
                        <TableCell>{item.row}</TableCell>
                        <TableCell>{item.routeCode ?? "--"}</TableCell>
                        <TableCell>{item.stationName ?? "--"}</TableCell>
                        <TableCell>{item.stationOrder ?? "--"}</TableCell>
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

            <DialogFooter>
              {hasPreview && (
                <Button type="button" variant="outline" disabled={importLoading} onClick={handleChooseAnotherImportFile}>Chọn file khác</Button>
              )}
              <Button type="button" variant="outline" disabled={importLoading} onClick={() => setImportOpen(false)}>Hủy</Button>
              {!hasPreview && (
                <Button type="button" disabled={importLoading} onClick={() => void handlePreviewImport()}>
                  {importLoading ? "Đang preview..." : "Preview"}
                </Button>
              )}
              {hasPreview && (
                hasInvalidImportRows
                  ? <Button type="button" disabled={importLoading || !importFile} onClick={() => void handlePreviewImport()}>{importLoading ? "Đang preview..." : "Preview lại"}</Button>
                  : <Button type="button" disabled={!canConfirmImport || importLoading} onClick={() => void handleConfirmImport()}>{importLoading ? "Đang import..." : "Xác nhận import"}</Button>
              )}
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmationModal
        open={Boolean(statusStation)}
        onOpenChange={(open) => !open && setStatusStation(null)}
        title={statusStation?.status === "ACTIVE" ? "Vô hiệu hóa ga/trạm?" : "Kích hoạt ga/trạm?"}
        description={statusStation ? `Bạn đang thao tác với ga/trạm ${statusStation.stationCode} - ${statusStation.stationName}.` : ""}
        confirmText={statusStation?.status === "ACTIVE" ? "Disable" : "Enable"}
        variant={statusStation?.status === "ACTIVE" ? "destructive" : "default"}
        loading={statusLoading}
        onConfirm={() => void handleToggleStatus()}
      />
    </div>
  )
}
