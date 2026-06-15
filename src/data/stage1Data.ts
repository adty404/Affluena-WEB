import type { AppWidget, ModuleGroup } from '../types/finance';
import type { AppIconName } from '../components/ui/AppIcon';

export const featureCards: { icon: AppIconName; title: string; body: string }[] = [
  { icon: 'wallet', title: 'Wallet & Balance', body: 'Kelola cash, bank, e-wallet, investment, dan goal wallet dengan saldo yang jelas.' },
  { icon: 'analytics', title: 'Dashboard Analytics', body: 'Summary, cashflow trend, expense distribution, forecast, dan recent transaction.' },
  { icon: 'budgetAlert', title: 'Budget Alert', body: 'Peringatan saat budget mencapai 80% atau melewati 100% dari limit bulanan.' },
  { icon: 'quick', title: 'Quick Entry', body: 'Template transaksi instan untuk pengeluaran rutin seperti makan siang atau transport.' },
  { icon: 'split', title: 'Split Bill & Debt', body: 'Buat satu expense sekaligus piutang otomatis untuk teman atau keluarga.' },
  { icon: 'goal', title: 'Financial Goals', body: 'Buat target tabungan kolaboratif dengan invite member dan progress yang mudah dipantau.' },
];

export const modules: ModuleGroup[] = [
  {
    title: 'Foundation',
    description: 'Landing, login, register, forgot password, reset password, onboarding, app shell.',
    items: ['Responsive layout', 'Reusable component style', 'Desktop + mobile navigation'],
  },
  {
    title: 'Core Finance',
    description: 'Dashboard, wallet, category, tag, dan transaction sebagai flow utama user.',
    items: ['Summary cards', 'CRUD tables', 'Financial forms'],
  },
  {
    title: 'Planning & Automation',
    description: 'Budget, debt, tracker, recurring, goal, export, activity, dan alerts.',
    items: ['Progress states', 'Status badges', 'Timeline activity'],
  },
];

export const appWidgets: AppWidget[] = [
  { title: 'Total Balance', value: 'Rp 24.560.000', note: '+12.5% dari bulan lalu', tone: 'green' },
  { title: 'Income', value: 'Rp 12.750.000', note: 'June 2026', tone: 'blue' },
  { title: 'Expense', value: 'Rp 6.420.000', note: '61% dari budget', tone: 'orange' },
  { title: 'Health Score', value: '82/100', note: 'Good financial control', tone: 'purple' },
];

export const onboardingOptions = [
  { title: 'Personal Finance', body: 'Pantau wallet, budget, dan transaksi harian.' },
  { title: 'Family Finance', body: 'Kelola wallet bersama, split bill, dan goals keluarga.' },
  { title: 'Power User', body: 'Recurring, export CSV, tracker, debt, dan analytics.' },
];
