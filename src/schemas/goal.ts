import { z } from 'zod';
import { itemColorSchema, itemIconSchema } from './appearance';

export const goalSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  target_amount_minor: z.number().int().min(1, 'Target amount must be greater than 0'),
  deadline: z.string().min(1, 'Deadline is required'),
  // Optional — only sent on edit to transition the goal lifecycle.
  status: z.enum(['active', 'achieved', 'cancelled']).optional(),
  color: itemColorSchema,
  icon: itemIconSchema,
});

export type GoalFormData = z.infer<typeof goalSchema>;

export const goalMemberInviteSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export type GoalMemberInviteData = z.infer<typeof goalMemberInviteSchema>;
