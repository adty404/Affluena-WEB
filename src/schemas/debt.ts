import { z } from 'zod';

export const createDebtSchema = z.object({
  type: z.enum(['payable', 'receivable']),
  counterparty_name: z.string().min(1, 'Nama pihak lain wajib diisi'),
  wallet_id: z.string().min(1, 'Dompet wajib dipilih'),
  disbursement_category_id: z.string().min(1, 'Kategori pencairan wajib dipilih'),
  payment_category_id: z.string().min(1, 'Kategori pembayaran wajib dipilih'),
  principal_amount_minor: z.number().int().positive('Jumlah harus lebih dari 0'),
  opened_at: z.string().optional(),
  due_date: z.string().optional(),
  note: z.string().optional().default(''),
});

export type CreateDebtInput = z.infer<typeof createDebtSchema>;

export const updateDebtSchema = z.object({
  counterparty_name: z.string().min(1, 'Nama pihak lain wajib diisi').optional(),
  due_date: z.string().optional(),
  status: z.enum(['open', 'paid', 'cancelled']).optional(),
  note: z.string().optional(),
});

export type UpdateDebtInput = z.infer<typeof updateDebtSchema>;

export const payDebtSchema = z.object({
  amount_minor: z.number().int().positive('Jumlah harus lebih dari 0'),
  paid_at: z.string().optional(),
  note: z.string().optional().default(''),
});

export type PayDebtInput = z.infer<typeof payDebtSchema>;
