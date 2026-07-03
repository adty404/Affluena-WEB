import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createCategory,
  deleteCategory,
  getCategory,
  listCategories,
  type ListParams,
  reorderCategories,
  updateCategory,
} from '../api/categories'
import type {
  CategoryCreateRequest,
  CategoryListResponse,
  CategoryUpdateRequest,
} from '../types/category'
import { queryKeys } from '../lib/queryClient'

export function useCategories(params: Omit<ListParams, 'sort'> & { type?: 'income' | 'expense' } = {}) {
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

/**
 * Persists a new category order (the full flattened id list). Optimistically
 * reorders the cached list so the UI reflects the drag immediately, and reverts
 * every touched category cache on failure. Refetches on settle so the server's
 * canonical positions win.
 */
export function useReorderCategories() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => reorderCategories(ids),
    onMutate: async (ids: string[]) => {
      await qc.cancelQueries({ queryKey: queryKeys.categories.all })
      const previous = qc.getQueriesData<CategoryListResponse>({ queryKey: queryKeys.categories.all })
      const order = new Map(ids.map((id, index) => [id, index]))
      for (const [key, data] of previous) {
        if (!data) continue
        const reordered = [...data.categories].sort((a, b) => {
          const ai = order.get(a.id)
          const bi = order.get(b.id)
          if (ai === undefined && bi === undefined) return 0
          if (ai === undefined) return 1
          if (bi === undefined) return -1
          return ai - bi
        })
        qc.setQueryData<CategoryListResponse>(key, { ...data, categories: reordered })
      }
      return { previous }
    },
    onError: (_err, _ids, context) => {
      context?.previous.forEach(([key, data]) => qc.setQueryData(key, data))
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.categories.all })
    },
  })
}
