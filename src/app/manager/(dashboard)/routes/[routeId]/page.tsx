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
import { routeApi } from "@/lib/api"
import type { MasterDataStatus, RouteDetail, RouteMutationRequest, TransportType } from "@/lib/api"
import { getApiErrorMessage } from "@/lib/messages"

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

function getParamId(value: string | string[] | undefined) {
  const rawValue = Array.isArray(value) ? value[0] : value
  const id = Number(rawValue)

  return Number.isInteger(id) && id > 0 ? id : null
}

function normalizeRouteForm(routeName: string, transportType: string): RouteMutationRequest {
  return {
    routeName: routeName.trim(),
    transportType: transportType as TransportType,
  }
}

export default function RouteDetailPage() {
  const router = useRouter()
  const params = useParams<{ routeId: string }>()
  const routeId = getParamId(params.routeId)

  const [routeDetail, setRouteDetail] = useState<RouteDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState("")

  const [formOpen, setFormOpen] = useState(false)
  const [routeName, setRouteName] = useState("")
  const [transportType, setTransportType] = useState<TransportType>("METRO")
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState("")

  const loadRouteDetail = async () => {
    if (!routeId) {
      setPageError("Mã tuyến không hợp lệ.")
      setLoading(false)
      return
    }

    setLoading(true)
    setPageError("")

    try {
      const response = await routeApi.getRoute(routeId)
      setRouteDetail(response.result)
    } catch (error) {
      setPageError(getApiErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadRouteDetail()
  }, [routeId])

  const openEditRoute = () => {
    if (!routeDetail) return

    setRouteName(routeDetail.routeName)
    setTransportType(routeDetail.transportType)
    setFormError("")
    setFormOpen(true)
  }

  const handleSubmitRoute = async (event: FormEvent) => {
    event.preventDefault()
    if (!routeDetail) return

    const payload = normalizeRouteForm(routeName, transportType)
    if (!payload.routeName) {
      setFormError("Vui lòng nhập tên tuyến.")
      return
    }

    setFormLoading(true)
    setFormError("")

    try {
      await routeApi.updateRoute(routeDetail.id, payload)
      setFormOpen(false)
      await loadRouteDetail()
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
          <Button variant="ghost" className="mb-2 px-0" onClick={() => router.push("/manager/routes")}>
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
          <h1 className="text-2xl font-semibold text-foreground">Chi tiết tuyến {routeDetail?.routeCode ?? ""}</h1>
          <p className="text-sm text-muted-foreground">Thông tin tuyến và danh sách ga/trạm thuộc tuyến.</p>
        </div>
        {routeDetail && (
          <Button onClick={openEditRoute}>
            <Pencil className="h-4 w-4" />
            Sửa
          </Button>
        )}
      </div>

      {pageError && <Alert variant="destructive"><AlertDescription>{pageError}</AlertDescription></Alert>}
      {loading && <div className="rounded-md border p-4 text-sm text-muted-foreground">Đang tải chi tiết tuyến...</div>}

      {routeDetail && !loading && (
        <>
          <div className="grid gap-3 rounded-md border bg-card p-4 text-sm md:grid-cols-2">
            <div><span className="text-muted-foreground">Mã tuyến</span><div className="font-medium">{routeDetail.routeCode}</div></div>
            <div><span className="text-muted-foreground">Tên tuyến</span><div className="font-medium">{routeDetail.routeName}</div></div>
            <div><span className="text-muted-foreground">Loại hình</span><div className="font-medium">{TRANSPORT_TYPE_LABELS[routeDetail.transportType]}</div></div>
            <div><span className="text-muted-foreground">Trạng thái</span><div className="pt-1"><StatusBadge status={routeDetail.status} /></div></div>
            <div><span className="text-muted-foreground">Ngày tạo</span><div className="font-medium">{formatDateTime(routeDetail.createdAt)}</div></div>
            <div><span className="text-muted-foreground">Cập nhật</span><div className="font-medium">{formatDateTime(routeDetail.updatedAt)}</div></div>
          </div>

          <div className="rounded-md border">
            <div className="border-b px-3 py-2 text-sm font-medium">Ga/trạm thuộc tuyến ({routeDetail.stationCount})</div>
            <Table className={TABLE_CLASS_NAME}>
              <TableHeader>
                <TableRow>
                  <TableHead>Thứ tự</TableHead>
                  <TableHead>Mã ga/trạm</TableHead>
                  <TableHead>Tên ga/trạm</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {routeDetail.stations.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-20 text-center text-muted-foreground">Chưa có ga/trạm thuộc tuyến.</TableCell>
                  </TableRow>
                )}
                {routeDetail.stations.map((station) => (
                  <TableRow key={station.id}>
                    <TableCell>{station.stationOrder}</TableCell>
                    <TableCell className="font-medium">{station.stationCode}</TableCell>
                    <TableCell>{station.stationName}</TableCell>
                    <TableCell><StatusBadge status={station.status} /></TableCell>
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
            <DialogTitle>Cập nhật tuyến</DialogTitle>
            <DialogDescription>Chỉ cập nhật tên tuyến và loại hình vận tải.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitRoute} className="space-y-4">
            {formError && <Alert variant="destructive"><AlertDescription>{formError}</AlertDescription></Alert>}
            <div className="space-y-2">
              <Label htmlFor="routeName">Tên tuyến</Label>
              <Input id="routeName" value={routeName} onChange={(event) => setRouteName(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Loại hình vận tải</Label>
              <Select value={transportType} onValueChange={(value) => setTransportType(value as TransportType)}>
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
    </div>
  )
}
