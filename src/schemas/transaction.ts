import { z } from 'zod'

export const transactionSchema = z.object({
  type: z.enum(['income', 'expense', 'transfer', 'adjustment']),
  wallet_id: z.string().min(1, 'Wallet is required'),
  to_wallet_id: z.string().optional(),
  category_id: z.string().optional(),
  amount_minor: z.number().int(),
  tag_ids: z.array(z.string()).optional(),
  transaction_at: z.string().datetime(),
  note: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.type === 'transfer' && !data.to_wallet_id) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Destination wallet is required for transfers',
      path: ['to_wallet_id'],
    })
  }
  if (data.type === 'transfer' && data.wallet_id === data.to_wallet_id) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Destination wallet must be different from source wallet',
      path: ['to_wallet_id'],
    })
  }
  if ((data.type === 'income' || data.type === 'expense') && !data.category_id) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Category is required for income and expense',
      path: ['category_id'],
    })
  }
  if (data.type !== 'adjustment' && data.amount_minor <= 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Amount must be greater than 0',
      path: ['amount_minor'],
    })
  }
})

export type TransactionFormData = z.infer<typeof transactionSchema>

export const splitTransactionSchema = z.object({
  wallet_id: z.string().min(1, 'Wallet is required'),
  category_id: z.string().optional(),
  total_amount_minor: z.number().int().min(1, 'Total amount must be greater than 0'),
  transaction_at: z.string().datetime().optional(),
  note: z.string().optional(),
  tag_ids: z.array(z.string()).optional(),
  splits: z.array(z.object({
    counterparty_name: z.string().min(1, 'Name is required'),
    amount_minor: z.number().int().min(1, 'Amount must be greater than 0'),
    disbursement_category_id: z.string().min(1, 'Disbursement category is required'),
    payment_category_id: z.string().min(1, 'Payment category is required'),
  })).min(1, 'At least one split is required'),
})

export type SplitTransactionFormData = z.infer<typeof splitTransactionSchema>
