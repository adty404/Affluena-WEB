import { z } from 'zod';
import { itemColorSchema, itemIconSchema } from './appearance';

export const recurringRuleSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['income', 'expense', 'transfer', 'adjustment']),
  wallet_id: z.string().min(1, 'Wallet is required'),
  to_wallet_id: z.string().optional(),
  category_id: z.string().optional(),
  amount_minor: z.number().int().positive('Amount must be positive'),
  frequency: z.enum(['weekly', 'monthly']),
  interval_count: z.number().int().min(1).optional(),
  next_run_at: z.string().datetime(),
  end_at: z.string().datetime().optional(),
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
  message: 'Destination wallet is required for transfers',
  path: ['to_wallet_id'],
});

export type RecurringRuleInput = z.infer<typeof recurringRuleSchema>;
