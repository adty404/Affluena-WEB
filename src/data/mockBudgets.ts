import type { BudgetSummary, BudgetAlert, BudgetReportItem } from '../types/budget';
import { mockTransactions } from './mockTransactions';

export const mockBudgets: BudgetSummary[] = [
  {
    id: 'budget-food',
    user_id: 'user-1',
    category_id: '1', // Food & Drink
    month: '2026-06',
    limit_minor: 2500000,
    spent_minor: 1798000,
    remaining_minor: 702000,
    usage_percent: 72,
    created_at: '2026-06-01T00:00:00Z',
    updated_at: '2026-06-01T00:00:00Z',
  },
  {
    id: 'budget-transport',
    user_id: 'user-1',
    category_id: '2', // Transportation
    month: '2026-06',
    limit_minor: 1500000,
    spent_minor: 1284000,
    remaining_minor: 216000,
    usage_percent: 86,
    created_at: '2026-06-01T00:00:00Z',
    updated_at: '2026-06-01T00:00:00Z',
  },
  {
    id: 'budget-shopping',
    user_id: 'user-1',
    category_id: '3', // Shopping
    month: '2026-06',
    limit_minor: 1200000,
    spent_minor: 1248000,
    remaining_minor: -48000,
    usage_percent: 104,
    created_at: '2026-06-01T00:00:00Z',
    updated_at: '2026-06-01T00:00:00Z',
  },
  {
    id: 'budget-bills',
    user_id: 'user-1',
    category_id: '4', // Bills & Utilities
    month: '2026-06',
    limit_minor: 1000000,
    spent_minor: 849000,
    remaining_minor: 151000,
    usage_percent: 85,
    created_at: '2026-06-01T00:00:00Z',
    updated_at: '2026-06-01T00:00:00Z',
  },
];

export const mockBudgetAlerts: BudgetAlert[] = [
  {
    id: 'alert-shopping-exceeded',
    budgetId: 'budget-shopping',
    categoryName: 'Shopping',
    title: 'Shopping budget exceeded',
    message: 'Usage reached 104%. Limit Rp 1.200.000, actual Rp 1.248.000.',
    threshold: 100,
    status: 'unread',
    severity: 'danger',
    createdAt: '14 Jun 2026, 10:15',
  },
  {
    id: 'alert-transport-warning',
    budgetId: 'budget-transport',
    categoryName: 'Transportation',
    title: 'Transportation budget warning',
    message: 'Usage reached 86%. Remaining budget is Rp 216.000.',
    threshold: 80,
    status: 'unread',
    severity: 'warning',
    createdAt: '14 Jun 2026, 09:42',
  },
  {
    id: 'alert-bills-warning',
    budgetId: 'budget-bills',
    categoryName: 'Bills & Utilities',
    title: 'Bills & Utilities warning',
    message: 'Usage reached 84%. You are close to the monthly limit.',
    threshold: 80,
    status: 'read',
    severity: 'warning',
    createdAt: '13 Jun 2026, 18:22',
  },
];

export const mockBudgetReport: BudgetReportItem[] = mockBudgets.map((budget) => {
  const remaining = budget.remaining_minor;
  const daysLeft = 8;
  const status = budget.usage_percent >= 100 ? 'exceeded' : budget.usage_percent >= 80 ? 'warning' : 'safe';
  return {
    ...budget,
    variance: remaining,
    dailyAllowance: Math.max(0, Math.floor(remaining / daysLeft)),
    recommendation: status === 'safe'
      ? 'Budget is still controlled. Keep daily spending under the remaining allowance.'
      : status === 'warning'
        ? 'Slow down spending and review upcoming transactions before the period ends.'
        : 'Pause non-essential spending and consider increasing the budget only after review.',
  };
});

export const mockBudgetTransactions = mockTransactions.filter((transaction) => transaction.category_id === '1');

export const budgetSummary = {
  totalLimit: mockBudgets.reduce((sum, budget) => sum + budget.limit_minor, 0),
  totalActual: mockBudgets.reduce((sum, budget) => sum + budget.spent_minor, 0),
  totalForecast: mockBudgets.reduce((sum, budget) => sum + budget.spent_minor * 1.2, 0), // Mock forecast
  activeCount: mockBudgets.length,
  safeCount: mockBudgets.filter((budget) => budget.usage_percent < 80).length,
  warningCount: mockBudgets.filter((budget) => budget.usage_percent >= 80 && budget.usage_percent < 100).length,
  exceededCount: mockBudgets.filter((budget) => budget.usage_percent >= 100).length,
};
