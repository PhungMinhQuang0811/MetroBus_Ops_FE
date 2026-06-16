"use client"

import { TransactionsPage } from "@/components/transactions/transactions-page"
import { ROUTES } from "@/lib/routes"

export default function StationTransactionsPage() {
  return <TransactionsPage detailBasePath={ROUTES.station.transactions} stationScoped />
}
