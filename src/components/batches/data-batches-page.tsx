"use client"

import { FormEvent, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, Eye, Plus } from "lucide-react"

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
import { batchApi } from "@/lib/api"
import type { Batch, BatchStatus, ListBatchesQuery } from "@/lib/api"
import { getApiErrorMessage } from "@/lib/messages"

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const
const TABLE_CLASS_NAME = "border-collapse [&_td]:border [&_th]:border [&_thead_tr]:bg-muted/40"

const STATUS_LABELS: Record<BatchStatus, string> = {
  CREATED: "Đã tạo",
  SUBMITTED: "Đã gửi",
  ACCEPTED: "Đã nhận",
  REJECTED: "Bị từ chối",
  FAILED: "Lỗi",
}

const STATUS_CLASS: Record<BatchStatus, string> = {
  CREATED: "border-amber-200 bg-amber-50 text-amber-700",
  SUBMITTED: "border-sky-200 bg-sky-50 text-sky-700",
  ACCEPTED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  REJECTED: "border-rose-200 bg-rose-50 text-rose-700",
  FAILED: "border-rose-200 bg-rose-50 text-rose-700",
}

interface DataBatchesPageProps {
  detailBasePath: string
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

function toApiDateTime(value: string) {
  // Backend expects LocalDateTime without offset/Z, e.g. 2026-06-04T00:00:00
  return value ? `${value}:00` : undefined
}

function StatusBadge({ status }: { status: BatchStatus }) {
  return <Badge variant="outline" className={STATUS_CLASS[status]}>{STATUS_LABELS[status]}</Badge>
}

export function DataBatchesPage({ detailBasePath }: DataBatchesPageProps) {
  const router = useRouter()
  const [batches, setBatches] = useState<Batch[]>([])
  const [status, setStatus] = useState("all")
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [tableError, setTableError] = useState("")
  const [filterError, setFilterError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const [createOpen, setCreateOpen] = useState(false)
  const [createFrom, setCreateFrom] = useState("")
  const [createTo, setCreateTo] = useState("")
  const [createLoading, setCreateLoading] = useState(false)
  const [createError, setCreateError] = useState("")
  const [createdBatch, setCreatedBatch] = useState<Batch | null>(null)

  const fromRow = totalElements === 0 ? 0 : page * pageSize + 1
  const toRow = Math.min((page + 1) * pageSize, totalElements)

  const buildQuery = (targetPage: number, targetPageSize: number): ListBatchesQuery => ({
    status: status === "all" ? undefined : status as BatchStatus,
    from: toApiDateTime(from),
    to: toApiDateTime(to),
    page: targetPage,
    size: targetPageSize,
  })

  const loadBatches = async (targetPage = page, targetPageSize = pageSize) => {
    if (from && to && from > to) {
      setFilterError("Thời gian bắt đầu phải trước hoặc bằng thời gian kết thúc.")
      return
    }

    setFilterError("")
    setLoading(true)
    setTableError("")

    try {
      const response = await batchApi.listBatches(buildQuery(targetPage, targetPageSize))
      setBatches(response.result.items)
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
    void loadBatches(0)
  }, [])

  const handleResetFilters = () => {
    setStatus("all")
    setFrom("")
    setTo("")
    setFilterError("")
    setSuccessMessage("")
    setTimeout(() => void loadBatches(0), 0)
  }

  const handlePageSizeChange = (value: string) => {
    const nextPageSize = Number(value)
    setPageSize(nextPageSize)
    void loadBatches(0, nextPageSize)
  }

  const openCreateBatch = () => {
    setCreateFrom("")
    setCreateTo("")
    setCreateError("")
    setCreatedBatch(null)
    setCreateOpen(true)
  }

  const handleCreateBatch = async (event: FormEvent) => {
    event.preventDefault()

    if (!createFrom || !createTo) {
      setCreateError("Vui lòng chọn khoảng thời gian.")
      return
    }

    if (createFrom > createTo) {
      setCreateError("Thời gian bắt đầu phải trước hoặc bằng thời gian kết thúc.")
      return
    }

    setCreateLoading(true)
    setCreateError("")

    try {
      const response = await batchApi.createBatch({
        fromTime: `${createFrom}:00`,
        toTime: `${createTo}:00`,
      })
      setCreatedBatch(response.result)
      setSuccessMessage(`Đã tạo lô dữ liệu ${response.result.batchCode}.`)
      await loadBatches(0)
    } catch (error) {
      setCreateError(getApiErrorMessage(error))
    } finally {
      setCreateLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Lô dữ liệu đối soát</h1>
          <p className="text-sm text-muted-foreground">
            Gom giao dịch PENDING theo khoảng thời gian thành lô để gửi lên Cấp 5.
          </p>
        </div>
        <Button onClick={openCreateBatch}>
          <Plus className="h-4 w-4" />
          Tạo lô dữ liệu
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
          <Input type="datetime-local" value={from} onChange={(event) => setFrom(event.target.value)} aria-label="Từ ngày giờ" />
          <Input type="datetime-local" value={to} onChange={(event) => setTo(event.target.value)} aria-label="Đến ngày giờ" />
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger><SelectValue placeholder="Trạng thái" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="CREATED">Đã tạo</SelectItem>
              <SelectItem value="SUBMITTED">Đã gửi</SelectItem>
              <SelectItem value="ACCEPTED">Đã nhận</SelectItem>
              <SelectItem value="REJECTED">Bị từ chối</SelectItem>
              <SelectItem value="FAILED">Lỗi</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mt-3 flex flex-wrap justify-end gap-2">
          <Button variant="outline" onClick={handleResetFilters} disabled={loading}>Đặt lại</Button>
          <Button onClick={() => void loadBatches(0)} disabled={loading}>Lọc</Button>
        </div>
        {filterError && <p className="mt-2 text-sm text-destructive">{filterError}</p>}
      </div>

      {tableError && <Alert variant="destructive"><AlertDescription>{tableError}</AlertDescription></Alert>}

      <div className="rounded-md border">
        <Table className={TABLE_CLASS_NAME}>
          <TableHeader>
            <TableRow>
              <TableHead>Mã lô</TableHead>
              <TableHead>Khoảng dữ liệu</TableHead>
              <TableHead>Số giao dịch</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Thời gian tạo</TableHead>
              <TableHead>Submitted at</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && <TableRow><TableCell colSpan={7} className="h-24 text-center text-muted-foreground">Đang tải lô dữ liệu...</TableCell></TableRow>}
            {!loading && batches.length === 0 && <TableRow><TableCell colSpan={7} className="h-24 text-center text-muted-foreground">Chưa có lô dữ liệu phù hợp.</TableCell></TableRow>}
            {!loading && batches.map((batch) => (
              <TableRow key={batch.id}>
                <TableCell className="font-medium">{batch.batchCode}</TableCell>
                <TableCell>
                  <div>{formatDateTime(batch.fromTime)}</div>
                  <div className="text-xs text-muted-foreground">{formatDateTime(batch.toTime)}</div>
                </TableCell>
                <TableCell>{batch.transactionCount.toLocaleString("vi-VN")}</TableCell>
                <TableCell><StatusBadge status={batch.status} /></TableCell>
                <TableCell>{formatDateTime(batch.createdAt)}</TableCell>
                <TableCell>{formatDateTime(batch.submittedAt)}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" aria-label={`Xem lô ${batch.batchCode}`} onClick={() => router.push(`${detailBasePath}/${batch.id}`)}>
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
            <Button variant="outline" size="sm" disabled={loading || page <= 0} onClick={() => void loadBatches(page - 1)}>Trước</Button>
            <span className="min-w-20 text-center">Trang {totalPages === 0 ? 0 : page + 1}/{totalPages}</span>
            <Button variant="outline" size="sm" disabled={loading || page + 1 >= totalPages} onClick={() => void loadBatches(page + 1)}>Sau</Button>
          </div>
        </div>
      </div>

      <Dialog open={createOpen} onOpenChange={(open) => {
        setCreateOpen(open)
        if (!open) setCreatedBatch(null)
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tạo lô dữ liệu đối soát</DialogTitle>
            <DialogDescription>
              Hệ thống gom giao dịch sync_status = PENDING trong khoảng thời gian đã chọn và chưa thuộc lô nào.
            </DialogDescription>
          </DialogHeader>
          {createdBatch ? (
            <div className="space-y-3">
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>Đã tạo lô dữ liệu đối soát.</AlertDescription>
              </Alert>
              <div className="grid gap-2 rounded-md border bg-muted/30 p-3 text-sm">
                <div><span className="text-muted-foreground">Mã lô:</span> <span className="font-medium">{createdBatch.batchCode}</span></div>
                <div><span className="text-muted-foreground">Khoảng dữ liệu:</span> {formatDateTime(createdBatch.fromTime)} - {formatDateTime(createdBatch.toTime)}</div>
                <div><span className="text-muted-foreground">Số giao dịch:</span> {createdBatch.transactionCount.toLocaleString("vi-VN")}</div>
                <div><span className="text-muted-foreground">Trạng thái:</span> {STATUS_LABELS[createdBatch.status]}</div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>Về danh sách</Button>
                <Button type="button" onClick={() => router.push(`${detailBasePath}/${createdBatch.id}`)}>Xem chi tiết lô</Button>
              </DialogFooter>
            </div>
          ) : (
            <form onSubmit={handleCreateBatch} className="space-y-4">
              {createError && <Alert variant="destructive"><AlertDescription>{createError}</AlertDescription></Alert>}
              <div className="space-y-2">
                <Label htmlFor="createFrom">Từ ngày/giờ</Label>
                <Input id="createFrom" type="datetime-local" value={createFrom} onChange={(event) => setCreateFrom(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="createTo">Đến ngày/giờ</Label>
                <Input id="createTo" type="datetime-local" value={createTo} onChange={(event) => setCreateTo(event.target.value)} />
              </div>
              <div className="rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
                Điều kiện lấy giao dịch: sync_status = PENDING, occurred_at nằm trong khoảng đã chọn và chưa thuộc lô dữ liệu nào.
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" disabled={createLoading} onClick={() => setCreateOpen(false)}>Hủy</Button>
                <Button type="submit" disabled={createLoading}>{createLoading ? "Đang tạo..." : "Tạo lô dữ liệu"}</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
