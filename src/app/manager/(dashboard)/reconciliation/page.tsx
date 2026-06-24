"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { settlementApi } from "@/lib/api/services/reconciliation"
import type { Settlement } from "@/lib/api/dto/reconciliation"
import { getApiErrorMessage } from "@/lib/messages"

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const
const TABLE_CLASS_NAME = "border-collapse [&_td]:border [&_th]:border [&_thead_tr]:bg-muted/40"

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

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value)
}

export default function ReconciliationPage() {
  const [settlements, setSettlements] = useState<Settlement[]>([])
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [pageError, setPageError] = useState("")

  const fromRow = totalElements === 0 ? 0 : page * pageSize + 1
  const toRow = Math.min((page + 1) * pageSize, totalElements)

  const loadSettlements = async (targetPage = page, targetPageSize = pageSize) => {
    setLoading(true)
    setPageError("")
    try {
      const response = await settlementApi.listSettlements(targetPage, targetPageSize)
      setSettlements(response.result.items)
      setPage(response.result.page)
      setPageSize(response.result.size)
      setTotalElements(response.result.totalElements)
      setTotalPages(response.result.totalPages)
    } catch (error) {
      setPageError(getApiErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadSettlements(0)
  }, [])

  const handlePageSizeChange = (value: string) => {
    const nextSize = Number(value)
    setPageSize(nextSize)
    void loadSettlements(0, nextSize)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Đối soát doanh thu</h1>
          <p className="text-sm text-muted-foreground">Lịch sử phân chia doanh thu từ Cấp 5.</p>
        </div>
      </div>

      {pageError && (
        <Alert variant="destructive">
          <AlertDescription>{pageError}</AlertDescription>
        </Alert>
      )}

      <div className="rounded-md border">
        <Table className={TABLE_CLASS_NAME}>
          <TableHeader>
            <TableRow>
              <TableHead>Mã đối soát</TableHead>
              <TableHead>Kỳ</TableHead>
              <TableHead>Đơn vị</TableHead>
              <TableHead>Số tiền (VND)</TableHead>
              <TableHead>Tổng km</TableHead>
              <TableHead>Số chuyến</TableHead>
              <TableHead>Tỷ lệ km</TableHead>
              <TableHead>Thời gian</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            )}
            {!loading && settlements.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                  Chưa có dữ liệu đối soát.
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              settlements.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-mono text-xs">{s.settlementId}</TableCell>
                  <TableCell>{s.period}</TableCell>
                  <TableCell>{s.operatorCode}</TableCell>
                  <TableCell>{formatCurrency(s.allocatedAmount)}</TableCell>
                  <TableCell>{s.totalKm}</TableCell>
                  <TableCell>{s.totalTrips}</TableCell>
                  <TableCell>{s.kmRatio}</TableCell>
                  <TableCell>{formatDateTime(s.createdAt)}</TableCell>
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
                {PAGE_SIZE_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={String(opt)}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            {fromRow}-{toRow} of {totalElements}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={loading || page <= 0}
              onClick={() => void loadSettlements(page - 1)}
            >
              Trước
            </Button>
            <span className="min-w-20 text-center">
              Trang {totalPages === 0 ? 0 : page + 1}/{totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={loading || page + 1 >= totalPages}
              onClick={() => void loadSettlements(page + 1)}
            >
              Sau
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}