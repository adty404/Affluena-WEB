import { z } from 'zod';
import { itemColorSchema, itemIconSchema } from './appearance';

export const goalSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  target_amount_minor: z.number().int().min(1, 'Target wajib diisi'),
  deadline: z.string().min(1, 'Batas waktu wajib diisi'),
  // Optional — only sent on edit to transition the goal lifecycle.
  status: z.enum(['active', 'achieved', 'cancelled']).optional(),
  color: itemColorSchema,
  icon: itemIconSchema,
});

export type GoalFormData = z.infer<typeof goalSchema>;

export const goalMemberInviteSchema = z.object({
  email: z.string().email('Email tidak valid'),
});

export type GoalMemberInviteData = z.infer<typeof goalMemberInviteSchema>;
