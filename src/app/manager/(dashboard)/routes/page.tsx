"use client"

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react"
import { CheckCircle2, Download, FileUp, Pencil, Plus, Search, Upload } from "lucide-react"

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
import { ApiError, routeApi } from "@/lib/api"
import type {
  MasterDataStatus,
  PreviewImportRoutesResponse,
  RouteImportError,
  RouteImportPreviewItem,
  RouteMutationRequest,
  TransitRoute,
  TransportType,
} from "@/lib/api"
import { getApiErrorMessage, getApiErrorMessageFromBackendMessage } from "@/lib/messages"

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const
const TABLE_CLASS_NAME = "border-collapse [&_td]:border [&_th]:border [&_thead_tr]:bg-muted/40"

const TRANSPORT_TYPE_LABELS: Record<TransportType, string> = {
  METRO: "Metro",
  BUS: "Bus",
}

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

function normalizeRouteForm(routeName: string, transportType: string): RouteMutationRequest {
  return {
    routeName: routeName.trim(),
    transportType: transportType as TransportType,
  }
}

function isImportErrorResponse(error: unknown): error is ApiError<PreviewImportRoutesResponse> {
  return error instanceof ApiError && Boolean((error.response.result as PreviewImportRoutesResponse | null)?.errors?.length)
}

export default function RoutesPage() {
  const [routes, setRoutes] = useState<TransitRoute[]>([])
  const [keyword, setKeyword] = useState("")
  const [transportType, setTransportType] = useState("all")
  const [status, setStatus] = useState("all")
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [tableError, setTableError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const [formOpen, setFormOpen] = useState(false)
  const [editingRoute, setEditingRoute] = useState<TransitRoute | null>(null)
  const [routeName, setRouteName] = useState("")
  const [formTransportType, setFormTransportType] = useState<TransportType>("METRO")
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState("")

  const [statusRoute, setStatusRoute] = useState<TransitRoute | null>(null)
  const [statusLoading, setStatusLoading] = useState(false)

  const [importOpen, setImportOpen] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importPreviewItems, setImportPreviewItems] = useState<RouteImportPreviewItem[]>([])
  const [importPreviewSummary, setImportPreviewSummary] = useState<{ totalRows: number; validRows: number; invalidRows: number } | null>(null)
  const [importErrors, setImportErrors] = useState<RouteImportError[]>([])
  const [importedRoutes, setImportedRoutes] = useState<TransitRoute[]>([])
  const [importError, setImportError] = useState("")
  const [importLoading, setImportLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const fromRow = totalElements === 0 ? 0 : page * pageSize + 1
  const toRow = Math.min((page + 1) * pageSize, totalElements)

  const loadRoutes = async (
    targetPage = page,
    filters?: { keyword: string; transportType: string; status: string },
    targetPageSize = pageSize,
  ) => {
    setLoading(true)
    setTableError("")

    const currentKeyword = filters?.keyword ?? keyword
    const currentTransportType = filters?.transportType ?? transportType
    const currentStatus = filters?.status ?? status

    try {
      const response = await routeApi.listRoutes({
        keyword: currentKeyword.trim() || undefined,
        transportType: currentTransportType === "all" ? undefined : currentTransportType as TransportType,
        status: currentStatus === "all" ? undefined : currentStatus as MasterDataStatus,
        page: targetPage,
        size: targetPageSize,
      })

      setRoutes(response.result.items)
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
    void loadRoutes(0)
  }, [])

  const resetRouteForm = () => {
    setEditingRoute(null)
    setRouteName("")
    setFormTransportType("METRO")
    setFormError("")
  }

  const openCreateRoute = () => {
    resetRouteForm()
    setFormOpen(true)
  }

  const openEditRoute = (route: TransitRoute) => {
    setEditingRoute(route)
    setRouteName(route.routeName)
    setFormTransportType(route.transportType)
    setFormError("")
    setFormOpen(true)
  }

  const handleSubmitRoute = async (event: FormEvent) => {
    event.preventDefault()

    const payload = normalizeRouteForm(routeName, formTransportType)
    if (!payload.routeName || !payload.transportType) {
      setFormError("Vui lòng nhập đầy đủ thông tin tuyến.")
      return
    }

    setFormLoading(true)
    setFormError("")

    try {
      if (editingRoute) {
        await routeApi.updateRoute(editingRoute.id, payload)
        setSuccessMessage("Tuyến đã được cập nhật.")
      } else {
        await routeApi.createRoute(payload)
        setSuccessMessage("Tuyến đã được tạo.")
      }

      setFormOpen(false)
      resetRouteForm()
      await loadRoutes(editingRoute ? page : 0)
    } catch (error) {
      setFormError(getApiErrorMessage(error))
    } finally {
      setFormLoading(false)
    }
  }

  const handleApplyFilters = () => {
    setSuccessMessage("")
    void loadRoutes(0)
  }

  const handleResetFilters = () => {
    const resetFilters = { keyword: "", transportType: "all", status: "all" }
    setKeyword("")
    setTransportType("all")
    setStatus("all")
    setSuccessMessage("")
    void loadRoutes(0, resetFilters)
  }

  const handlePageSizeChange = (value: string) => {
    const nextPageSize = Number(value)
    setPageSize(nextPageSize)
    setSuccessMessage("")
    void loadRoutes(0, undefined, nextPageSize)
  }

  const handleToggleStatus = async () => {
    if (!statusRoute) return

    setStatusLoading(true)
    setTableError("")

    try {
      if (statusRoute.status === "ACTIVE") {
        await routeApi.disableRoute(statusRoute.id)
        setSuccessMessage("Tuyến đã được vô hiệu hóa.")
      } else {
        await routeApi.enableRoute(statusRoute.id)
        setSuccessMessage("Tuyến đã được kích hoạt.")
      }

      setStatusRoute(null)
      await loadRoutes(page)
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
    setImportedRoutes([])
    setImportError("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleImportFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    setImportFile(file)
    setImportPreviewItems([])
    setImportPreviewSummary(null)
    setImportErrors([])
    setImportedRoutes([])
    setImportError("")
  }

  const handleOpenImportFilePicker = () => {
    fileInputRef.current?.click()
  }

  const handleDownloadTemplate = () => {
    const link = document.createElement("a")
    link.href = "/templates/route-import-template.xlsx"
    link.download = "route-import-template.xlsx"
    link.click()
  }

  const handleChooseAnotherImportFile = () => {
    setImportFile(null)
    setImportPreviewItems([])
    setImportPreviewSummary(null)
    setImportErrors([])
    setImportedRoutes([])
    setImportError("")

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
      fileInputRef.current.click()
    }
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
    setImportedRoutes([])

    try {
      const response = await routeApi.previewImportRoutes(importFile)
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
      const response = await routeApi.confirmImportRoutes(importFile)
      setSuccessMessage(`Import tuyến hoàn tất. Đã tạo ${response.result.imported} tuyến.`)
      await loadRoutes(0)
      setImportOpen(false)
      resetImportState()
    } catch (error) {
      if (isImportErrorResponse(error)) {
        setImportErrors(error.response.result.errors)
        setImportError("File có lỗi nên chưa có tuyến nào được tạo.")
      } else {
        setImportError(getApiErrorMessage(error))
      }
    } finally {
      setImportLoading(false)
    }
  }

  const hasInvalidImportRows = importErrors.length > 0
  const canConfirmImport = Boolean(importFile && importPreviewItems.length > 0 && !hasInvalidImportRows && importedRoutes.length === 0)

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Tuyến</h1>
          <p className="text-sm text-muted-foreground">Quản lý tuyến metro/bus trong operator hiện tại.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setImportOpen(true)}>
            <FileUp className="h-4 w-4" />
            Import
          </Button>
          <Button onClick={openCreateRoute}>
            <Plus className="h-4 w-4" />
            Tạo tuyến
          </Button>
        </div>
      </div>

      {successMessage && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-3 rounded-md border bg-card p-3 md:grid-cols-[minmax(220px,1fr)_180px_180px_auto_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Tìm mã hoặc tên tuyến" className="pl-9" />
        </div>
        <Select value={transportType} onValueChange={setTransportType}>
          <SelectTrigger>
            <SelectValue placeholder="Loại hình" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả loại hình</SelectItem>
            <SelectItem value="METRO">Metro</SelectItem>
            <SelectItem value="BUS">Bus</SelectItem>
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
              <TableHead>Mã tuyến</TableHead>
              <TableHead>Tên tuyến</TableHead>
              <TableHead>Loại hình</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Cập nhật</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">Đang tải tuyến...</TableCell>
              </TableRow>
            )}
            {!loading && routes.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">Không có tuyến phù hợp.</TableCell>
              </TableRow>
            )}
            {!loading && routes.map((route) => (
              <TableRow key={route.id}>
                <TableCell className="font-medium">{route.routeCode}</TableCell>
                <TableCell>{route.routeName}</TableCell>
                <TableCell>{TRANSPORT_TYPE_LABELS[route.transportType]}</TableCell>
                <TableCell><StatusBadge status={route.status} /></TableCell>
                <TableCell>{formatDateTime(route.updatedAt ?? route.createdAt)}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEditRoute(route)}>
                      <Pencil className="h-4 w-4" />
                      Sửa
                    </Button>
                    <Button
                      variant={route.status === "ACTIVE" ? "destructive" : "outline"}
                      size="sm"
                      onClick={() => setStatusRoute(route)}
                    >
                      {route.status === "ACTIVE" ? "Disable" : "Enable"}
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
            <Button variant="outline" size="sm" disabled={loading || page <= 0} onClick={() => void loadRoutes(page - 1)}>Trước</Button>
            <span className="min-w-20 text-center">Trang {totalPages === 0 ? 0 : page + 1}/{totalPages}</span>
            <Button variant="outline" size="sm" disabled={loading || page + 1 >= totalPages} onClick={() => void loadRoutes(page + 1)}>Sau</Button>
          </div>
        </div>
      </div>

      <Dialog open={formOpen} onOpenChange={(open) => {
        setFormOpen(open)
        if (!open) resetRouteForm()
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingRoute ? "Cập nhật tuyến" : "Tạo tuyến"}</DialogTitle>
            <DialogDescription>Backend tự sinh mã tuyến và scope operator từ tài khoản đăng nhập.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitRoute} className="space-y-4">
            {formError && <Alert variant="destructive"><AlertDescription>{formError}</AlertDescription></Alert>}
            <div className="space-y-2">
              <Label htmlFor="routeName">Tên tuyến</Label>
              <Input id="routeName" value={routeName} onChange={(event) => setRouteName(event.target.value)} placeholder="Metro Line 1" />
            </div>
            <div className="space-y-2">
              <Label>Loại hình vận tải</Label>
              <Select value={formTransportType} onValueChange={(value) => setFormTransportType(value as TransportType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="METRO">Metro</SelectItem>
                  <SelectItem value="BUS">Bus</SelectItem>
                </SelectContent>
              </Select>
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
            <DialogTitle>Import tuyến</DialogTitle>
            <DialogDescription>Validate toàn bộ file trước khi tạo tuyến. Confirm sẽ gửi lại file gốc cho backend xử lý.</DialogDescription>
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
            {importedRoutes.length > 0 && (
              <Alert>
                <AlertDescription>Đã import thành công {importedRoutes.length} tuyến.</AlertDescription>
              </Alert>
            )}
            <input ref={fileInputRef} type="file" accept=".xlsx" className="hidden" onChange={handleImportFileChange} />
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              {importPreviewItems.length === 0 && importedRoutes.length === 0 && (
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

            {importPreviewItems.length === 0 && importedRoutes.length === 0 && (
              <div className="rounded-md border">
                <div className="border-b px-3 py-2 text-sm font-medium">Preview</div>
                <div className="p-3 text-sm text-muted-foreground">
                  {importFile ? `File đã chọn: ${importFile.name}` : "Chưa chọn file import."}
                </div>
              </div>
            )}

            {importPreviewItems.length > 0 && importedRoutes.length === 0 && (
              <div className="rounded-md border">
                <Table className={TABLE_CLASS_NAME}>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Row</TableHead>
                      <TableHead>Tên tuyến</TableHead>
                      <TableHead>Loại hình</TableHead>
                      <TableHead>Kết quả</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {importPreviewItems.map((item) => (
                      <TableRow key={`${item.row}-${item.routeName ?? "empty"}`}>
                        <TableCell>{item.row}</TableCell>
                        <TableCell>{item.routeName ?? "--"}</TableCell>
                        <TableCell>{item.transportType ?? "--"}</TableCell>
                        <TableCell>{item.valid ? "Hợp lệ" : item.errors.map((error) => getApiErrorMessageFromBackendMessage(error.message)).join(", ")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {importedRoutes.length > 0 && (
              <div className="rounded-md border">
                <Table className={TABLE_CLASS_NAME}>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã tuyến</TableHead>
                      <TableHead>Tên tuyến</TableHead>
                      <TableHead>Loại hình</TableHead>
                      <TableHead>Trạng thái</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {importedRoutes.map((route) => (
                      <TableRow key={route.id}>
                        <TableCell>{route.routeCode}</TableCell>
                        <TableCell>{route.routeName}</TableCell>
                        <TableCell>{TRANSPORT_TYPE_LABELS[route.transportType]}</TableCell>
                        <TableCell>{STATUS_LABELS[route.status]}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {importErrors.length > 0 && importedRoutes.length === 0 && (
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
              {importPreviewItems.length > 0 && importedRoutes.length === 0 && (
                <Button type="button" variant="outline" disabled={importLoading} onClick={handleChooseAnotherImportFile}>Chọn file khác</Button>
              )}
              <Button type="button" variant="outline" disabled={importLoading} onClick={() => setImportOpen(false)}>
                {importedRoutes.length > 0 ? "Đóng" : "Hủy"}
              </Button>
              {importPreviewItems.length === 0 && importedRoutes.length === 0 && (
                <Button type="button" disabled={importLoading} onClick={() => void handlePreviewImport()}>
                  {importLoading ? "Đang preview..." : "Preview"}
                </Button>
              )}
              {importPreviewItems.length > 0 && importedRoutes.length === 0 && (
                hasInvalidImportRows
                  ? <Button type="button" disabled={importLoading || !importFile} onClick={() => void handlePreviewImport()}>{importLoading ? "Đang preview..." : "Preview lại"}</Button>
                  : <Button type="button" disabled={!canConfirmImport || importLoading} onClick={() => void handleConfirmImport()}>{importLoading ? "Đang import..." : "Xác nhận import"}</Button>
              )}
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmationModal
        open={Boolean(statusRoute)}
        onOpenChange={(open) => !open && setStatusRoute(null)}
        title={statusRoute?.status === "ACTIVE" ? "Vô hiệu hóa tuyến?" : "Kích hoạt tuyến?"}
        description={statusRoute ? `Bạn đang thao tác với tuyến ${statusRoute.routeCode} - ${statusRoute.routeName}.` : ""}
        confirmText={statusRoute?.status === "ACTIVE" ? "Disable" : "Enable"}
        variant={statusRoute?.status === "ACTIVE" ? "destructive" : "default"}
        loading={statusLoading}
        onConfirm={() => void handleToggleStatus()}
      />
    </div>
  )
}
