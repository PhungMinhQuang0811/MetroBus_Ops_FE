"use client"

import { FormEvent, useEffect, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { shiftApi, stationApi } from "@/lib/api"
import type { CheckInResponse, ShiftResponse } from "@/lib/api"
import { getApiErrorMessage } from "@/lib/messages"

const PAGE_SIZE = 10

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

export function StationShiftPage() {
  const [activeShift, setActiveShift] = useState<ShiftResponse | null>(null)
  const [history, setHistory] = useState<ShiftResponse[]>([])
  const [stations, setStations] = useState<{ id: number; name: string }[]>([])
  const [selectedStation, setSelectedStation] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
    loadStations()
  }, [])

  async function loadData() {
    try {
      const response = await shiftApi.listShifts(0, PAGE_SIZE)
      const shifts = response.result.items || []

      // Find active shift (CHECKED_IN)
      const active = shifts.find((s) => s.status === "CHECKED_IN")
      setActiveShift(active ?? null)

      // Set history
      setHistory(shifts)
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  async function loadStations() {
    try {
      const response = await stationApi.listStations({ page: 0, size: 100 })
      const items = response.result.items || []
      setStations(items.map((s) => ({ id: s.id, name: s.stationName })))
      if (items.length > 0 && !selectedStation) {
        setSelectedStation(String(items[0].id))
      }
    } catch {
      // silently fail
    }
  }

  async function handleCheckIn(e?: FormEvent) {
    e?.preventDefault()
    if (!selectedStation) return

    setActionLoading(true)
    setError(null)
    try {
      const stationId = Number(selectedStation)
      await shiftApi.checkIn({ stationId })
      await loadData()
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setActionLoading(false)
    }
  }

  async function handleCheckOut() {
    setActionLoading(true)
    setError(null)
    try {
      await shiftApi.checkOut()
      await loadData()
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Đang tải...</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
      )}

      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {activeShift ? "Ca hiện tại" : "Nhận ca trực"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeShift ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">ĐANG TRỰC</Badge>
                <span className="font-medium">{activeShift.stationName}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                <div>Bắt đầu: {formatDateTime(activeShift.checkedInAt)}</div>
                <div>Giao dịch trong ca: {activeShift.totalTransactions}</div>
              </div>
              <Button
                variant="destructive"
                onClick={handleCheckOut}
                disabled={actionLoading}
              >
                {actionLoading ? "Đang xử lý..." : "Kết ca"}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-muted-foreground text-sm">
                Bạn chưa nhận ca trực. Vui lòng chọn ga và nhấn Nhận ca.
              </p>
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <label className="text-sm font-medium">Chọn ga</label>
                  <Select value={selectedStation} onValueChange={setSelectedStation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn ga" />
                    </SelectTrigger>
                    <SelectContent>
                      {stations.map((s) => (
                        <SelectItem key={s.id} value={String(s.id)}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleCheckIn}
                  disabled={actionLoading || !selectedStation}
                >
                  {actionLoading ? "Đang xử lý..." : "Nhận ca"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* History Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lịch sử ca trực</CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="border-collapse [&_td]:border [&_th]:border [&_thead_tr]:bg-muted/40">
            <TableHeader>
              <TableRow>
                <TableHead>Ga</TableHead>
                <TableHead>Bắt đầu</TableHead>
                <TableHead>Kết thúc</TableHead>
                <TableHead>Giao dịch</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Chưa có ca trực nào
                  </TableCell>
                </TableRow>
              ) : (
                history.map((shift) => (
                  <TableRow key={shift.id}>
                    <TableCell>{shift.stationName}</TableCell>
                    <TableCell>{formatDateTime(shift.checkedInAt)}</TableCell>
                    <TableCell>{formatDateTime(shift.checkedOutAt)}</TableCell>
                    <TableCell>{shift.totalTransactions}</TableCell>
                    <TableCell>
                      <Badge
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
        </CardContent>
      </Card>
    </div>
  )
}