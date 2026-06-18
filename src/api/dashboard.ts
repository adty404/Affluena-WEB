import { apiFetch } from './client'
import type {
  DashboardSummary,
  CashflowTrendResponse,
  ExpenseDistributionResponse,
  DashboardForecast,
} from '../types/dashboard'

export function getDashboardSummary(month?: string) {
  return apiFetch<DashboardSummary>('/api/v1/dashboard/summary', {
    method: 'GET',
    query: month ? { month } : undefined,
  })
}

export function getCashflowTrend(months?: string) {
  return apiFetch<CashflowTrendResponse>('/api/v1/dashboard/cashflow-trend', {
    method: 'GET',
    query: months ? { months } : undefined,
  })
}

export function getExpenseDistribution(month?: string) {
  return apiFetch<ExpenseDistributionResponse>('/api/v1/dashboard/expense-distribution', {
    method: 'GET',
    query: month ? { month } : undefined,
  })
}

export function getForecast(month?: string) {
  return apiFetch<DashboardForecast>('/api/v1/dashboard/forecast', {
    method: 'GET',
    query: month ? { month } : undefined,
  })
}
