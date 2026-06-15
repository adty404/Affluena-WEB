import type { CashflowPoint, DashboardStat, DashboardTransaction, ExpenseSlice, ForecastItem } from '../types/dashboard';

export const dashboardStats: DashboardStat[] = [
  { label: 'Net Worth', value: 'Rp 68.450.000', note: '+8.2% vs last month', tone: 'green' },
  { label: 'Monthly Income', value: 'Rp 14.200.000', note: '3 income sources', tone: 'blue' },
  { label: 'Monthly Expense', value: 'Rp 8.760.000', note: '61.7% of income', tone: 'orange' },
  { label: 'Savings Rate', value: '38.3%', note: 'Healthy range', tone: 'purple' },
];

export const cashflowPoints: CashflowPoint[] = [
  { label: 'Jan', income: 12.8, expense: 7.4 },
  { label: 'Feb', income: 13.1, expense: 8.0 },
  { label: 'Mar', income: 13.7, expense: 7.8 },
  { label: 'Apr', income: 14.2, expense: 8.5 },
  { label: 'May', income: 14.0, expense: 8.2 },
  { label: 'Jun', income: 14.2, expense: 8.76 },
];

export const expenseSlices: ExpenseSlice[] = [
  { label: 'Food & Drink', amount: 'Rp 2.180.000', percent: 25, tone: 'green' },
  { label: 'Transportation', amount: 'Rp 1.420.000', percent: 16, tone: 'blue' },
  { label: 'Bills', amount: 'Rp 1.880.000', percent: 21, tone: 'orange' },
  { label: 'Shopping', amount: 'Rp 1.260.000', percent: 14, tone: 'purple' },
  { label: 'Others', amount: 'Rp 2.020.000', percent: 24, tone: 'gray' },
];

export const recentTransactions: DashboardTransaction[] = [
  { id: 'tx-001', title: 'Salary June', category: 'Salary', wallet: 'Bank BCA', amount: '+Rp 12.500.000', type: 'income', date: '14 Jun 2026' },
  { id: 'tx-002', title: 'Grocery Shopping', category: 'Food & Drink', wallet: 'Cash Wallet', amount: '-Rp 350.000', type: 'expense', date: '13 Jun 2026' },
  { id: 'tx-003', title: 'LRT Commute', category: 'Transportation', wallet: 'OVO', amount: '-Rp 40.000', type: 'expense', date: '13 Jun 2026' },
  { id: 'tx-004', title: 'Freelance Payment', category: 'Side Income', wallet: 'Bank BCA', amount: '+Rp 1.700.000', type: 'income', date: '12 Jun 2026' },
];

export const forecastItems: ForecastItem[] = [
  { title: 'Projected Month-End Balance', value: 'Rp 72.900.000', note: '+Rp 4.450.000 expected', tone: 'green' },
  { title: 'Budget Risk', value: '2 categories', note: 'Food and transportation near 80%', tone: 'orange' },
  { title: 'Upcoming Due', value: 'Rp 3.184.000', note: 'Installments and subscriptions', tone: 'red' },
  { title: 'Safe To Spend', value: 'Rp 2.050.000', note: 'Until 30 Jun 2026', tone: 'blue' },
];

export const walletPortfolio = [
  { name: 'Bank BCA', value: 'Rp 42.800.000', percent: 62 },
  { name: 'Cash Wallet', value: 'Rp 2.150.000', percent: 3 },
  { name: 'E-Wallets', value: 'Rp 3.500.000', percent: 5 },
  { name: 'Investments', value: 'Rp 20.000.000', percent: 30 },
];

export const widgetStates = [
  { title: 'Loading State', icon: '⏳', description: 'Use skeleton cards when dashboard data is being fetched.' },
  { title: 'Empty State', icon: '📭', description: 'Guide users to create wallet, category, or first transaction.' },
  { title: 'Error State', icon: '⚠️', description: 'Show retry action and avoid losing the full page layout.' },
  { title: 'Success State', icon: '✅', description: 'Use toast and subtle confirmation after finance actions.' },
];
