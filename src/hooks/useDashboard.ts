import { useQuery } from '@tanstack/react-query'
import {
  getDashboardSummary,
  getCashflowTrend,
  getExpenseDistribution,
  getForecast,
} from '../api/dashboard'
import { queryKeys } from '../lib/queryClient'

export function useDashboardSummary(month?: string) {
  const currentMonth = month || new Date().toISOString().slice(0, 7)
  return useQuery({
    queryKey: queryKeys.dashboard.summary(currentMonth),
    queryFn: () => getDashboardSummary(currentMonth),
  })
}

export function useCashflowTrend(months: number = 12) {
  return useQuery({
    queryKey: queryKeys.dashboard.cashflowTrend(months),
    queryFn: () => getCashflowTrend(`1-${months}`),
  })
}

export function useExpenseDistribution(month?: string) {
  const currentMonth = month || new Date().toISOString().slice(0, 7)
  return useQuery({
    queryKey: queryKeys.dashboard.expenseDistribution(currentMonth),
    queryFn: () => getExpenseDistribution(currentMonth),
  })
}

export function useForecast(month?: string) {
  const currentMonth = month || new Date().toISOString().slice(0, 7)
  return useQuery({
    queryKey: queryKeys.dashboard.forecast(currentMonth),
    queryFn: () => getForecast(currentMonth),
  })
}
