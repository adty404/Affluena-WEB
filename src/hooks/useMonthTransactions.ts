import { useQuery } from '@tanstack/react-query'
import { listTransactions } from '../api/transactions'
import type { Transaction } from '../types/transaction'

const PAGE_SIZE = 200
const MAX_TRANSACTIONS = 5000

function isoDate(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}T00:00:00Z`
}

/**
 * Fetches every transaction whose `transaction_at` falls in the given month
 * (default: current), paging through the list endpoint client-side. Mirrors
 * mobile's `currentMonthCategoryBreakdownProvider`: the query window is widened
 * a day on each edge (the `from`/`to` params are date-typed while bucketing is
 * by local day) and out-of-month rows are dropped by the caller.
 */
export function useMonthTransactions(reference: Date = new Date()) {
  const year = reference.getFullYear()
  const month = reference.getMonth() // 0-based
  const from = new Date(year, month, 1)
  from.setDate(from.getDate() - 1)
  const to = new Date(year, month + 1, 2)
  const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`

  return useQuery({
    queryKey: ['transactions', 'month', monthKey],
    queryFn: async () => {
      const all: Transaction[] = []
      let offset = 0
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const page = await listTransactions({
          from: isoDate(from),
          to: isoDate(to),
          limit: PAGE_SIZE,
          offset,
          sort: 'transaction_at_desc',
        })
        all.push(...page.transactions)
        offset += page.transactions.length
        if (
          page.transactions.length === 0 ||
          offset >= page.pagination.total ||
          offset >= MAX_TRANSACTIONS
        ) {
          break
        }
      }
      // Keep only rows that land in the reference month (local day).
      return all.filter((tx) => {
        const day = new Date(tx.transaction_at)
        return day.getFullYear() === year && day.getMonth() === month
      })
    },
  })
}
