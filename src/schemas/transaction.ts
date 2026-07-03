import { z } from 'zod'

export const transactionSchema = z.object({
  type: z.enum(['income', 'expense', 'transfer', 'adjustment']),
  wallet_id: z.string().min(1, 'Dompet wajib dipilih'),
  to_wallet_id: z.string().optional(),
  category_id: z.string().optional(),
  amount_minor: z.number().int(),
  tag_ids: z.array(z.string()).optional(),
  transaction_at: z.string(),
  note: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.type === 'transfer' && !data.to_wallet_id) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Dompet tujuan wajib dipilih untuk transfer',
      path: ['to_wallet_id'],
    })
  }
  if (data.type === 'transfer' && data.wallet_id === data.to_wallet_id) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Dompet tujuan harus berbeda dari dompet asal',
      path: ['to_wallet_id'],
    })
  }
  if ((data.type === 'income' || data.type === 'expense') && !data.category_id) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Kategori wajib dipilih untuk pemasukan dan pengeluaran',
      path: ['category_id'],
    })
  }
  if (data.type !== 'adjustment' && data.amount_minor <= 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Jumlah harus lebih dari 0',
      path: ['amount_minor'],
    })
  }
})

export type TransactionFormData = z.infer<typeof transactionSchema>

export const splitTransactionSchema = z.object({
  wallet_id: z.string().min(1, 'Dompet wajib dipilih'),
  category_id: z.string().min(1, 'Kategori wajib dipilih'),
  total_amount_minor: z.number().int().min(1, 'Jumlah total harus lebih dari 0'),
  transaction_at: z.string().optional(),
  note: z.string().optional(),
  tag_ids: z.array(z.string()).optional(),
  splits: z.array(z.object({
    counterparty_name: z.string().min(1, 'Nama wajib diisi'),
    amount_minor: z.number().int().min(1, 'Jumlah harus lebih dari 0'),
    disbursement_category_id: z.string().min(1, 'Kategori pengeluaran wajib dipilih'),
    payment_category_id: z.string().min(1, 'Kategori pembayaran wajib dipilih'),
  })).min(1, 'Minimal satu peserta wajib ditambahkan'),
})

export type SplitTransactionFormData = z.infer<typeof splitTransactionSchema>
