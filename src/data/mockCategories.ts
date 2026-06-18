import type { Category } from '../types/category';

// @deprecated — Use useCategories() hook instead. Kept for cross-plan consumers.
export const mockCategories: Category[] = [
  { id: 'food', user_id: 'u1', name: 'Food & Drink', type: 'expense', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'groceries', user_id: 'u1', parent_id: 'food', name: 'Groceries', type: 'expense', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'coffee', user_id: 'u1', parent_id: 'food', name: 'Coffee', type: 'expense', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'delivery', user_id: 'u1', parent_id: 'food', name: 'Food Delivery', type: 'expense', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'transport', user_id: 'u1', name: 'Transportation', type: 'expense', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'train', user_id: 'u1', parent_id: 'transport', name: 'Train & LRT', type: 'expense', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'ride', user_id: 'u1', parent_id: 'transport', name: 'Ride Hailing', type: 'expense', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'salary', user_id: 'u1', name: 'Salary', type: 'income', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'freelance', user_id: 'u1', name: 'Freelance', type: 'income', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'shopping', user_id: 'u1', name: 'Shopping', type: 'expense', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
];

export const flatCategories: Category[] = mockCategories;
