import { z } from 'zod'

const walletTypeEnum = z.enum(['cash', 'bank', 'e_wallet', 'investment'])
const walletColorEnum = z.enum(['green', 'blue', 'orange', 'purple', 'gray']).or(z.literal(''))

export const walletCreateSchema = z.object({
  name: z.string().min(1, 'Nama wallet wajib diisi').max(100, 'Maksimal 100 karakter'),
  type: walletTypeEnum,
  currency_code: z.string().length(3, 'Mata uang 3 huruf (mis. IDR)'),
  balance_minor: z
    .number()
    .int('Saldo harus bilangan bulat')
    .min(0, 'Saldo awal tidak boleh negatif'),
  color: walletColorEnum.optional(),
  description: z.string().max(500, 'Maksimal 500 karakter').optional(),
})

export const walletUpdateSchema = z.object({
  name: z.string().min(1, 'Nama wallet wajib diisi').max(100, 'Maksimal 100 karakter'),
  type: walletTypeEnum,
  currency_code: z.string().length(3, 'Mata uang 3 huruf (mis. IDR)'),
  color: walletColorEnum.optional(),
  description: z.string().max(500, 'Maksimal 500 karakter').optional(),
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

export const walletColorOptions: { value: 'green' | 'blue' | 'orange' | 'purple' | 'gray'; label: string }[] = [
  { value: 'green', label: 'Green' },
  { value: 'blue', label: 'Blue' },
  { value: 'orange', label: 'Orange' },
  { value: 'purple', label: 'Purple' },
  { value: 'gray', label: 'Gray' },
]
