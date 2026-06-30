"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Send } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { batchApi } from "@/lib/api"
import type { Batch, BatchStatus } from "@/lib/api"
import { getApiErrorMessage } from "@/lib/messages"

interface DataBatchDetailPageProps {
  backHref: string
}

const STATUS_LABELS: Record<BatchStatus, string> = {
  CREATED: "Đã tạo",
  SUBMITTED: "Đã gửi",
  ACCEPTED: "Đã nhận",
  REJECTED: "Bị từ chối",
  FAILED: "Lỗi",
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
  }).format(date)
}

function Field({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div>
      <span className="text-muted-foreground">{label}</span>
      <div className="break-words font-medium">{value ?? "--"}</div>
    </div>
  )
}

export function DataBatchDetailPage({ backHref }: DataBatchDetailPageProps) {
  const router = useRouter()
  const params = useParams<{ batchId: string }>()
  const batchId = getParamId(params.batchId)
  const [batch, setBatch] = useState<Batch | null>(null)
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [submitSuccess, setSubmitSuccess] = useState(false)

  useEffect(() => {
    const loadBatch = async () => {
      if (!batchId) {
        setPageError("Mã lô dữ liệu không hợp lệ.")
        setLoading(false)
        return
      }

      setLoading(true)
      setPageError("")

      try {
        const response = await batchApi.listBatches({ page: 0, size: 100 })
        const found = response.result.items.find((item) => item.id === batchId)

        if (!found) {
          setPageError("Không tìm thấy lô dữ liệu.")
        } else {
          setBatch(found)
        }
      } catch (error) {
        setPageError(getApiErrorMessage(error))
      } finally {
        setLoading(false)
      }
    }

    void loadBatch()
  }, [batchId])

  return (
    <div className="space-y-5">
      <div>
        <Button variant="ghost" className="mb-2 px-0" onClick={() => router.push(backHref)}>
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Chi tiết lô {batch?.batchCode ?? ""}</h1>
            <p className="text-sm text-muted-foreground">Thông tin lô dữ liệu đối soát đã gom từ giao dịch PENDING.</p>
          </div>
          <div className="flex items-center gap-2">
            {batch && <Badge variant="outline">{STATUS_LABELS[batch.status]}</Badge>}
            {batch && batch.status === "CREATED" && (
              <Button
                variant="outline"
                disabled={submitting}
                onClick={async () => {
                  setSubmitting(true)
                  setSubmitError("")
                  setSubmitSuccess(false)
                  try {
                    await batchApi.submitBatchToLevel5(batchId!)
                    setSubmitSuccess(true)
                    setBatch(prev => prev ? { ...prev, status: "SUBMITTED" } : prev)
                  } catch (error) {
                    setSubmitError(getApiErrorMessage(error))
                  } finally {
                    setSubmitting(false)
                  }
                }}
              >
                <Send className="mr-2 h-4 w-4" />
                {submitting ? "Đang gửi..." : "Gửi lên C5"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {pageError && <Alert variant="destructive"><AlertDescription>{pageError}</AlertDescription></Alert>}
      {loading && <div className="rounded-md border p-4 text-sm text-muted-foreground">Đang tải chi tiết lô...</div>}

      {batch && !loading && (
        <>
          <div className="rounded-md border bg-card p-4">
            <div className="mb-3 text-sm font-medium">Thông tin lô</div>
            <div className="grid gap-3 text-sm md:grid-cols-2">
              <Field label="Mã lô" value={batch.batchCode} />
              <Field label="Trạng thái" value={STATUS_LABELS[batch.status]} />
              <Field label="Từ" value={formatDateTime(batch.fromTime)} />
              <Field label="Đến" value={formatDateTime(batch.toTime)} />
              <Field label="Số giao dịch" value={batch.transactionCount.toLocaleString("vi-VN")} />
              <Field label="Submitted at" value={formatDateTime(batch.submittedAt)} />
              <Field label="Created at" value={formatDateTime(batch.createdAt)} />
              <Field label="Updated at" value={formatDateTime(batch.updatedAt)} />
            </div>
          </div>

          {submitError && <Alert variant="destructive"><AlertDescription>{submitError}</AlertDescription></Alert>}
          {submitSuccess && <Alert><AlertDescription>Đã gửi lô dữ liệu lên Cấp 5 thành công.</AlertDescription></Alert>}
          <div className="rounded-md border bg-card p-4">
            <div className="mb-1 text-sm font-medium">Giao dịch trong lô / Kết quả đồng bộ</div>
            <p className="text-sm text-muted-foreground">
              Việc gửi lô dữ liệu lên Cấp 5 được thực hiện tự động bằng Cron Job. Danh sách giao dịch và lịch sử đồng bộ sẽ được hiển thị tại đây khi các API truy vấn sẵn sàng.
            </p>
          </div>
        </>
      )}
    </div>
  )
}
