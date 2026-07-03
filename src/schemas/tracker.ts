import { z } from 'zod';
import { itemColorSchema, itemIconSchema } from './appearance';

export const createInstallmentSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  wallet_id: z.string().min(1, 'Dompet wajib dipilih'),
  category_id: z.string().min(1, 'Kategori wajib dipilih'),
  total_amount_minor: z.number().int().positive('Nominal total harus lebih dari 0'),
  monthly_amount_minor: z.number().int().positive('Nominal bulanan harus lebih dari 0'),
  tenor_months: z.number().int().positive('Tenor harus lebih dari 0'),
  remaining_months: z.number().int().nonnegative().optional(),
  start_date: z.string().min(1, 'Tanggal mulai wajib diisi'),
  due_day: z.number().int().min(1).max(31),
  status: z.enum(['active', 'paid', 'cancelled']).optional(),
  note: z.string().optional().default(''),
  color: itemColorSchema,
  icon: itemIconSchema,
});

export type CreateInstallmentInput = z.infer<typeof createInstallmentSchema>;

export const updateInstallmentSchema = createInstallmentSchema.partial();

export type UpdateInstallmentInput = z.infer<typeof updateInstallmentSchema>;

export const payInstallmentSchema = z.object({
  paid_at: z.string().optional(),
  note: z.string().optional().default(''),
});

export type PayInstallmentInput = z.infer<typeof payInstallmentSchema>;

export const createSubscriptionSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  account_detail: z.string().optional().default(''),
  wallet_id: z.string().min(1, 'Dompet wajib dipilih'),
  category_id: z.string().min(1, 'Kategori wajib dipilih'),
  amount_minor: z.number().int().positive('Jumlah harus lebih dari 0'),
  billing_cycle: z.enum(['weekly', 'monthly']),
  next_due_date: z.string().min(1, 'Tanggal jatuh tempo berikutnya wajib diisi'),
  status: z.enum(['active', 'paused', 'cancelled']).optional(),
  note: z.string().optional().default(''),
  color: itemColorSchema,
  icon: itemIconSchema,
});

export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;

export const updateSubscriptionSchema = createSubscriptionSchema.partial();

export type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionSchema>;

export const paySubscriptionSchema = z.object({
  paid_at: z.string().optional(),
  note: z.string().optional().default(''),
});

export type PaySubscriptionInput = z.infer<typeof paySubscriptionSchema>;
