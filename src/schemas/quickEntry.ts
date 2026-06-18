import { z } from 'zod';

export const quickEntryTemplateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['income', 'expense', 'transfer', 'adjustment']),
  wallet_id: z.string().min(1, 'Wallet is required'),
  to_wallet_id: z.string().optional(),
  category_id: z.string().optional(),
  amount_minor: z.number().int().positive('Amount must be positive'),
  note: z.string().optional(),
}).refine((data) => {
  if (data.type === 'transfer' && !data.to_wallet_id) {
    return false;
  }
  return true;
}, {
  message: 'Destination wallet is required for transfers',
  path: ['to_wallet_id'],
});

export type QuickEntryTemplateInput = z.infer<typeof quickEntryTemplateSchema>;
