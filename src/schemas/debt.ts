import { z } from 'zod';

export const createDebtSchema = z.object({
  type: z.enum(['payable', 'receivable']),
  counterparty_name: z.string().min(1, 'Counterparty name is required'),
  wallet_id: z.string().min(1, 'Wallet is required'),
  disbursement_category_id: z.string().min(1, 'Disbursement category is required'),
  payment_category_id: z.string().min(1, 'Payment category is required'),
  principal_amount_minor: z.number().int().positive('Amount must be positive'),
  opened_at: z.string().optional(),
  due_date: z.string().optional(),
  note: z.string().optional().default(''),
});

export type CreateDebtInput = z.infer<typeof createDebtSchema>;

export const updateDebtSchema = z.object({
  counterparty_name: z.string().min(1, 'Counterparty name is required').optional(),
  due_date: z.string().optional(),
  status: z.enum(['open', 'paid', 'cancelled']).optional(),
  note: z.string().optional(),
});

export type UpdateDebtInput = z.infer<typeof updateDebtSchema>;

export const payDebtSchema = z.object({
  amount_minor: z.number().int().positive('Amount must be positive'),
  paid_at: z.string().optional(),
  note: z.string().optional().default(''),
});

export type PayDebtInput = z.infer<typeof payDebtSchema>;
