"use client"

import { useEffect, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import { shiftApi } from "@/lib/api"
import type { ShiftResponse } from "@/lib/api"
import { getApiErrorMessage } from "@/lib/messages"

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const

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

export function ManagerShiftPage() {
  const [shifts, setShifts] = useState<ShiftResponse[]>([])
  const [statusFilter, setStatusFilter] = useState("all")
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState<number>(10)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const fromRow = totalElements === 0 ? 0 : page * pageSize + 1
  const toRow = Math.min((page + 1) * pageSize, totalElements)

  useEffect(() => {
    void loadShifts(0)
  }, [])

  async function loadShifts(targetPage = page, targetPageSize = pageSize) {
    setLoading(true)
    setError("")
    try {
      const status = statusFilter === "all" ? undefined : statusFilter
      const response = await shiftApi.listAllShifts(targetPage, targetPageSize, undefined, status)
      setShifts(response.result.items)
      setPage(response.result.page)
      setPageSize(response.result.size)
      setTotalElements(response.result.totalElements)
      setTotalPages(response.result.totalPages)
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Ca trực</h1>
        <p className="text-sm text-muted-foreground">
          Xem danh sách ca trực của nhân viên trong operator.
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
      )}

      <div className="rounded-md border bg-card p-3">
        <div className="grid gap-3 lg:grid-cols-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="CHECKED_IN">Đang trực</SelectItem>
              <SelectItem value="CHECKED_OUT">Đã kết thúc</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mt-3 flex flex-wrap justify-end gap-2">
          <Button variant="outline" onClick={() => { setStatusFilter("all"); void loadShifts(0) }} disabled={loading}>
            Đặt lại
          </Button>
          <Button onClick={() => void loadShifts(0)} disabled={loading}>Lọc</Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table className="border-collapse [&_td]:border [&_th]:border [&_thead_tr]:bg-muted/40">
          <TableHeader>
            <TableRow>
              <TableHead>Ga</TableHead>
              <TableHead>Tuyến</TableHead>
              <TableHead>Bắt đầu</TableHead>
              <TableHead>Kết thúc</TableHead>
              <TableHead>Giao dịch</TableHead>
              <TableHead>Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shifts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Chưa có ca trực nào
                </TableCell>
              </TableRow>
            ) : (
              shifts.map((shift) => (
                <TableRow key={shift.id}>
                  <TableCell>{shift.stationName}</TableCell>
                  <TableCell>{shift.routeCode ?? "--"}</TableCell>
                  <TableCell>{formatDateTime(shift.checkedInAt)}</TableCell>
                  <TableCell>{formatDateTime(shift.checkedOutAt)}</TableCell>
                  <TableCell>{shift.totalTransactions}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        shift.status === "CHECKED_IN"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-slate-50 text-slate-700"
                      }
                    >
                      {shift.status === "CHECKED_IN" ? "Đang trực" : "Đã kết thúc"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>Số dòng / trang</span>
          <Select
            value={String(pageSize)}
            onValueChange={(v) => {
              const s = Number(v)
              setPageSize(s)
              void loadShifts(0, s)
            }}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((s) => (
                <SelectItem key={s} value={String(s)}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          {fromRow}–{toRow} của {totalElements}
        </div>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" disabled={page <= 0} onClick={() => void loadShifts(page - 1)}>
            Trước
          </Button>
          <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => void loadShifts(page + 1)}>
            Sau
          </Button>
        </div>
      </div>
    </div>
  )
}