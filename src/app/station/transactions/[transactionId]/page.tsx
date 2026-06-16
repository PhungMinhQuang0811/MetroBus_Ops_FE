"use client"

import { TransactionDetailPage } from "@/components/transactions/transaction-detail-page"
import { ROUTES } from "@/lib/routes"

export default function StationTransactionDetailPage() {
  return <TransactionDetailPage backHref={ROUTES.station.transactions} />
}
