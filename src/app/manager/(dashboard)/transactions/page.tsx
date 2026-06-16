"use client"

import { TransactionsPage } from "@/components/transactions/transactions-page"
import { ROUTES } from "@/lib/routes"

export default function ManagerTransactionsPage() {
  return <TransactionsPage detailBasePath={ROUTES.manager.transactions} />
}
