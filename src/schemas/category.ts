import { z } from 'zod'

export const categoryTypeEnum = z.enum(['income', 'expense'])

export const categoryCreateSchema = z.object({
  name: z.string().min(1, 'Nama kategori wajib diisi').max(100, 'Maksimal 100 karakter'),
  type: categoryTypeEnum,
  parent_id: z.string().uuid().optional(),
})

export const categoryUpdateSchema = z.object({
  name: z.string().min(1, 'Nama kategori wajib diisi').max(100, 'Maksimal 100 karakter'),
  type: categoryTypeEnum,
  parent_id: z.string().uuid().optional(),
})

export type CategoryCreateFormValues = z.infer<typeof categoryCreateSchema>
export type CategoryUpdateFormValues = z.infer<typeof categoryUpdateSchema>

export const categoryTypeLabels: Record<string, string> = {
  income: 'Pemasukan',
  expense: 'Pengeluaran',
}

export const categoryTypeOptions: { value: 'income' | 'expense'; label: string }[] = [
  { value: 'income', label: 'Pemasukan' },
  { value: 'expense', label: 'Pengeluaran' },
]
