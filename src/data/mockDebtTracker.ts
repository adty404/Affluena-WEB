import type { Debt, Installment, Subscription } from '../types/debt';

export const mockDebts: Debt[] = [
  {
    id: 'debt-kta-bank',
    title: 'KTA Bank Installment',
    type: 'payable',
    counterparty: 'Bank ABC',
    originalAmount: 10000000,
    paidAmount: 3500000,
    remainingAmount: 6500000,
    dueDate: '2026-06-20',
    status: 'due_soon',
    walletName: 'Bank BCA',
    note: 'Personal loan payable with monthly repayment tracking.',
    payments: [
      { id: 'pay-001', date: '2026-06-01', walletName: 'Bank BCA', amount: 2000000, transactionId: 'TX-20260601-001', note: 'Initial repayment' },
      { id: 'pay-002', date: '2026-06-10', walletName: 'Bank BCA', amount: 1500000, transactionId: 'TX-20260610-019', note: 'Second repayment' },
    ],
  },
  {
    id: 'debt-dinner-split',
    title: 'Dinner Split Bill',
    type: 'receivable',
    counterparty: 'Team Dinner',
    originalAmount: 960000,
    paidAmount: 180000,
    remainingAmount: 780000,
    dueDate: '2026-06-18',
    status: 'due_soon',
    walletName: 'Bank BCA',
    note: 'Receivable generated from split bill flow.',
    payments: [
      { id: 'pay-003', date: '2026-06-12', walletName: 'Bank BCA', amount: 180000, transactionId: 'TX-20260612-044', note: 'Ari paid his part' },
    ],
  },
  {
    id: 'debt-friend-loan',
    title: 'Loan to Friend',
    type: 'receivable',
    counterparty: 'Raka',
    originalAmount: 900000,
    paidAmount: 450000,
    remainingAmount: 450000,
    dueDate: '2026-06-12',
    status: 'overdue',
    walletName: 'Cash Wallet',
    note: 'Personal receivable, reminder required.',
    payments: [
      { id: 'pay-004', date: '2026-05-30', walletName: 'Cash Wallet', amount: 450000, transactionId: 'TX-20260530-008', note: 'Partial collection' },
    ],
  },
];

export const mockInstallments: Installment[] = [
  { id: 'inst-car', name: 'Car Installment', walletName: 'Bank BCA', categoryName: 'Vehicle', monthlyAmount: 3200000, totalTenor: 36, paidCount: 15, remainingPrincipal: 41600000, nextDueDate: '2026-06-20', status: 'due_soon', reminderRule: 'H-3, H-1, due date' },
  { id: 'inst-laptop', name: 'Laptop Installment', walletName: 'Bank BCA', categoryName: 'Electronics', monthlyAmount: 850000, totalTenor: 12, paidCount: 8, remainingPrincipal: 3400000, nextDueDate: '2026-06-25', status: 'active', reminderRule: 'H-3, H-1, due date' },
  { id: 'inst-phone', name: 'Phone Installment', walletName: 'E-Wallet Dana', categoryName: 'Electronics', monthlyAmount: 620000, totalTenor: 10, paidCount: 9, remainingPrincipal: 620000, nextDueDate: '2026-06-28', status: 'final_month', reminderRule: 'H-3, H-1, due date' },
];

export const mockSubscriptions: Subscription[] = [
  { id: 'sub-netflix', name: 'Netflix', categoryName: 'Entertainment', walletName: 'Jenius', amount: 186000, cycle: 'monthly', nextRenewalDate: '2026-06-19', status: 'due_soon', reminderRule: 'H-3, H-1, renewal day' },
  { id: 'sub-ai-tools', name: 'AI Tools', categoryName: 'Productivity', walletName: 'Bank BCA', amount: 320000, cycle: 'monthly', nextRenewalDate: '2026-06-22', status: 'active', reminderRule: 'H-3, H-1, renewal day' },
  { id: 'sub-cloud', name: 'Cloud Storage', categoryName: 'Storage', walletName: 'Bank BCA', amount: 799000, cycle: 'yearly', nextRenewalDate: '2026-06-25', status: 'active', reminderRule: 'H-7, H-3, renewal day' },
];

export const debtSummary = {
  totalPayable: mockDebts.filter((debt) => debt.type === 'payable').reduce((sum, debt) => sum + debt.remainingAmount, 0),
  totalReceivable: mockDebts.filter((debt) => debt.type === 'receivable').reduce((sum, debt) => sum + debt.remainingAmount, 0),
  paidThisMonth: mockDebts.flatMap((debt) => debt.payments).reduce((sum, payment) => sum + payment.amount, 0),
  dueSoon: mockDebts.filter((debt) => debt.status === 'due_soon').length + mockInstallments.filter((item) => item.status === 'due_soon').length + mockSubscriptions.filter((item) => item.status === 'due_soon').length,
  overdue: mockDebts.filter((debt) => debt.status === 'overdue').length,
};
