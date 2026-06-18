import type { Tag } from '../types/tag';

// @deprecated — Use useTags() hook instead. Kept for cross-plan consumers.
export const mockTags: Tag[] = [
  { id: 'monthly', user_id: 'u1', name: 'monthly', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'family', user_id: 'u1', name: 'family', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'work-trip', user_id: 'u1', name: 'work-trip', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'urgent', user_id: 'u1', name: 'urgent', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'cash-only', user_id: 'u1', name: 'cash-only', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'reimburse', user_id: 'u1', name: 'reimburse', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
];
