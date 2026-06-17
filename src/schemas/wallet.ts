import { z } from 'zod'

const walletTypeEnum = z.enum(['cash', 'bank', 'e_wallet', 'investment'])

export const walletCreateSchema = z.object({
  name: z.string().min(1, 'Nama wallet wajib diisi').max(100, 'Maksimal 100 karakter'),
  type: walletTypeEnum,
  currency_code: z.string().length(3, 'Mata uang 3 huruf (mis. IDR)'),
  balance_minor: z
    .number()
    .int('Saldo harus bilangan bulat')
    .min(0, 'Saldo awal tidak boleh negatif'),
})

export const walletUpdateSchema = z.object({
  name: z.string().min(1, 'Nama wallet wajib diisi').max(100, 'Maksimal 100 karakter'),
  type: walletTypeEnum,
  currency_code: z.string().length(3, 'Mata uang 3 huruf (mis. IDR)'),
})

export type WalletCreateFormValues = z.infer<typeof walletCreateSchema>
export type WalletUpdateFormValues = z.infer<typeof walletUpdateSchema>

export const walletTypeLabels: Record<string, string> = {
  cash: 'Cash',
  bank: 'Bank',
  e_wallet: 'E-Wallet',
  investment: 'Investment',
  goal: 'Goal Wallet',
}

export const walletTypeOptions: { value: 'cash' | 'bank' | 'e_wallet' | 'investment'; label: string }[] = [
  { value: 'cash', label: 'Cash' },
  { value: 'bank', label: 'Bank' },
  { value: 'e_wallet', label: 'E-Wallet' },
  { value: 'investment', label: 'Investment' },
]
