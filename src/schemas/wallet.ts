import { z } from 'zod'
import { itemColorSchema, itemIconSchema } from './appearance'

const walletTypeEnum = z.enum(['cash', 'bank', 'e_wallet', 'investment'])

export const walletCreateSchema = z.object({
  name: z.string().min(1, 'Nama dompet wajib diisi').max(100, 'Maksimal 100 karakter'),
  type: walletTypeEnum,
  currency_code: z.string().length(3, 'Mata uang 3 huruf (mis. IDR)'),
  balance_minor: z
    .number()
    .int('Saldo harus bilangan bulat')
    .min(0, 'Saldo awal tidak boleh negatif'),
  color: itemColorSchema,
  icon: itemIconSchema,
  description: z.string().max(500, 'Maksimal 500 karakter').optional(),
})

export const walletUpdateSchema = z.object({
  name: z.string().min(1, 'Nama dompet wajib diisi').max(100, 'Maksimal 100 karakter'),
  type: walletTypeEnum,
  currency_code: z.string().length(3, 'Mata uang 3 huruf (mis. IDR)'),
  color: itemColorSchema,
  icon: itemIconSchema,
  description: z.string().max(500, 'Maksimal 500 karakter').optional(),
})

export type WalletCreateFormValues = z.infer<typeof walletCreateSchema>
export type WalletUpdateFormValues = z.infer<typeof walletUpdateSchema>

export const walletTypeLabels: Record<string, string> = {
  cash: 'Tunai',
  bank: 'Bank',
  e_wallet: 'E-Wallet',
  investment: 'Investasi',
  goal: 'Dompet Target',
}

export const walletTypeOptions: { value: 'cash' | 'bank' | 'e_wallet' | 'investment'; label: string }[] = [
  { value: 'cash', label: 'Tunai' },
  { value: 'bank', label: 'Bank' },
  { value: 'e_wallet', label: 'E-Wallet' },
  { value: 'investment', label: 'Investasi' },
]
