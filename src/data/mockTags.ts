import type { Tag } from '../types/tag';

export const mockTags: Tag[] = [
  { id: 'monthly', name: 'monthly', color: 'green', transactionCount: 18, totalAmount: 5200000, lastUsed: 'Today' },
  { id: 'family', name: 'family', color: 'purple', transactionCount: 11, totalAmount: 2840000, lastUsed: 'Yesterday' },
  { id: 'work-trip', name: 'work-trip', color: 'blue', transactionCount: 7, totalAmount: 1620000, lastUsed: '12 Jun 2026' },
  { id: 'urgent', name: 'urgent', color: 'red', transactionCount: 4, totalAmount: 740000, lastUsed: '10 Jun 2026' },
  { id: 'cash-only', name: 'cash-only', color: 'orange', transactionCount: 8, totalAmount: 950000, lastUsed: '08 Jun 2026' },
  { id: 'reimburse', name: 'reimburse', color: 'gray', transactionCount: 5, totalAmount: 1180000, lastUsed: '05 Jun 2026' },
];
