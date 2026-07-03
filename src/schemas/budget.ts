import { z } from 'zod';
import { itemColorSchema, itemIconSchema } from './appearance';

export const budgetSchema = z.object({
  category_id: z.string().uuid('Kategori wajib dipilih'),
  month: z.string().regex(/^\d{4}-\d{2}$/, 'Periode wajib diisi dengan format YYYY-MM'),
  limit_minor: z.number().int().min(1, 'Batas wajib diisi'),
  color: itemColorSchema,
  icon: itemIconSchema,
});

export type BudgetFormData = z.infer<typeof budgetSchema>;
