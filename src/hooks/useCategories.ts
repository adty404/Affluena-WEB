import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createCategory,
  deleteCategory,
  getCategory,
  listCategories,
  type ListParams,
  updateCategory,
} from '../api/categories'
import type {
  CategoryCreateRequest,
  CategoryUpdateRequest,
} from '../types/category'
import { queryKeys } from '../lib/queryClient'

export function useCategories(params: ListParams & { type?: 'income' | 'expense' } = {}) {
  return useQuery({
    queryKey: queryKeys.categories.list(params.type),
    queryFn: () => listCategories(params),
  })
}

export function useCategory(id: string | undefined) {
  return useQuery({
    queryKey: id ? queryKeys.categories.detail(id) : ['categories', 'detail', 'undefined'],
    queryFn: () => getCategory(id as string),
    enabled: Boolean(id),
  })
}

export function useCreateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CategoryCreateRequest) => createCategory(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.categories.all })
    },
  })
}

export function useUpdateCategory(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CategoryUpdateRequest) => updateCategory(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.categories.detail(id) })
      qc.invalidateQueries({ queryKey: queryKeys.categories.all })
    },
  })
}

export function useDeleteCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.categories.all })
    },
  })
}
