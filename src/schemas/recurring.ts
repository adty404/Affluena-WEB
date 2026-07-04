import { z } from 'zod';
import { itemColorSchema, itemIconSchema } from './appearance';

export const recurringRuleSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  type: z.enum(['income', 'expense', 'transfer', 'adjustment']),
  wallet_id: z.string().min(1, 'Dompet wajib dipilih'),
  to_wallet_id: z.string().optional(),
  category_id: z.string().optional(),
  amount_minor: z.number().int().positive('Jumlah harus lebih dari 0'),
  frequency: z.enum(['weekly', 'monthly']),
  interval_count: z.number().int().min(1).optional(),
  // `<input type="datetime-local">` yields 'YYYY-MM-DDTHH:mm' (no offset/Z),
  // which z.string().datetime() rejects — mirror tracker.ts and just require
  // a non-empty local string; the page converts to RFC3339 on submit.
  next_run_at: z.string().min(1, 'Jadwal berikutnya wajib diisi'),
  end_at: z.string().optional(),
  status: z.enum(['active', 'paused', 'cancelled']).optional(),
  note: z.string().optional(),
  color: itemColorSchema,
  icon: itemIconSchema,
}).refine((data) => {
  if (data.type === 'transfer' && !data.to_wallet_id) {
    return false;
  }
  return true;
}, {
  message: 'Dompet tujuan wajib dipilih untuk transfer',
  path: ['to_wallet_id'],
});

export type RecurringRuleInput = z.infer<typeof recurringRuleSchema>;
