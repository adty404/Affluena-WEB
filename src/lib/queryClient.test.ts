import { describe, it, expect } from 'vitest'
import { QueryClient } from '@tanstack/react-query'
import { invalidateFinancialQueries, queryKeys } from './queryClient'

/**
 * A money mutation must mark reports (and wallets/transactions/dashboard/budgets)
 * stale so /reports pages don't keep showing old numbers. `queryKeys.reports`
 * has no `.all`, so the fix invalidates by the literal `['reports']` prefix.
 */
describe('invalidateFinancialQueries', () => {
  function seed() {
    const client = new QueryClient()
    // Seed fresh (non-stale) cache entries across the financial domains.
    client.setQueryData(queryKeys.wallets.all, [])
    client.setQueryData(queryKeys.transactions.all, [])
    client.setQueryData(queryKeys.dashboard.summary('2026-07'), {})
    client.setQueryData(queryKeys.budgets.list('2026-07'), [])
    client.setQueryData(queryKeys.reports.overview('2026-07'), {})
    client.setQueryData(queryKeys.reports.goal('2026-07'), {})
    return client
  }

  it('invalidates every reports query by prefix', () => {
    const client = seed()
    invalidateFinancialQueries(client)

    const overview = client.getQueryState(queryKeys.reports.overview('2026-07'))
    const goal = client.getQueryState(queryKeys.reports.goal('2026-07'))
    expect(overview?.isInvalidated).toBe(true)
    expect(goal?.isInvalidated).toBe(true)
  })

  it('still invalidates wallets, transactions, dashboard, and budgets', () => {
    const client = seed()
    invalidateFinancialQueries(client)

    expect(client.getQueryState(queryKeys.wallets.all)?.isInvalidated).toBe(true)
    expect(client.getQueryState(queryKeys.transactions.all)?.isInvalidated).toBe(true)
    expect(client.getQueryState(queryKeys.dashboard.summary('2026-07'))?.isInvalidated).toBe(true)
    expect(client.getQueryState(queryKeys.budgets.list('2026-07'))?.isInvalidated).toBe(true)
  })
})
