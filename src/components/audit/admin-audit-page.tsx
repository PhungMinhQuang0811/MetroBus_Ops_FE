"use client"

import { useEffect, useState } from "react"
import { Eye, RefreshCw, Search } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { auditApi } from "@/lib/api"
import type { AfcAuditSearchQuery, AuditLog, AuthAuditSearchQuery } from "@/lib/api"
import { getApiErrorMessage } from "@/lib/messages"
import { cn } from "@/lib/utils"

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const
const TABLE_CLASS_NAME = "border-collapse [&_td]:border [&_th]:border [&_thead_tr]:bg-muted/40"

type AuditTab = "auth" | "afc"

function toApiDateTime(value: string) {
  if (!value) return undefined
  const date = new Date(value)

  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
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
    second: "2-digit",
  }).format(date)
}

function formatJson(value: unknown) {
  if (value === undefined || value === null || value === "") return "--"

  if (typeof value === "string") {
    try {
      return JSON.stringify(JSON.parse(value), null, 2)
    } catch {
      return value
    }
  }

  return JSON.stringify(value, null, 2)
}

function resultBadgeClassName(result?: string | null) {
  const normalized = result?.toUpperCase()

  if (normalized === "SUCCESS") return "border-emerald-200 bg-emerald-50 text-emerald-700"
  if (normalized === "FAILED" || normalized === "ERROR") return "border-rose-200 bg-rose-50 text-rose-700"

  return "border-slate-200 bg-slate-50 text-slate-700"
}

function DetailField({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="min-w-0 rounded-md border p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 truncate text-sm font-medium">{value ?? "--"}</p>
    </div>
  )
}

function JsonBlock({ label, value }: { label: string; value: unknown }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      <Textarea value={formatJson(value)} readOnly className="min-h-32 resize-y font-mono text-xs" />
    </div>
  )
}

function AuditDetailDialog({
  log,
  tab,
  open,
  onOpenChange,
}: {
  log: AuditLog | null
  tab: AuditTab
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{tab === "auth" ? "Chi tiết audit tài khoản" : "Chi tiết audit vận hành"}</DialogTitle>
          <DialogDescription>Thông tin truy vết readonly từ audit log.</DialogDescription>
        </DialogHeader>

        {!log ? (
          <div className="rounded-md border p-4 text-sm text-muted-foreground">Không có dữ liệu chi tiết.</div>
        ) : (
          <div className="space-y-5">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <DetailField label="Thời gian" value={formatDateTime(log.createdAt)} />
              <DetailField label={tab === "auth" ? "Username" : "Người thao tác"} value={log.username} />
              <DetailField label="Account ID" value={log.accountId} />
              <DetailField label="Kết quả" value={log.result} />
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <DetailField label="Hành động" value={log.action} />
              <DetailField label="Request ID" value={log.requestId} />
              <DetailField label="IP address" value={log.ipAddress} />
              <DetailField label="API/Path" value={log.requestPath} />
            </div>

            {tab === "afc" && (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <DetailField label="Module" value={log.module} />
                <DetailField label="Loại tài nguyên" value={log.resourceType} />
                <DetailField label="Mã tài nguyên" value={log.resourceId} />
                <DetailField label="Tên/mô tả" value={log.resourceName} />
              </div>
            )}

            {tab === "auth" && (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <DetailField label="Loại tài nguyên" value={log.resourceType} />
                <DetailField label="Mã tài nguyên" value={log.resourceId} />
                <DetailField label="Tên tài nguyên" value={log.resourceName} />
                <DetailField label="HTTP method" value={log.httpMethod} />
              </div>
            )}

            <div className="rounded-md border p-3">
              <p className="text-xs text-muted-foreground">User agent</p>
              <p className="mt-1 break-all text-sm">{log.userAgent ?? "--"}</p>
            </div>

            {log.errorMessage && (
              <Alert variant="destructive">
                <AlertDescription>{log.errorMessage}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4 lg:grid-cols-2">
              {tab === "afc" && (
                <>
                  <JsonBlock label="Trước" value={log.before} />
                  <JsonBlock label="Sau" value={log.after} />
                </>
              )}
              <JsonBlock label="Request data" value={log.requestData} />
              <JsonBlock label="Response data" value={log.responseData} />
              <JsonBlock label="Metadata" value={log.metadata} />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function PaginationFooter({
  page,
  pageSize,
  totalElements,
  totalPages,
  loading,
  onPageChange,
  onPageSizeChange,
}: {
  page: number
  pageSize: number
  totalElements: number
  totalPages: number
  loading: boolean
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}) {
  const fromRow = totalElements === 0 ? 0 : page * pageSize + 1
  const toRow = Math.min((page + 1) * pageSize, totalElements)

  return (
    <div className="flex flex-col gap-3 border-t p-3 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-2">
        <span>Rows per page</span>
        <Select value={String(pageSize)} onValueChange={(value) => onPageSizeChange(Number(value))}>
          <SelectTrigger className="h-8 w-24"><SelectValue /></SelectTrigger>
          <SelectContent>
            {PAGE_SIZE_OPTIONS.map((option) => <SelectItem key={option} value={String(option)}>{option}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>{fromRow}-{toRow} of {totalElements}</div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled={loading || page <= 0} onClick={() => onPageChange(page - 1)}>Trước</Button>
        <span className="min-w-20 text-center">Trang {totalPages === 0 ? 0 : page + 1}/{totalPages}</span>
        <Button variant="outline" size="sm" disabled={loading || page + 1 >= totalPages} onClick={() => onPageChange(page + 1)}>Sau</Button>
      </div>
    </div>
  )
}

export function AdminAuditPage() {
  const [activeTab, setActiveTab] = useState<AuditTab>("auth")

  const [authFrom, setAuthFrom] = useState("")
  const [authTo, setAuthTo] = useState("")
  const [authUsername, setAuthUsername] = useState("")
  const [authAction, setAuthAction] = useState("")
  const [authResult, setAuthResult] = useState("all")
  const [authLogs, setAuthLogs] = useState<AuditLog[]>([])
  const [authPage, setAuthPage] = useState(0)
  const [authPageSize, setAuthPageSize] = useState(20)
  const [authTotalElements, setAuthTotalElements] = useState(0)
  const [authTotalPages, setAuthTotalPages] = useState(0)

  const [afcFrom, setAfcFrom] = useState("")
  const [afcTo, setAfcTo] = useState("")
  const [afcUsername, setAfcUsername] = useState("")
  const [afcAction, setAfcAction] = useState("")
  const [afcResourceType, setAfcResourceType] = useState("")
  const [afcResourceId, setAfcResourceId] = useState("")
  const [afcLogs, setAfcLogs] = useState<AuditLog[]>([])
  const [afcPage, setAfcPage] = useState(0)
  const [afcPageSize, setAfcPageSize] = useState(20)
  const [afcTotalElements, setAfcTotalElements] = useState(0)
  const [afcTotalPages, setAfcTotalPages] = useState(0)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [filterError, setFilterError] = useState("")
  const [detailLog, setDetailLog] = useState<AuditLog | null>(null)
  const [detailTab, setDetailTab] = useState<AuditTab>("auth")
  const [detailOpen, setDetailOpen] = useState(false)

  const validateRange = (from: string, to: string) => {
    if (from && to && from > to) {
      setFilterError("Thời gian bắt đầu phải trước hoặc bằng thời gian kết thúc.")
      return false
    }

    setFilterError("")
    return true
  }

  const buildAuthQuery = (page: number, size: number): AuthAuditSearchQuery => ({
    from: toApiDateTime(authFrom),
    to: toApiDateTime(authTo),
    username: authUsername.trim() || undefined,
    action: authAction.trim() || undefined,
    result: authResult === "all" ? undefined : authResult,
    page,
    size,
  })

  const buildAfcQuery = (page: number, size: number): AfcAuditSearchQuery => ({
    from: toApiDateTime(afcFrom),
    to: toApiDateTime(afcTo),
    username: afcUsername.trim() || undefined,
    action: afcAction.trim() || undefined,
    resourceType: afcResourceType.trim() || undefined,
    resourceId: afcResourceId.trim() || undefined,
    page,
    size,
  })

  const loadAuthLogs = async (page = authPage, size = authPageSize) => {
    if (!validateRange(authFrom, authTo)) return

    setLoading(true)
    setError("")

    try {
      const response = await auditApi.searchAuthAuditLogs(buildAuthQuery(page, size))
      setAuthLogs(response.result.items)
      setAuthPage(response.result.page)
      setAuthPageSize(response.result.size)
      setAuthTotalElements(response.result.totalElements)
      setAuthTotalPages(response.result.totalPages)
    } catch (loadError) {
      setError(getApiErrorMessage(loadError))
      setAuthLogs([])
    } finally {
      setLoading(false)
    }
  }

  const loadAfcLogs = async (page = afcPage, size = afcPageSize) => {
    if (!validateRange(afcFrom, afcTo)) return

    setLoading(true)
    setError("")

    try {
      const response = await auditApi.searchAfcAuditLogs(buildAfcQuery(page, size))
      setAfcLogs(response.result.items)
      setAfcPage(response.result.page)
      setAfcPageSize(response.result.size)
      setAfcTotalElements(response.result.totalElements)
      setAfcTotalPages(response.result.totalPages)
    } catch (loadError) {
      setError(getApiErrorMessage(loadError))
      setAfcLogs([])
    } finally {
      setLoading(false)
    }
  }

  const openDetail = async (tab: AuditTab, auditId: string) => {
    setDetailTab(tab)
    setDetailLog(null)
    setDetailOpen(true)

    try {
      const response = tab === "auth"
        ? await auditApi.getAuthAuditLog(auditId)
        : await auditApi.getAfcAuditLog(auditId)

      setDetailLog(response.result)
    } catch (loadError) {
      setError(getApiErrorMessage(loadError))
      setDetailOpen(false)
    }
  }

  useEffect(() => {
    void loadAuthLogs(0)
  }, [])

  const handleTabChange = (value: string) => {
    const nextTab = value as AuditTab
    setActiveTab(nextTab)
    setFilterError("")
    setError("")

    if (nextTab === "afc" && afcLogs.length === 0 && afcTotalElements === 0) void loadAfcLogs(0)
  }

  const resetAuthFilters = () => {
    setAuthFrom("")
    setAuthTo("")
    setAuthUsername("")
    setAuthAction("")
    setAuthResult("all")
    setFilterError("")
    setTimeout(() => void loadAuthLogs(0), 0)
  }

  const resetAfcFilters = () => {
    setAfcFrom("")
    setAfcTo("")
    setAfcUsername("")
    setAfcAction("")
    setAfcResourceType("")
    setAfcResourceId("")
    setFilterError("")
    setTimeout(() => void loadAfcLogs(0), 0)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Audit và truy vết</h1>
          <p className="text-sm text-muted-foreground">
            Tra cứu log đăng nhập, tài khoản và thao tác vận hành. Audit chỉ đọc, không sửa/xóa từ UI.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => activeTab === "auth" ? void loadAuthLogs() : void loadAfcLogs()}
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          Làm mới
        </Button>
      </div>

      {filterError && <Alert variant="destructive"><AlertDescription>{filterError}</AlertDescription></Alert>}
      {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList>
          <TabsTrigger value="auth">Đăng nhập & tài khoản</TabsTrigger>
          <TabsTrigger value="afc">Thao tác vận hành</TabsTrigger>
        </TabsList>

        <TabsContent value="auth" className="space-y-4">
          <div className="rounded-md border bg-card p-3">
            <div className="grid gap-3 lg:grid-cols-4">
              <Input type="datetime-local" value={authFrom} onChange={(event) => setAuthFrom(event.target.value)} aria-label="Từ ngày giờ" />
              <Input type="datetime-local" value={authTo} onChange={(event) => setAuthTo(event.target.value)} aria-label="Đến ngày giờ" />
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={authUsername} onChange={(event) => setAuthUsername(event.target.value)} placeholder="Username" className="pl-9" />
              </div>
              <Input value={authAction} onChange={(event) => setAuthAction(event.target.value)} placeholder="Action" />
              <Select value={authResult} onValueChange={setAuthResult}>
                <SelectTrigger><SelectValue placeholder="Kết quả" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả kết quả</SelectItem>
                  <SelectItem value="SUCCESS">SUCCESS</SelectItem>
                  <SelectItem value="FAILED">FAILED</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mt-3 flex flex-wrap justify-end gap-2">
              <Button variant="outline" onClick={resetAuthFilters} disabled={loading}>Đặt lại</Button>
              <Button onClick={() => void loadAuthLogs(0)} disabled={loading}>Lọc</Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table className={TABLE_CLASS_NAME}>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>IP address</TableHead>
                  <TableHead>User agent</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && activeTab === "auth" && <TableRow><TableCell colSpan={7} className="h-24 text-center text-muted-foreground">Đang tải audit...</TableCell></TableRow>}
                {(!loading || activeTab !== "auth") && authLogs.length === 0 && <TableRow><TableCell colSpan={7} className="h-24 text-center text-muted-foreground">Không có audit đăng nhập/tài khoản phù hợp.</TableCell></TableRow>}
                {authLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{formatDateTime(log.createdAt)}</TableCell>
                    <TableCell className="font-medium">{log.username ?? "--"}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell><Badge variant="outline" className={resultBadgeClassName(log.result)}>{log.result}</Badge></TableCell>
                    <TableCell>{log.ipAddress ?? "--"}</TableCell>
                    <TableCell className="max-w-72 truncate">{log.userAgent ?? "--"}</TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <Button variant="ghost" size="icon" aria-label={`Xem audit ${log.id}`} onClick={() => void openDetail("auth", log.id)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <PaginationFooter
              page={authPage}
              pageSize={authPageSize}
              totalElements={authTotalElements}
              totalPages={authTotalPages}
              loading={loading}
              onPageChange={(nextPage) => void loadAuthLogs(nextPage)}
              onPageSizeChange={(nextSize) => void loadAuthLogs(0, nextSize)}
            />
          </div>
        </TabsContent>

        <TabsContent value="afc" className="space-y-4">
          <div className="rounded-md border bg-card p-3">
            <div className="grid gap-3 lg:grid-cols-4">
              <Input type="datetime-local" value={afcFrom} onChange={(event) => setAfcFrom(event.target.value)} aria-label="Từ ngày giờ" />
              <Input type="datetime-local" value={afcTo} onChange={(event) => setAfcTo(event.target.value)} aria-label="Đến ngày giờ" />
              <Input value={afcUsername} onChange={(event) => setAfcUsername(event.target.value)} placeholder="Username" />
              <Input value={afcAction} onChange={(event) => setAfcAction(event.target.value)} placeholder="Action" />
              <Input value={afcResourceType} onChange={(event) => setAfcResourceType(event.target.value)} placeholder="Resource type" />
              <Input value={afcResourceId} onChange={(event) => setAfcResourceId(event.target.value)} placeholder="Resource ID" />
            </div>
            <div className="mt-3 flex flex-wrap justify-end gap-2">
              <Button variant="outline" onClick={resetAfcFilters} disabled={loading}>Đặt lại</Button>
              <Button onClick={() => void loadAfcLogs(0)} disabled={loading}>Lọc</Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table className={TABLE_CLASS_NAME}>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && activeTab === "afc" && <TableRow><TableCell colSpan={7} className="h-24 text-center text-muted-foreground">Đang tải audit...</TableCell></TableRow>}
                {(!loading || activeTab !== "afc") && afcLogs.length === 0 && <TableRow><TableCell colSpan={7} className="h-24 text-center text-muted-foreground">Không có audit vận hành phù hợp.</TableCell></TableRow>}
                {afcLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{formatDateTime(log.createdAt)}</TableCell>
                    <TableCell>
                      <div className="font-medium">{log.username ?? "--"}</div>
                    </TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell><Badge variant="outline" className={resultBadgeClassName(log.result)}>{log.result}</Badge></TableCell>
                    <TableCell>{log.module ?? "--"}</TableCell>
                    <TableCell>
                      <div>{log.resourceType ?? "--"}</div>
                      <div className="text-xs text-muted-foreground">{log.resourceId ?? "--"}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <Button variant="ghost" size="icon" aria-label={`Xem audit ${log.id}`} onClick={() => void openDetail("afc", log.id)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <PaginationFooter
              page={afcPage}
              pageSize={afcPageSize}
              totalElements={afcTotalElements}
              totalPages={afcTotalPages}
              loading={loading}
              onPageChange={(nextPage) => void loadAfcLogs(nextPage)}
              onPageSizeChange={(nextSize) => void loadAfcLogs(0, nextSize)}
            />
          </div>
        </TabsContent>
      </Tabs>

      <AuditDetailDialog
        log={detailLog}
        tab={detailTab}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  )
}
