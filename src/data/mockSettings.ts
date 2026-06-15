import type { AccountSession, FAQItem, LoginHistoryItem, NotificationRule } from '../types/settings';

export const sessions: AccountSession[] = [
  { id: 'sess-current', device: 'MacBook Pro', location: 'Jakarta, Indonesia', browser: 'Chrome', lastActive: 'Active now', status: 'current' },
  { id: 'sess-phone', device: 'iPhone 15', location: 'Bekasi, Indonesia', browser: 'Safari', lastActive: '2 hours ago', status: 'trusted' },
  { id: 'sess-office', device: 'Windows Desktop', location: 'Jakarta, Indonesia', browser: 'Edge', lastActive: 'Yesterday', status: 'trusted' },
];

export const loginHistory: LoginHistoryItem[] = [
  { id: 'login-1', time: '14 Jun 2026, 21:08', device: 'MacBook Pro · Chrome', location: 'Jakarta', status: 'success' },
  { id: 'login-2', time: '14 Jun 2026, 08:12', device: 'iPhone 15 · Safari', location: 'Bekasi', status: 'success' },
  { id: 'login-3', time: '13 Jun 2026, 23:41', device: 'Unknown Linux · Firefox', location: 'Singapore', status: 'blocked' },
  { id: 'login-4', time: '12 Jun 2026, 19:10', device: 'Windows Desktop · Edge', location: 'Jakarta', status: 'success' },
];

export const notificationRules: NotificationRule[] = [
  { id: 'budget-alert', title: 'Budget threshold alert', description: 'Notify when category budget reaches 80% and 100%.', enabled: true, channel: 'both', tone: 'orange' },
  { id: 'due-reminder', title: 'Due date reminder', description: 'Debt, installment, and subscription reminders at H-3 and H-1.', enabled: true, channel: 'both', tone: 'blue' },
  { id: 'recurring-run', title: 'Recurring run result', description: 'Notify when recurring transaction runs or fails.', enabled: true, channel: 'in-app', tone: 'green' },
  { id: 'security-alert', title: 'Security alert', description: 'Notify login from a new device or location.', enabled: true, channel: 'email', tone: 'red' },
  { id: 'weekly-summary', title: 'Weekly finance summary', description: 'Send a weekly cashflow, budget, and goal summary.', enabled: false, channel: 'email', tone: 'purple' },
];

export const faqItems: FAQItem[] = [
  { id: 'faq-balance', question: 'Why does wallet balance change automatically?', answer: 'Income increases the selected wallet, expense decreases it, transfer moves balance between wallets, and adjustment changes the balance manually with an audit trail.' },
  { id: 'faq-budget', question: 'How are budget alerts calculated?', answer: 'Budget usage is calculated from expense transactions by category and period. Alerts are generated at configured warning and exceeded thresholds.' },
  { id: 'faq-recurring', question: 'What happens when a recurring rule runs?', answer: 'A recurring rule creates a transaction using the configured wallet, category, amount, date rule, and tags. Each run is recorded in run history.' },
  { id: 'faq-export', question: 'Can I export personal finance data?', answer: 'Yes. Export Center can generate CSV files for transactions, wallets, budgets, debts, goals, activities, alerts, and system logs.' },
];
