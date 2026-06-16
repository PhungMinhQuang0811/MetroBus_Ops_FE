"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { transactionApi } from "@/lib/api"
import type { TransactionDecision, TransactionDetail } from "@/lib/api"
import { getApiErrorMessage } from "@/lib/messages"

interface TransactionDetailPageProps {
  backHref: string
}

function getParamId(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
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

function DecisionBadge({ decision }: { decision: TransactionDecision }) {
  const className = {
    OPEN_GATE: "border-emerald-200 bg-emerald-50 text-emerald-700",
    DENY: "border-rose-200 bg-rose-50 text-rose-700",
    ACCEPTED_FOR_FORWARDING: "border-sky-200 bg-sky-50 text-sky-700",
  }[decision]

  return <Badge variant="outline" className={className}>{decision}</Badge>
}

function Field({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div>
      <span className="text-muted-foreground">{label}</span>
      <div className="break-words font-medium">{value ?? "--"}</div>
    </div>
  )
}

export function TransactionDetailPage({ backHref }: TransactionDetailPageProps) {
  const router = useRouter()
  const params = useParams<{ transactionId: string }>()
  const transactionId = getParamId(params.transactionId)
  const [transaction, setTransaction] = useState<TransactionDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState("")

  useEffect(() => {
    const loadTransaction = async () => {
      if (!transactionId) {
        setPageError("Mã giao dịch không hợp lệ.")
        setLoading(false)
        return
      }

      setLoading(true)
      setPageError("")

      try {
        const response = await transactionApi.getTransactionDetail(transactionId)
        setTransaction(response.result)
      } catch (error) {
        setPageError(getApiErrorMessage(error))
      } finally {
        setLoading(false)
      }
    }

    void loadTransaction()
  }, [transactionId])

  return (
    <div className="space-y-5">
      <div>
        <Button variant="ghost" className="mb-2 px-0" onClick={() => router.push(backHref)}>
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Giao dịch vé {transaction?.id ?? ""}</h1>
            <p className="text-sm text-muted-foreground">Chi tiết lượt quét, thiết bị, sản phẩm vé và trạng thái đồng bộ Cấp 5.</p>
          </div>
          {transaction && <DecisionBadge decision={transaction.decision} />}
        </div>
      </div>

      {pageError && <Alert variant="destructive"><AlertDescription>{pageError}</AlertDescription></Alert>}
      {loading && <div className="rounded-md border p-4 text-sm text-muted-foreground">Đang tải chi tiết giao dịch...</div>}

      {transaction && !loading && (
        <>
          <div className="rounded-md border bg-card p-4">
            <div className="mb-3 text-sm font-medium">Overview</div>
            <div className="grid gap-3 text-sm md:grid-cols-4">
              <Field label="Event ID" value={transaction.eventId} />
              <Field label="Occurred at" value={formatDateTime(transaction.occurredAt)} />
              <Field label="Received at" value={formatDateTime(transaction.receivedAt)} />
              <Field label="Media type" value={transaction.mediaType} />
              <Field label="Tap type" value={transaction.tapType} />
              <Field label="Decision" value={transaction.decision} />
              <Field label="Reason" value={transaction.reason} />
              <Field label="Sync status" value={transaction.syncStatus} />
              <Field label="Ticket processing status" value={transaction.ticketProcessingStatus} />
              <Field label="Created at" value={formatDateTime(transaction.createdAt)} />
              <Field label="Updated at" value={formatDateTime(transaction.updatedAt)} />
            </div>
          </div>

          <div className="rounded-md border bg-card p-4">
            <div className="mb-3 text-sm font-medium">Thiết bị / vị trí</div>
            <div className="grid gap-3 text-sm md:grid-cols-4">
              <Field label="Device code" value={transaction.deviceCode} />
              <Field label="Device type" value={transaction.deviceType} />
              <Field label="Direction" value={transaction.deviceDirection} />
              <Field label="Station" value={`${transaction.stationCode ?? transaction.stationId} - ${transaction.stationName ?? "--"}`} />
              <Field label="Route" value={`${transaction.routeCode ?? transaction.routeId} - ${transaction.routeName ?? "--"}`} />
              <Field label="Operator" value={transaction.operatorCode ? `${transaction.operatorCode} - ${transaction.operatorName ?? "--"}` : transaction.operatorName} />
            </div>
          </div>

          <div className="rounded-md border bg-card p-4">
            <div className="mb-3 text-sm font-medium">Media / sản phẩm vé</div>
            <div className="grid gap-3 text-sm md:grid-cols-4">
              <Field label="Card ID" value={transaction.cardId} />
              <Field label="Card UID" value={transaction.cardUid} />
              <Field label="Card status" value={transaction.cardStatus} />
              <Field label="Ticket ID" value={transaction.ticketId} />
              <Field label="Ticket usage status" value={transaction.ticketUsageStatus} />
              <Field label="Entitlement ID" value={transaction.entitlementId} />
              <Field label="Entitlement status" value={transaction.entitlementStatus} />
              <Field label="QR ID" value={transaction.qrId} />
              <Field label="QR payload hash" value={transaction.qrPayloadHash} />
            </div>
          </div>

          <div className="rounded-md border bg-card p-4">
            <div className="mb-3 text-sm font-medium">Batch / đồng bộ Cấp 5</div>
            <div className="grid gap-3 text-sm md:grid-cols-4">
              <Field label="Batch ID" value={transaction.batchId} />
              <Field label="Journey ref" value={transaction.journeyRef} />
              <Field label="Raw event ref" value={transaction.rawEventRef} />
              <Field label="Raw event" value={transaction.rawEventAvailable ? "Có dữ liệu" : "Chưa có dữ liệu"} />
              <Field label="Ticket usage result" value={transaction.ticketUsageResultAvailable ? "Có dữ liệu" : "Chưa có dữ liệu"} />
              <Field label="Audit liên quan" value={transaction.auditAvailable ? "Có dữ liệu" : "Chưa có dữ liệu"} />
            </div>
          </div>

          <div className="rounded-md border bg-card p-4">
            <div className="mb-3 text-sm font-medium">Raw device event / Ticket usage result / Audit liên quan</div>
            <p className="text-sm text-muted-foreground">
              UC11 core đã hiển thị dữ liệu RDBMS. Các nguồn Mongo/raw payload đang được backend biểu diễn bằng flag availability để FE hiển thị trạng thái chờ dữ liệu.
            </p>
          </div>
        </>
      )}
    </div>
  )
}
