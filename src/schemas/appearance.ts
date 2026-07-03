import { z } from 'zod';

/**
 * Shared zod fragments for the optional item-appearance fields (`color`,
 * `icon`) the API stores as-is on wallets, category-budgets, goals,
 * installments, subscriptions, and recurring rules. Both are optional and
 * empty-string tolerant ("" means "no color / no icon" — the entity keeps its
 * default styling).
 */
export const itemColorSchema = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, 'Warna harus format #RRGGBB')
  .optional()
  .or(z.literal(''));

export const itemIconSchema = z.string().max(50, 'Maksimal 50 karakter').optional().or(z.literal(''));
