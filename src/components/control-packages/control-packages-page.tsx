"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import { CheckCircle2, Eye, Pencil, Rocket, Plus } from "lucide-react"

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
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { controlPackageApi, stationApi } from "@/lib/api"
import type {
  ControlPackage,
  ControlPackageDetail,
  ControlPackageSourceType,
  ControlPackageStatus,
  ControlPackageType,
  ListControlPackagesQuery,
  Station,
} from "@/lib/api"
import { getApiErrorMessage } from "@/lib/messages"

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const
const TABLE_CLASS_NAME = "border-collapse [&_td]:border [&_th]:border [&_thead_tr]:bg-muted/40"

const PACKAGE_TYPE_LABELS: Record<ControlPackageType, string> = {
  DEVICE_CONFIG: "Cấu hình thiết bị",
  MEDIA_ACCESS_RULES: "Quy tắc media",
}

const SOURCE_TYPE_LABELS: Record<ControlPackageSourceType, string> = {
  LEVEL4_CREATED: "Cấp 4 tạo",
  LEVEL5_SYNCED: "Cấp 5 đồng bộ",
}

const STATUS_LABELS: Record<ControlPackageStatus, string> = {
  CREATED: "Nháp",
  PUBLISHED: "Đã phát hành",
  REVOKED: "Đã thu hồi",
}

const STATUS_CLASS: Record<ControlPackageStatus, string> = {
  CREATED: "border-amber-200 bg-amber-50 text-amber-700",
  PUBLISHED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  REVOKED: "border-slate-200 bg-slate-50 text-slate-700",
}

const DEFAULT_DEVICE_CONFIG_PAYLOAD = JSON.stringify({
  maxOfflineSeconds: 60,
  allowOfflineValidation: true,
  deviceTypes: ["QR_SCANNER_SIMULATOR"],
}, null, 2)

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

function StatusBadge({ status }: { status: ControlPackageStatus }) {
  return <Badge variant="outline" className={STATUS_CLASS[status]}>{STATUS_LABELS[status]}</Badge>
}

function formatJson(value: unknown) {
  return JSON.stringify(value ?? {}, null, 2)
}

function parsePayload(value: string) {
  const parsed = JSON.parse(value) as unknown

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Payload phải là JSON object.")
  }

  return parsed as Record<string, unknown>
}

function Field({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div>
      <span className="text-muted-foreground">{label}</span>
      <div className="break-words font-medium">{value ?? "--"}</div>
    </div>
  )
}

export function ControlPackagesPage() {
  const [packages, setPackages] = useState<ControlPackage[]>([])
  const [packageType, setPackageType] = useState("all")
  const [sourceType, setSourceType] = useState("all")
  const [status, setStatus] = useState("all")
  const [version, setVersion] = useState("")
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [tableError, setTableError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const [editorOpen, setEditorOpen] = useState(false)
  const [editingPackage, setEditingPackage] = useState<ControlPackageDetail | null>(null)
  const [editorPackageType, setEditorPackageType] = useState<ControlPackageType>("DEVICE_CONFIG")
  const [payloadText, setPayloadText] = useState(DEFAULT_DEVICE_CONFIG_PAYLOAD)
  const [editorError, setEditorError] = useState("")
  const [editorLoading, setEditorLoading] = useState(false)

  const [detailOpen, setDetailOpen] = useState(false)
  const [detailPackage, setDetailPackage] = useState<ControlPackageDetail | null>(null)
  const [detailError, setDetailError] = useState("")
  const [detailLoading, setDetailLoading] = useState(false)

  const [publishOpen, setPublishOpen] = useState(false)
  const [publishingPackage, setPublishingPackage] = useState<ControlPackage | null>(null)
  const [stations, setStations] = useState<Station[]>([])
  const [selectedStationIds, setSelectedStationIds] = useState<number[]>([])
  const [publishError, setPublishError] = useState("")
  const [publishLoading, setPublishLoading] = useState(false)

  const fromRow = totalElements === 0 ? 0 : page * pageSize + 1
  const toRow = Math.min((page + 1) * pageSize, totalElements)

  const filteredPackages = useMemo(() => {
    if (!version.trim()) return packages

    const target = Number(version)
    if (Number.isNaN(target)) return packages

    return packages.filter((item) => item.version === target)
  }, [packages, version])

  const buildQuery = (targetPage: number, targetPageSize: number): ListControlPackagesQuery => ({
    packageType: packageType === "all" ? undefined : packageType as ControlPackageType,
    sourceType: sourceType === "all" ? undefined : sourceType as ControlPackageSourceType,
    status: status === "all" ? undefined : status as ControlPackageStatus,
    page: targetPage,
    size: targetPageSize,
  })

  const loadPackages = async (targetPage = page, targetPageSize = pageSize) => {
    setLoading(true)
    setTableError("")

    try {
      const response = await controlPackageApi.listPackages(buildQuery(targetPage, targetPageSize))
      setPackages(response.result.items)
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
    void loadPackages(0)
  }, [])

  const resetFilters = () => {
    setPackageType("all")
    setSourceType("all")
    setStatus("all")
    setVersion("")
    setSuccessMessage("")
    setTimeout(() => void loadPackages(0), 0)
  }

  const openCreate = () => {
    setEditingPackage(null)
    setEditorPackageType("DEVICE_CONFIG")
    setPayloadText(DEFAULT_DEVICE_CONFIG_PAYLOAD)
    setEditorError("")
    setEditorOpen(true)
  }

  const openEdit = async (item: ControlPackage) => {
    setEditorOpen(true)
    setEditorLoading(true)
    setEditorError("")

    try {
      const response = await controlPackageApi.getPackageDetail(item.id)
      setEditingPackage(response.result)
      setEditorPackageType(response.result.packageType)
      setPayloadText(formatJson(response.result.payload))
    } catch (error) {
      setEditorError(getApiErrorMessage(error))
    } finally {
      setEditorLoading(false)
    }
  }

  const openDetail = async (item: ControlPackage) => {
    setDetailOpen(true)
    setDetailPackage(null)
    setDetailError("")
    setDetailLoading(true)

    try {
      const response = await controlPackageApi.getPackageDetail(item.id)
      setDetailPackage(response.result)
    } catch (error) {
      setDetailError(getApiErrorMessage(error))
    } finally {
      setDetailLoading(false)
    }
  }

  const handleSavePackage = async (event: FormEvent) => {
    event.preventDefault()
    setEditorError("")

    let payload: Record<string, unknown>
    try {
      payload = parsePayload(payloadText)
    } catch (error) {
      setEditorError(error instanceof Error ? error.message : "Payload không hợp lệ.")
      return
    }

    setEditorLoading(true)

    try {
      if (editingPackage) {
        const response = await controlPackageApi.updatePackage(editingPackage.id, { payload })
        setSuccessMessage(`Đã cập nhật package version ${response.result.version}.`)
      } else {
        const response = await controlPackageApi.createPackage({ packageType: editorPackageType, payload })
        setSuccessMessage(`Đã tạo package version ${response.result.version}.`)
      }

      setEditorOpen(false)
      await loadPackages(0)
    } catch (error) {
      setEditorError(getApiErrorMessage(error))
    } finally {
      setEditorLoading(false)
    }
  }

  const openPublish = async (item: ControlPackage) => {
    setPublishingPackage(item)
    setSelectedStationIds([])
    setPublishError("")
    setPublishOpen(true)
    setPublishLoading(true)

    try {
      const response = await stationApi.listStations({ page: 0, size: 100 })
      setStations(response.result.items)
    } catch (error) {
      setPublishError(getApiErrorMessage(error))
    } finally {
      setPublishLoading(false)
    }
  }

  const toggleStation = (stationId: number, checked: boolean) => {
    setSelectedStationIds((current) => checked ? [...current, stationId] : current.filter((id) => id !== stationId))
  }

  const handlePublish = async () => {
    if (!publishingPackage) return

    if (selectedStationIds.length === 0) {
      setPublishError("Vui lòng chọn ít nhất một ga/trạm.")
      return
    }

    setPublishLoading(true)
    setPublishError("")

    try {
      const response = await controlPackageApi.publishPackage(publishingPackage.id, { stationIds: selectedStationIds })
      setSuccessMessage(`Đã phát hành package tới ${response.result.stationSyncs.length} ga/trạm.`)
      setPublishOpen(false)
      await loadPackages(page)
    } catch (error) {
      setPublishError(getApiErrorMessage(error))
    } finally {
      setPublishLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Gói cấu hình</h1>
          <p className="text-sm text-muted-foreground">
            Tạo, chỉnh sửa nháp và phát hành control package xuống ga/trạm Cấp 3.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Tạo package
        </Button>
      </div>

      {successMessage && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <div className="rounded-md border bg-card p-3">
        <div className="grid gap-3 lg:grid-cols-4">
          <Select value={packageType} onValueChange={setPackageType}>
            <SelectTrigger><SelectValue placeholder="Package type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại</SelectItem>
              <SelectItem value="DEVICE_CONFIG">Cấu hình thiết bị</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sourceType} onValueChange={setSourceType}>
            <SelectTrigger><SelectValue placeholder="Source type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả nguồn</SelectItem>
              <SelectItem value="LEVEL4_CREATED">Cấp 4 tạo</SelectItem>
              <SelectItem value="LEVEL5_SYNCED">Cấp 5 đồng bộ</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="CREATED">Nháp</SelectItem>
              <SelectItem value="PUBLISHED">Đã phát hành</SelectItem>
              <SelectItem value="REVOKED">Đã thu hồi</SelectItem>
            </SelectContent>
          </Select>
          <Input value={version} onChange={(event) => setVersion(event.target.value)} placeholder="Version" inputMode="numeric" />
        </div>
        <div className="mt-3 flex flex-wrap justify-end gap-2">
          <Button variant="outline" onClick={resetFilters} disabled={loading}>Đặt lại</Button>
          <Button onClick={() => void loadPackages(0)} disabled={loading}>Lọc</Button>
        </div>
      </div>

      {tableError && <Alert variant="destructive"><AlertDescription>{tableError}</AlertDescription></Alert>}

      <div className="rounded-md border">
        <Table className={TABLE_CLASS_NAME}>
          <TableHeader>
            <TableRow>
              <TableHead>Version</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created by</TableHead>
              <TableHead>Updated at</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && <TableRow><TableCell colSpan={7} className="h-24 text-center text-muted-foreground">Đang tải package...</TableCell></TableRow>}
            {!loading && filteredPackages.length === 0 && <TableRow><TableCell colSpan={7} className="h-24 text-center text-muted-foreground">Chưa có package phù hợp.</TableCell></TableRow>}
            {!loading && filteredPackages.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">v{item.version}</TableCell>
                <TableCell>{PACKAGE_TYPE_LABELS[item.packageType]}</TableCell>
                <TableCell>{SOURCE_TYPE_LABELS[item.sourceType]}</TableCell>
                <TableCell><StatusBadge status={item.status} /></TableCell>
                <TableCell>{item.createdByAccountId ?? "--"}</TableCell>
                <TableCell>{formatDateTime(item.updatedAt ?? item.createdAt)}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" aria-label={`Xem package ${item.version}`} onClick={() => void openDetail(item)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {item.status === "CREATED" && item.sourceType === "LEVEL4_CREATED" && (
                      <Button variant="ghost" size="icon" aria-label={`Sửa package ${item.version}`} onClick={() => void openEdit(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                    {item.status === "CREATED" && (
                      <Button variant="ghost" size="icon" aria-label={`Phát hành package ${item.version}`} onClick={() => void openPublish(item)}>
                        <Rocket className="h-4 w-4" />
                      </Button>
                    )}
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
              void loadPackages(0, nextPageSize)
            }}>
              <SelectTrigger className="h-8 w-24"><SelectValue /></SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map((option) => <SelectItem key={option} value={String(option)}>{option}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>{fromRow}-{toRow} of {totalElements}</div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={loading || page <= 0} onClick={() => void loadPackages(page - 1)}>Trước</Button>
            <span className="min-w-20 text-center">Trang {totalPages === 0 ? 0 : page + 1}/{totalPages}</span>
            <Button variant="outline" size="sm" disabled={loading || page + 1 >= totalPages} onClick={() => void loadPackages(page + 1)}>Sau</Button>
          </div>
        </div>
      </div>

      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingPackage ? "Sửa Control Package" : "Tạo Control Package"}</DialogTitle>
            <DialogDescription>Payload được lưu dưới dạng JSON document theo schema của package type.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSavePackage} className="space-y-4">
            {editorError && <Alert variant="destructive"><AlertDescription>{editorError}</AlertDescription></Alert>}
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Package type</Label>
                <div className="rounded-md border bg-muted/30 px-3 py-2 text-sm">
                  {PACKAGE_TYPE_LABELS[editorPackageType]}
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <Label>Metadata</Label>
                <div className="rounded-md border bg-muted/30 p-2">
                  Source: {editingPackage ? SOURCE_TYPE_LABELS[editingPackage.sourceType] : SOURCE_TYPE_LABELS.LEVEL4_CREATED}
                  <br />
                  Status: {editingPackage ? STATUS_LABELS[editingPackage.status] : STATUS_LABELS.CREATED}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="payload">Payload JSON</Label>
              <Textarea id="payload" value={payloadText} onChange={(event) => setPayloadText(event.target.value)} className="min-h-64 font-mono text-sm" disabled={editorLoading} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" disabled={editorLoading} onClick={() => setEditorOpen(false)}>Hủy</Button>
              <Button type="submit" disabled={editorLoading}>{editorLoading ? "Đang lưu..." : "Lưu"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết Control Package</DialogTitle>
            <DialogDescription>Thông tin metadata và payload đang lưu trong hệ thống.</DialogDescription>
          </DialogHeader>
          {detailError && <Alert variant="destructive"><AlertDescription>{detailError}</AlertDescription></Alert>}
          {detailLoading && <div className="rounded-md border p-3 text-sm text-muted-foreground">Đang tải chi tiết...</div>}
          {detailPackage && !detailLoading && (
            <div className="space-y-4">
              <div className="grid gap-3 rounded-md border bg-card p-3 text-sm md:grid-cols-2">
                <Field label="Version" value={`v${detailPackage.version}`} />
                <Field label="Type" value={PACKAGE_TYPE_LABELS[detailPackage.packageType]} />
                <Field label="Source" value={SOURCE_TYPE_LABELS[detailPackage.sourceType]} />
                <Field label="Status" value={STATUS_LABELS[detailPackage.status]} />
                <Field label="Created at" value={formatDateTime(detailPackage.createdAt)} />
                <Field label="Published at" value={formatDateTime(detailPackage.publishedAt)} />
              </div>
              <pre className="max-h-80 overflow-auto rounded-md border bg-muted/30 p-3 text-xs">{formatJson(detailPackage.payload)}</pre>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={publishOpen} onOpenChange={setPublishOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Phát hành package</DialogTitle>
            <DialogDescription>
              Chọn danh sách ga/trạm sẽ nhận package version {publishingPackage?.version ?? "--"}.
            </DialogDescription>
          </DialogHeader>
          {publishError && <Alert variant="destructive"><AlertDescription>{publishError}</AlertDescription></Alert>}
          <div className="max-h-80 overflow-auto rounded-md border">
            {publishLoading && stations.length === 0 && <div className="p-3 text-sm text-muted-foreground">Đang tải danh sách ga/trạm...</div>}
            {!publishLoading && stations.length === 0 && <div className="p-3 text-sm text-muted-foreground">Chưa có ga/trạm để phát hành.</div>}
            {stations.map((station) => (
              <label key={station.id} className="flex cursor-pointer items-center gap-3 border-b p-3 text-sm last:border-b-0">
                <Checkbox
                  checked={selectedStationIds.includes(station.id)}
                  onCheckedChange={(checked) => toggleStation(station.id, checked === true)}
                />
                <span className="font-medium">{station.stationName}</span>
                <span className="text-muted-foreground">{station.stationCode}</span>
              </label>
            ))}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" disabled={publishLoading} onClick={() => setPublishOpen(false)}>Hủy</Button>
            <Button type="button" disabled={publishLoading} onClick={() => void handlePublish()}>
              {publishLoading ? "Đang xử lý..." : "Phát hành"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
