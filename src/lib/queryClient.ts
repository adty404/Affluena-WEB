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
}
