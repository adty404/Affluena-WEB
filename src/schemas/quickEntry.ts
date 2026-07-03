import { z } from 'zod';

export const quickEntryTemplateSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  type: z.enum(['income', 'expense', 'transfer', 'adjustment']),
  wallet_id: z.string().min(1, 'Dompet wajib dipilih'),
  to_wallet_id: z.string().optional(),
  category_id: z.string().optional(),
  amount_minor: z.number().int().positive('Jumlah harus lebih dari 0'),
  note: z.string().optional(),
}).refine((data) => {
  if (data.type === 'transfer' && !data.to_wallet_id) {
    return false;
  }
  return true;
}, {
  message: 'Dompet tujuan wajib dipilih untuk transfer',
  path: ['to_wallet_id'],
});

export type QuickEntryTemplateInput = z.infer<typeof quickEntryTemplateSchema>;
