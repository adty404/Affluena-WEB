import { z } from 'zod';
import { itemColorSchema, itemIconSchema } from './appearance';

export const createInstallmentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  wallet_id: z.string().min(1, 'Wallet is required'),
  category_id: z.string().min(1, 'Category is required'),
  total_amount_minor: z.number().int().positive('Total amount must be positive'),
  monthly_amount_minor: z.number().int().positive('Monthly amount must be positive'),
  tenor_months: z.number().int().positive('Tenor must be positive'),
  remaining_months: z.number().int().nonnegative().optional(),
  start_date: z.string().min(1, 'Start date is required'),
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
  name: z.string().min(1, 'Name is required'),
  account_detail: z.string().optional().default(''),
  wallet_id: z.string().min(1, 'Wallet is required'),
  category_id: z.string().min(1, 'Category is required'),
  amount_minor: z.number().int().positive('Amount must be positive'),
  billing_cycle: z.enum(['weekly', 'monthly']),
  next_due_date: z.string().min(1, 'Next due date is required'),
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
