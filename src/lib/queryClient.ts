import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        const status = (error as { status?: number })?.status
        if (status && status >= 400 && status < 500 && status !== 401) return false
        return failureCount < 2
      },
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
    mutations: {
      retry: false,
    },
  },
})

export const queryKeys = {
  me: ['auth', 'me'] as const,
  sessions: ['auth', 'sessions'] as const,
  wallets: {
    all: ['wallets'] as const,
    list: (params?: Record<string, unknown>) => ['wallets', 'list', params ?? {}] as const,
    detail: (id: string) => ['wallets', 'detail', id] as const,
  },
  categories: {
    all: ['categories'] as const,
    list: (type?: 'income' | 'expense') => ['categories', 'list', type ?? 'all'] as const,
    detail: (id: string) => ['categories', 'detail', id] as const,
  },
  tags: {
    all: ['tags'] as const,
    list: (params?: Record<string, unknown>) => ['tags', 'list', params ?? {}] as const,
    detail: (id: string) => ['tags', 'detail', id] as const,
  },
  transactions: {
    all: ['transactions'] as const,
    list: (filters?: Record<string, unknown>) => ['transactions', 'list', filters ?? {}] as const,
    detail: (id: string) => ['transactions', 'detail', id] as const,
  },
  dashboard: {
    all: ['dashboard'] as const,
    summary: (month: string) => ['dashboard', 'summary', month] as const,
    cashflowTrend: (months: number) => ['dashboard', 'cashflow-trend', months] as const,
    expenseDistribution: (month: string) => ['dashboard', 'expense-distribution', month] as const,
    forecast: (month: string) => ['dashboard', 'forecast', month] as const,
  },
  quickEntries: {
    all: ['quick-entries'] as const,
    list: (params?: Record<string, unknown>) => ['quick-entries', 'list', params ?? {}] as const,
    detail: (id: string) => ['quick-entries', 'detail', id] as const,
  },
  budgets: {
    all: ['budgets'] as const,
    list: (month?: string) => ['budgets', 'list', month ?? 'current'] as const,
    detail: (id: string) => ['budgets', 'detail', id] as const,
    alerts: (month?: string) => ['budgets', 'alerts', month ?? 'current'] as const,
    report: (month?: string) => ['budgets', 'report', month ?? 'current'] as const,
  },
  debts: {
    all: ['debts'] as const,
    list: (params?: Record<string, unknown>) => ['debts', 'list', params ?? {}] as const,
    detail: (id: string) => ['debts', 'detail', id] as const,
  },
  installments: {
    all: ['installments'] as const,
    list: (params?: Record<string, unknown>) => ['installments', 'list', params ?? {}] as const,
    detail: (id: string) => ['installments', 'detail', id] as const,
  },
  subscriptions: {
    all: ['subscriptions'] as const,
    list: (params?: Record<string, unknown>) => ['subscriptions', 'list', params ?? {}] as const,
    detail: (id: string) => ['subscriptions', 'detail', id] as const,
  },
  recurring: {
    all: ['recurring'] as const,
    list: (params?: Record<string, unknown>) => ['recurring', 'list', params ?? {}] as const,
    detail: (id: string) => ['recurring', 'detail', id] as const,
  },
  goals: {
    all: ['goals'] as const,
    detail: (id: string) => ['goals', 'detail', id] as const,
  },
  partners: {
    all: ['partners'] as const,
  },
  activities: {
    list: (params?: Record<string, unknown>) => ['activities', 'list', params ?? {}] as const,
    detail: (id: string) => ['activities', 'detail', id] as const,
  },
  systemLogs: {
    list: (limit?: number) => ['systemLogs', 'list', limit] as const,
    detail: (id: string) => ['systemLogs', 'detail', id] as const,
  },
  alerts: {
    list: (month?: string) => ['alerts', 'list', month ?? 'current'] as const,
    detail: (id: string) => ['alerts', 'detail', id] as const,
  },
  exportJobs: {
    list: (limit?: number, offset?: number) => ['exportJobs', 'list', limit, offset] as const,
    detail: (id: string) => ['exportJobs', 'detail', id] as const,
  },
  reports: {
    income: (month: string) => ['reports', 'income', month] as const,
    expense: (month: string) => ['reports', 'expense', month] as const,
    cashflow: (month: string) => ['reports', 'cashflow', month] as const,
    debt: (month: string) => ['reports', 'debt', month] as const,
    goal: (month: string) => ['reports', 'goal', month] as const,
    overview: (month: string) => ['reports', 'overview', month] as const,
  },
  notifications: {
    rules: ['notifications', 'rules'] as const,
  },
}

/// Invalidate every query whose data depends on wallet balances or the
/// transaction ledger. Call this in the `onSuccess` of ANY mutation that moves
/// money — create/edit/delete a transaction, split a bill, execute a quick
/// entry, pay a debt/installment/subscription, run a recurring rule, contribute
/// to a goal — so wallet balances, the dashboard, and budgets do not show stale
/// numbers after the server has already updated them. Pass the client from
/// `useQueryClient()` (prefix-matching covers every sub-key).
export function invalidateFinancialQueries(client: QueryClient) {
  client.invalidateQueries({ queryKey: queryKeys.wallets.all })
  client.invalidateQueries({ queryKey: queryKeys.transactions.all })
  client.invalidateQueries({ queryKey: queryKeys.dashboard.all })
  client.invalidateQueries({ queryKey: queryKeys.budgets.all })
  // `queryKeys.reports` has no `.all` — match every report by its literal
  // prefix so /reports pages don't show stale money after a mutation.
  client.invalidateQueries({ queryKey: ['reports'] })
}
