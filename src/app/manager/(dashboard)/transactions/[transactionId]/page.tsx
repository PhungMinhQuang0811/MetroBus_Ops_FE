"use client"

import { TransactionDetailPage } from "@/components/transactions/transaction-detail-page"
import { ROUTES } from "@/lib/routes"

export default function ManagerTransactionDetailPage() {
  return <TransactionDetailPage backHref={ROUTES.manager.transactions} />
}
