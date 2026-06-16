"use client"

import { DataBatchDetailPage } from "@/components/batches/data-batch-detail-page"
import { ROUTES } from "@/lib/routes"

export default function ManagerDataBatchDetailPage() {
  return <DataBatchDetailPage backHref={ROUTES.manager.dataBatches} />
}
