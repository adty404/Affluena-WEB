import type { Transaction } from '../types/transaction'

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    user_id: 'user-1',
    type: 'expense',
    wallet_id: '1',
    category_id: '1',
    amount_minor: 50000,
    tag_ids: ['1'],
    transaction_at: new Date().toISOString(),
    note: 'Lunch',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    user_id: 'user-1',
    type: 'income',
    wallet_id: '1',
    category_id: '2',
    amount_minor: 10000000,
    tag_ids: [],
    transaction_at: new Date(Date.now() - 86400000).toISOString(),
    note: 'Salary',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const transactionTypeLabels: Record<string, string> = {
  income: 'Income',
  expense: 'Expense',
  transfer: 'Transfer',
  adjustment: 'Adjustment',
};

export const mockSplitParticipants = [
  {
    id: '1',
    name: 'Alice',
    contact: 'alice@example.com',
    shareAmount: 240000,
    status: 'pending' as const,
  },
  {
    id: '2',
    name: 'Bob',
    contact: 'bob@example.com',
    shareAmount: 240000,
    status: 'paid' as const,
  },
  {
    id: '3',
    name: 'Charlie',
    contact: 'charlie@example.com',
    shareAmount: 240000,
    status: 'reminded' as const,
  },
];
