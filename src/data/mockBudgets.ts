import type { Budget, BudgetAlert, BudgetReportItem } from '../types/budget';
import { mockTransactions } from './mockTransactions';

export const mockBudgets: Budget[] = [
  {
    id: 'budget-food',
    categoryId: 'food',
    categoryName: 'Food & Drink',
    categoryIcon: 'food',
    period: 'June 2026',
    periodType: 'monthly',
    limit: 2500000,
    actual: 1798000,
    forecast: 2420000,
    warningThreshold: 80,
    exceededThreshold: 100,
    status: 'safe',
    note: 'Meals, groceries, coffee, and food delivery for this month.',
  },
  {
    id: 'budget-transport',
    categoryId: 'transport',
    categoryName: 'Transportation',
    categoryIcon: 'transport',
    period: 'June 2026',
    periodType: 'monthly',
    limit: 1500000,
    actual: 1284000,
    forecast: 1680000,
    warningThreshold: 80,
    exceededThreshold: 100,
    status: 'warning',
    note: 'Office commute, ride hailing, parking, and LRT spending.',
  },
  {
    id: 'budget-shopping',
    categoryId: 'shopping',
    categoryName: 'Shopping',
    categoryIcon: 'shopping',
    period: 'June 2026',
    periodType: 'monthly',
    limit: 1200000,
    actual: 1248000,
    forecast: 1690000,
    warningThreshold: 80,
    exceededThreshold: 100,
    status: 'exceeded',
    note: 'Personal shopping and non-essential purchases.',
  },
  {
    id: 'budget-bills',
    categoryId: 'bills',
    categoryName: 'Bills & Utilities',
    categoryIcon: 'bills',
    period: 'June 2026',
    periodType: 'monthly',
    limit: 1000000,
    actual: 849000,
    forecast: 990000,
    warningThreshold: 80,
    exceededThreshold: 100,
    status: 'warning',
    note: 'Electricity, internet, phone, and household utility bills.',
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
  const remaining = budget.limit - budget.actual;
  const daysLeft = 8;
  return {
    ...budget,
    variance: remaining,
    dailyAllowance: Math.max(0, Math.floor(remaining / daysLeft)),
    recommendation: budget.status === 'safe'
      ? 'Budget is still controlled. Keep daily spending under the remaining allowance.'
      : budget.status === 'warning'
        ? 'Slow down spending and review upcoming transactions before the period ends.'
        : 'Pause non-essential spending and consider increasing the budget only after review.',
  };
});

export const mockBudgetTransactions = mockTransactions.filter((transaction) => transaction.category_id === '1');

export const budgetSummary = {
  totalLimit: mockBudgets.reduce((sum, budget) => sum + budget.limit, 0),
  totalActual: mockBudgets.reduce((sum, budget) => sum + budget.actual, 0),
  totalForecast: mockBudgets.reduce((sum, budget) => sum + budget.forecast, 0),
  activeCount: mockBudgets.length,
  safeCount: mockBudgets.filter((budget) => budget.status === 'safe').length,
  warningCount: mockBudgets.filter((budget) => budget.status === 'warning').length,
  exceededCount: mockBudgets.filter((budget) => budget.status === 'exceeded').length,
};
