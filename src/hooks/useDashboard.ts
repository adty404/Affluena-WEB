import { useQuery } from '@tanstack/react-query'
import {
  getDashboardSummary,
  getCashflowTrend,
  getExpenseDistribution,
  getForecast,
} from '../api/dashboard'
import { queryKeys } from '../lib/queryClient'
import { currentMonth } from '../lib/reporting'

export function useDashboardSummary(month?: string) {
  const resolvedMonth = month || currentMonth()
  return useQuery({
    queryKey: queryKeys.dashboard.summary(resolvedMonth),
    queryFn: () => getDashboardSummary(resolvedMonth),
  })
}

export function useCashflowTrend(months: number = 12) {
  return useQuery({
    queryKey: queryKeys.dashboard.cashflowTrend(months),
    queryFn: () => getCashflowTrend(String(months)),
  })
}

export function useExpenseDistribution(month?: string) {
  const resolvedMonth = month || currentMonth()
  return useQuery({
    queryKey: queryKeys.dashboard.expenseDistribution(resolvedMonth),
    queryFn: () => getExpenseDistribution(resolvedMonth),
  })
}

export function useForecast(month?: string) {
  const resolvedMonth = month || currentMonth()
  return useQuery({
    queryKey: queryKeys.dashboard.forecast(resolvedMonth),
    queryFn: () => getForecast(resolvedMonth),
  })
}
