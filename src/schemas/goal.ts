import { z } from 'zod';

export const goalSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  target_amount_minor: z.number().int().min(1, 'Target amount must be greater than 0'),
  deadline: z.string().min(1, 'Deadline is required'),
});

export type GoalFormData = z.infer<typeof goalSchema>;

export const goalMemberInviteSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export type GoalMemberInviteData = z.infer<typeof goalMemberInviteSchema>;
