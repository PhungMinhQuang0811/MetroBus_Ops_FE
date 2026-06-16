"use client"

import { DataBatchesPage } from "@/components/batches/data-batches-page"
import { ROUTES } from "@/lib/routes"

export default function ManagerDataBatchesPage() {
  return <DataBatchesPage detailBasePath={ROUTES.manager.dataBatches} />
}
