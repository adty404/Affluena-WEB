import { z } from 'zod'

export const categoryTypeEnum = z.enum(['income', 'expense'])

// `color` (#RRGGBB or '') + `icon` (catalog id or '') are optional appearance
// fields; '' means "cleared" and is sent as-is so the API drops the value.
const colorField = z.string().regex(/^(#[0-9A-Fa-f]{6})?$/, 'Warna tidak valid').optional()
const iconField = z.string().max(40).optional()

export const categoryCreateSchema = z.object({
  name: z.string().min(1, 'Nama kategori wajib diisi').max(100, 'Maksimal 100 karakter'),
  type: categoryTypeEnum,
  parent_id: z.preprocess((val) => (val === '' ? undefined : val), z.string().uuid().optional()),
  color: colorField,
  icon: iconField,
})

export const categoryUpdateSchema = z.object({
  name: z.string().min(1, 'Nama kategori wajib diisi').max(100, 'Maksimal 100 karakter'),
  type: categoryTypeEnum,
  parent_id: z.preprocess((val) => (val === '' ? undefined : val), z.string().uuid().optional()),
  color: colorField,
  icon: iconField,
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
