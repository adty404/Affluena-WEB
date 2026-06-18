import { z } from 'zod';

export const budgetSchema = z.object({
  category_id: z.string().uuid('Invalid category ID'),
  month: z.string().regex(/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format'),
  limit_minor: z.number().int().min(1, 'Limit must be at least 1'),
});

export type BudgetFormData = z.infer<typeof budgetSchema>;
