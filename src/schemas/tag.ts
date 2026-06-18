import { z } from 'zod'

export const tagCreateSchema = z.object({
  name: z.string().min(1, 'Nama tag wajib diisi').max(50, 'Maksimal 50 karakter'),
})

export const tagUpdateSchema = z.object({
  name: z.string().min(1, 'Nama tag wajib diisi').max(50, 'Maksimal 50 karakter'),
})

export type TagCreateFormValues = z.infer<typeof tagCreateSchema>
export type TagUpdateFormValues = z.infer<typeof tagUpdateSchema>
