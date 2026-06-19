import type { Activity, AlertMessage, ExportJob, ReportMetric, ReportRow, SystemLog } from '../types/reporting';

export const reportMetrics: ReportMetric[] = [
  { id: 'net-cashflow', label: 'Net Cashflow', value: 4825000, helper: '+18.4% vs last month', tone: 'green' },
  { id: 'expense-total', label: 'Total Expense', value: 7420000, helper: '72% of planned monthly spend', tone: 'orange' },
  { id: 'income-total', label: 'Total Income', value: 12245000, helper: 'Salary + freelance income', tone: 'blue' },
  { id: 'saving-rate', label: 'Saving Rate', value: 4825000, helper: '39.4% monthly saving value', tone: 'purple' },
];

export const cashflowRows: ReportRow[] = [
  { id: 'cash-1', name: 'Week 1 Cashflow', category: 'Weekly summary', amount: 1120000, previousAmount: 820000, changePercent: 36.5, wallet: 'All wallets', status: 'growth' },
  { id: 'cash-2', name: 'Week 2 Cashflow', category: 'Weekly summary', amount: 980000, previousAmount: 1040000, changePercent: -5.8, wallet: 'All wallets', status: 'healthy' },
  { id: 'cash-3', name: 'Week 3 Cashflow', category: 'Weekly summary', amount: 1515000, previousAmount: 940000, changePercent: 61.2, wallet: 'All wallets', status: 'growth' },
  { id: 'cash-4', name: 'Week 4 Forecast', category: 'Forecast', amount: 1210000, previousAmount: 1020000, changePercent: 18.6, wallet: 'All wallets', status: 'watch' },
];

export const expenseRows: ReportRow[] = [
  { id: 'expense-food', name: 'Food & Drink', category: 'Expense category', amount: 1798000, previousAmount: 1645000, changePercent: 9.3, wallet: 'Cash Wallet, OVO', status: 'watch' },
  { id: 'expense-transport', name: 'Transportation', category: 'Expense category', amount: 1284000, previousAmount: 980000, changePercent: 31.0, wallet: 'Bank BCA', status: 'critical' },
  { id: 'expense-bills', name: 'Bills & Utilities', category: 'Expense category', amount: 849000, previousAmount: 860000, changePercent: -1.3, wallet: 'Bank BCA', status: 'healthy' },
  { id: 'expense-shopping', name: 'Shopping', category: 'Expense category', amount: 1248000, previousAmount: 900000, changePercent: 38.7, wallet: 'E-Wallet', status: 'critical' },
];

export const incomeRows: ReportRow[] = [
  { id: 'income-salary', name: 'Monthly Salary', category: 'Income category', amount: 10500000, previousAmount: 10500000, changePercent: 0, wallet: 'Bank BCA', status: 'healthy' },
  { id: 'income-freelance', name: 'Freelance Project', category: 'Income category', amount: 1250000, previousAmount: 500000, changePercent: 150, wallet: 'Bank BCA', status: 'growth' },
  { id: 'income-interest', name: 'Saving Interest', category: 'Income category', amount: 95000, previousAmount: 82000, changePercent: 15.9, wallet: 'Investment Wallet', status: 'growth' },
  { id: 'income-receivable', name: 'Receivable Collection', category: 'Debt collection', amount: 400000, previousAmount: 0, changePercent: 100, wallet: 'Cash Wallet', status: 'growth' },
];

export const budgetReportRows: ReportRow[] = [
  { id: 'budget-food', name: 'Food & Drink Budget', category: 'Budget', amount: 1798000, previousAmount: 2500000, changePercent: 72, wallet: 'All wallets', status: 'healthy' },
  { id: 'budget-transport', name: 'Transportation Budget', category: 'Budget', amount: 1284000, previousAmount: 1500000, changePercent: 86, wallet: 'All wallets', status: 'watch' },
  { id: 'budget-shopping', name: 'Shopping Budget', category: 'Budget', amount: 1248000, previousAmount: 1200000, changePercent: 104, wallet: 'All wallets', status: 'critical' },
];

export const debtReportRows: ReportRow[] = [
  { id: 'debt-kta', name: 'KTA Bank Installment', category: 'Payable', amount: 6500000, previousAmount: 10000000, changePercent: 35, wallet: 'Bank BCA', status: 'watch' },
  { id: 'debt-split', name: 'Dinner Split Bill', category: 'Receivable', amount: 780000, previousAmount: 780000, changePercent: 0, wallet: 'Cash Wallet', status: 'watch' },
  { id: 'debt-loan', name: 'Loan to Friend', category: 'Receivable', amount: 450000, previousAmount: 900000, changePercent: 50, wallet: 'Cash Wallet', status: 'critical' },
];

export const goalReportRows: ReportRow[] = [
  { id: 'goal-emergency', name: 'Emergency Fund', category: 'Private goal', amount: 18500000, previousAmount: 50000000, changePercent: 37, wallet: 'Goal Wallet', status: 'healthy' },
  { id: 'goal-vacation', name: 'Japan Vacation', category: 'Shared goal', amount: 12200000, previousAmount: 30000000, changePercent: 41, wallet: 'Vacation Wallet', status: 'watch' },
  { id: 'goal-laptop', name: 'Work Laptop Upgrade', category: 'Private goal', amount: 9800000, previousAmount: 15000000, changePercent: 65, wallet: 'Investment Wallet', status: 'growth' },
];

export const exportJobs: ExportJob[] = [
  { id: 'export-cashflow-jun', name: 'Cashflow Report June 2026', module: 'Reports', period: 'Jun 2026', format: 'CSV', status: 'ready', rows: 128, requestedAt: '14 Jun 2026 · 10:12', size: '54 KB' },
  { id: 'export-transactions-q2', name: 'Transactions Q2 2026', module: 'Transactions', period: 'Q2 2026', format: 'CSV', status: 'ready', rows: 842, requestedAt: '13 Jun 2026 · 18:45', size: '210 KB' },
  { id: 'export-budget-audit', name: 'Budget Audit June 2026', module: 'Budget', period: 'Jun 2026', format: 'XLSX', status: 'processing', rows: 56, requestedAt: '14 Jun 2026 · 14:20', size: 'Preparing' },
  { id: 'export-goals-2026', name: 'Goals Contribution 2026', module: 'Goals', period: '2026', format: 'CSV', status: 'ready', rows: 72, requestedAt: '12 Jun 2026 · 09:04', size: '31 KB' },
];

export const activityEvents: Activity[] = [
  { id: 'act-1001', user_id: 'Aditya Prasetyo', action_type: 'created transaction', entity_type: 'Transactions', entity_id: 'tx-1', description: 'Expense Team Dinner Split Bill posted from Bank BCA.', created_at: '2026-06-14T15:34:00Z' },
  { id: 'act-1002', user_id: 'Aditya Prasetyo', action_type: 'recorded payment', entity_type: 'Debt', entity_id: 'debt-1', description: 'Payment Rp 1.500.000 recorded for KTA Bank Installment.', created_at: '2026-06-14T13:12:00Z' },
  { id: 'act-1003', user_id: 'Scheduler', action_type: 'ran recurring rule', entity_type: 'RECURRING', entity_id: 'rec-1', description: 'Monthly Salary rule executed and created income transaction.', created_at: '2026-06-14T08:00:00Z' },
  { id: 'act-1004', user_id: 'Budget Engine', action_type: 'created alert', entity_type: 'BUDGET', entity_id: 'bud-1', description: 'Shopping budget exceeded 100% threshold.', created_at: '2026-06-13T20:48:00Z' },
  { id: 'act-1005', user_id: 'Aditya Prasetyo', action_type: 'invited member', entity_type: 'Goals', entity_id: 'goal-1', description: 'Nadia invited as contributor to Japan Vacation goal.', created_at: '2026-06-13T16:05:00Z' },
];

export const alertMessages: AlertMessage[] = [
  { id: 'alert-budget-shopping', type: 'budget', title: 'Shopping budget exceeded', module: 'Budget', description: 'Usage reached 104% of monthly limit. Review spending or adjust the budget.', created_at: '13 Jun 2026 · 20:48', severity: 'danger', action_path: '/budgets/alerts' },
  { id: 'alert-debt-overdue', type: 'debt', title: 'Loan to Friend overdue', module: 'Debt', description: 'Receivable is 2 days overdue. Send reminder or record collection.', created_at: '14 Jun 2026 · 09:00', severity: 'warning', action_path: '/debts/debt-loan' },
  { id: 'alert-recurring-success', type: 'recurring', title: 'Monthly Salary executed', module: 'Recurring', description: 'Recurring income rule created a transaction successfully.', created_at: '14 Jun 2026 · 08:00', severity: 'success', action_path: '/recurring/rec-salary/history' },
  { id: 'alert-export-ready', type: 'recurring', title: 'Cashflow export ready', module: 'Export', description: 'Cashflow Report June 2026 is ready to download.', created_at: '14 Jun 2026 · 10:13', severity: 'info', action_path: '/exports/export-cashflow-jun' },
];

export const systemLogs: SystemLog[] = [
  { id: 'log-9001', path: '/api/v1/transactions', method: 'POST', status_code: 201, latency_ms: 124, user_id: 'adty404@gmail.com', created_at: '2026-06-14T15:34:20Z', client_ip: '127.0.0.1', user_agent: 'Mozilla', request_payload: null, response_payload: null },
  { id: 'log-9002', path: '/api/v1/debts/debt-kta/payments', method: 'POST', status_code: 201, latency_ms: 142, user_id: 'adty404@gmail.com', created_at: '2026-06-14T13:12:09Z', client_ip: '127.0.0.1', user_agent: 'Mozilla', request_payload: null, response_payload: null },
  { id: 'log-9003', path: '/api/v1/recurring-transactions/run', method: 'POST', status_code: 200, latency_ms: 210, user_id: 'scheduler', created_at: '2026-06-14T08:00:01Z', client_ip: '127.0.0.1', user_agent: 'Mozilla', request_payload: null, response_payload: null },
  { id: 'log-9004', path: '/api/v1/export/csv', method: 'POST', status_code: 202, latency_ms: 88, user_id: 'adty404@gmail.com', created_at: '2026-06-14T10:12:33Z', client_ip: '127.0.0.1', user_agent: 'Mozilla', request_payload: null, response_payload: null },
  { id: 'log-9005', path: '/api/v1/category-budgets/alerts', method: 'GET', status_code: 200, latency_ms: 65, user_id: 'adty404@gmail.com', created_at: '2026-06-13T20:48:03Z', client_ip: '127.0.0.1', user_agent: 'Mozilla', request_payload: null, response_payload: null },
];
