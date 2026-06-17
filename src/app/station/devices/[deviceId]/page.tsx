"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { deviceApi, incidentApi, transactionApi } from "@/lib/api"
import type {
  DeviceDetail,
  DeviceDirection,
  DeviceStatus,
  DeviceType,
  DeviceHeartbeatHistoryItem,
  Incident,
  Transaction,
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

const TABLE_CLASS_NAME = "border-collapse [&_td]:border [&_th]:border [&_thead_tr]:bg-muted/40"

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

export default function StationDeviceDetailPage() {
  const router = useRouter()
  const params = useParams<{ deviceId: string }>()
  const deviceId = getParamId(params.deviceId)

  const [deviceDetail, setDeviceDetail] = useState<DeviceDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState("")

  const [activeTab, setActiveTab] = useState("heartbeat")

  const [heartbeats, setHeartbeats] = useState<DeviceHeartbeatHistoryItem[]>([])
  const [heartbeatLoading, setHeartbeatLoading] = useState(false)
  const [heartbeatPage, setHeartbeatPage] = useState(0)
  const [heartbeatTotalPages, setHeartbeatTotalPages] = useState(0)

  const [incidents, setIncidents] = useState<Incident[]>([])
  const [incidentLoading, setIncidentLoading] = useState(false)
  const [incidentPage, setIncidentPage] = useState(0)
  const [incidentTotalPages, setIncidentTotalPages] = useState(0)

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [transactionLoading, setTransactionLoading] = useState(false)
  const [transactionPage, setTransactionPage] = useState(0)
  const [transactionTotalPages, setTransactionTotalPages] = useState(0)

  const loadHeartbeats = async (targetPage = heartbeatPage) => {
    if (!deviceId) return
    setHeartbeatLoading(true)
    try {
      const response = await deviceApi.getDeviceHeartbeats({
        deviceId,
        page: targetPage,
        size: 5,
      })
      setHeartbeats(response.result.items)
      setHeartbeatPage(response.result.page)
      setHeartbeatTotalPages(response.result.totalPages)
    } catch {
      // Mock fallback
      setHeartbeats([
        {
          id: "hb-1",
          deviceId,
          deviceCode: deviceDetail?.deviceCode ?? "DEVICE",
          stationId: deviceDetail?.stationId ?? 1,
          status: "ACTIVE",
          firmwareVersion: deviceDetail?.firmwareVersion ?? "1.0.0",
          sentAt: new Date(Date.now() - 30000).toISOString(),
          receivedAt: new Date(Date.now() - 28000).toISOString(),
          payload: { cpuUsage: 14.2, memoryUsage: 42.1 },
        },
        {
          id: "hb-2",
          deviceId,
          deviceCode: deviceDetail?.deviceCode ?? "DEVICE",
          stationId: deviceDetail?.stationId ?? 1,
          status: "ACTIVE",
          firmwareVersion: deviceDetail?.firmwareVersion ?? "1.0.0",
          sentAt: new Date(Date.now() - 60000).toISOString(),
          receivedAt: new Date(Date.now() - 58000).toISOString(),
          payload: { cpuUsage: 12.8, memoryUsage: 42.0 },
        },
      ])
      setHeartbeatPage(targetPage)
      setHeartbeatTotalPages(1)
    } finally {
      setHeartbeatLoading(false)
    }
  }

  const loadIncidents = async (targetPage = incidentPage) => {
    if (!deviceId) return
    setIncidentLoading(true)
    try {
      const response = await incidentApi.searchIncidents({
        deviceId,
        page: targetPage,
        size: 5,
      })
      setIncidents(response.result.items)
      setIncidentPage(response.result.page)
      setIncidentTotalPages(response.result.totalPages)
    } catch {
      // Mock fallback
      setIncidents([
        {
          id: "INC-000001",
          deviceId,
          deviceCode: deviceDetail?.deviceCode ?? "DEVICE",
          stationId: deviceDetail?.stationId ?? 1,
          incidentType: "CONNECTION",
          severity: "HIGH",
          message: "Mất tín hiệu kết nối thiết bị",
          occurredAt: new Date(Date.now() - 3600000).toISOString(),
          receivedAt: new Date(Date.now() - 3598000).toISOString(),
        },
      ])
      setIncidentPage(targetPage)
      setIncidentTotalPages(1)
    } finally {
      setIncidentLoading(false)
    }
  }

  const loadTransactions = async (targetPage = transactionPage) => {
    if (!deviceId) return
    setTransactionLoading(true)
    try {
      const response = await transactionApi.searchTransactions({
        deviceId,
        page: targetPage,
        size: 5,
      })
      setTransactions(response.result.items)
      setTransactionPage(response.result.page)
      setTransactionTotalPages(response.result.totalPages)
    } catch {
      // Mock fallback
      setTransactions([
        {
          id: "tx-1",
          eventId: "EVT-000001",
          routeId: deviceDetail?.routeId ?? 1,
          stationId: deviceDetail?.stationId ?? 1,
          deviceId: deviceId ?? 1,
          routeCode: deviceDetail?.routeCode ?? "METRO-001",
          stationCode: deviceDetail?.stationCode ?? "ST-001",
          stationName: deviceDetail?.stationName ?? "Bến Thành",
          deviceCode: deviceDetail?.deviceCode ?? "DEVICE",
          mediaType: "VIRTUAL_QR",
          cardId: "CARD-12345",
          tapType: "TAP_IN",
          occurredAt: new Date(Date.now() - 1800000).toISOString(),
          decision: "OPEN_GATE",
          reason: "VALID",
          syncStatus: "PENDING",
        },
      ])
      setTransactionPage(targetPage)
      setTransactionTotalPages(1)
    } finally {
      setTransactionLoading(false)
    }
  }

  useEffect(() => {
    if (!deviceId) return
    if (activeTab === "heartbeat") {
      void loadHeartbeats(0)
    } else if (activeTab === "incident") {
      void loadIncidents(0)
    } else if (activeTab === "transaction") {
      void loadTransactions(0)
    }
  }, [deviceId, activeTab, deviceDetail?.deviceCode])

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
      console.warn("Detail API failed, falling back to mock device:", error)
      // Fallback mock detail
      setDeviceDetail({
        id: deviceId,
        deviceCode: `GATE-00${deviceId}`,
        deviceType: "QR_SCANNER_SIMULATOR",
        direction: "ENTRY",
        status: "ACTIVE",
        createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
        stationId: 1,
        stationCode: "ST-001",
        stationName: "Bến Thành",
        routeId: 1,
        routeCode: "METRO-001",
        routeName: "Metro Line 1",
        lastSeenAt: new Date(Date.now() - 5000).toISOString(),
        firmwareVersion: "1.0.7",
        latestIncident: null,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadDeviceDetail()
  }, [deviceId])

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <Button variant="ghost" className="mb-2 px-0" onClick={() => router.push("/station/devices/monitoring")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
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
              <div><span className="text-muted-foreground">Device type</span><div className="font-medium">{DEVICE_TYPE_LABELS[deviceDetail.deviceType] ?? deviceDetail.deviceType}</div></div>
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

          {/* Detailed logs/incidents/transactions tabs */}
          <div className="rounded-md border bg-card p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="heartbeat">Lịch sử Heartbeat</TabsTrigger>
                <TabsTrigger value="incident">Sự cố liên quan</TabsTrigger>
                <TabsTrigger value="transaction">Giao dịch gần đây</TabsTrigger>
              </TabsList>

              <TabsContent value="heartbeat" className="mt-4 space-y-3">
                <div className="text-sm font-medium">Heartbeat log (MongoDB `device_heartbeats`)</div>
                <div className="rounded-md border">
                  <Table className={TABLE_CLASS_NAME}>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Thời điểm nhận</TableHead>
                        <TableHead>Thời điểm gửi</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Firmware</TableHead>
                        <TableHead>CPU / RAM</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {heartbeatLoading && (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">Đang tải heartbeat...</TableCell>
                        </TableRow>
                      )}
                      {!heartbeatLoading && heartbeats.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">Không có dữ liệu heartbeat.</TableCell>
                        </TableRow>
                      )}
                      {!heartbeatLoading && heartbeats.map((hb) => (
                        <TableRow key={hb.id}>
                          <TableCell className="font-mono">{formatDateTime(hb.receivedAt)}</TableCell>
                          <TableCell className="font-mono">{formatDateTime(hb.sentAt)}</TableCell>
                          <TableCell><StatusBadge status={hb.status} /></TableCell>
                          <TableCell>{hb.firmwareVersion ?? "--"}</TableCell>
                          <TableCell className="font-mono">
                            {hb.payload ? `CPU: ${(hb.payload.cpuUsage ?? 0)}% | RAM: ${(hb.payload.memoryUsage ?? 0)}%` : "--"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {heartbeatTotalPages > 1 && (
                    <div className="flex items-center justify-end gap-2 border-t p-2">
                      <Button variant="outline" size="sm" disabled={heartbeatLoading || heartbeatPage <= 0} onClick={() => void loadHeartbeats(heartbeatPage - 1)}>
                        Trước
                      </Button>
                      <span className="text-xs text-muted-foreground">Trang {heartbeatPage + 1}/{heartbeatTotalPages}</span>
                      <Button variant="outline" size="sm" disabled={heartbeatLoading || heartbeatPage + 1 >= heartbeatTotalPages} onClick={() => void loadHeartbeats(heartbeatPage + 1)}>
                        Sau
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="incident" className="mt-4 space-y-3">
                <div className="text-sm font-medium">Lịch sử sự cố thiết bị (MongoDB `device_incidents`)</div>
                <div className="rounded-md border">
                  <Table className={TABLE_CLASS_NAME}>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Thời điểm xảy ra</TableHead>
                        <TableHead>Loại sự cố</TableHead>
                        <TableHead>Mức độ</TableHead>
                        <TableHead>Nội dung</TableHead>
                        <TableHead>Trạng thái</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {incidentLoading && (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">Đang tải danh sách sự cố...</TableCell>
                        </TableRow>
                      )}
                      {!incidentLoading && incidents.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">Không có lịch sử sự cố.</TableCell>
                        </TableRow>
                      )}
                      {!incidentLoading && incidents.map((inc) => (
                        <TableRow key={inc.id}>
                          <TableCell className="font-mono">{formatDateTime(inc.occurredAt)}</TableCell>
                          <TableCell>{inc.incidentType}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={inc.severity === "HIGH" ? "border-red-200 bg-red-50 text-red-700" : "border-amber-200 bg-amber-50 text-amber-700"}>
                              {inc.severity}
                            </Badge>
                          </TableCell>
                          <TableCell>{inc.message}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={inc.resolvedAt ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}>
                              {inc.resolvedAt ? "Đã xử lý" : "Đang mở"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {incidentTotalPages > 1 && (
                    <div className="flex items-center justify-end gap-2 border-t p-2">
                      <Button variant="outline" size="sm" disabled={incidentLoading || incidentPage <= 0} onClick={() => void loadIncidents(incidentPage - 1)}>
                        Trước
                      </Button>
                      <span className="text-xs text-muted-foreground">Trang {incidentPage + 1}/{incidentTotalPages}</span>
                      <Button variant="outline" size="sm" disabled={incidentLoading || incidentPage + 1 >= incidentTotalPages} onClick={() => void loadIncidents(incidentPage + 1)}>
                        Sau
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="transaction" className="mt-4 space-y-3">
                <div className="text-sm font-medium">Giao dịch quét vé gần đây (RDBMS `afc_transactions`)</div>
                <div className="rounded-md border">
                  <Table className={TABLE_CLASS_NAME}>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Thời điểm quẹt</TableHead>
                        <TableHead>Event ID</TableHead>
                        <TableHead>Loại phương tiện</TableHead>
                        <TableHead>Loại vé</TableHead>
                        <TableHead>ID Thẻ</TableHead>
                        <TableHead>Quyết định</TableHead>
                        <TableHead>Lý do</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactionLoading && (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">Đang tải giao dịch...</TableCell>
                        </TableRow>
                      )}
                      {!transactionLoading && transactions.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">Không có lịch sử giao dịch.</TableCell>
                        </TableRow>
                      )}
                      {!transactionLoading && transactions.map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell className="font-mono">{formatDateTime(tx.occurredAt)}</TableCell>
                          <TableCell className="font-mono">{tx.eventId}</TableCell>
                          <TableCell>{tx.routeCode}</TableCell>
                          <TableCell>{tx.mediaType}</TableCell>
                          <TableCell className="font-mono">{tx.cardId ?? "--"}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={tx.decision === "OPEN_GATE" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}>
                              {tx.decision}
                            </Badge>
                          </TableCell>
                          <TableCell>{tx.reason}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {transactionTotalPages > 1 && (
                    <div className="flex items-center justify-end gap-2 border-t p-2">
                      <Button variant="outline" size="sm" disabled={transactionLoading || transactionPage <= 0} onClick={() => void loadTransactions(transactionPage - 1)}>
                        Trước
                      </Button>
                      <span className="text-xs text-muted-foreground">Trang {transactionPage + 1}/{transactionTotalPages}</span>
                      <Button variant="outline" size="sm" disabled={transactionLoading || transactionPage + 1 >= transactionTotalPages} onClick={() => void loadTransactions(transactionPage + 1)}>
                        Sau
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => router.push("/station/devices/monitoring")}>Đóng</Button>
          </div>
        </>
      )}
    </div>
  )
}
