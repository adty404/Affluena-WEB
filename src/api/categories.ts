import { apiFetch } from './client'
import type {
  Category,
  CategoryCreateRequest,
  CategoryListResponse,
  CategoryUpdateRequest,
} from '../types/category'

export interface ListParams {
  limit?: number
  offset?: number
  sort?: string
}

// Note: categories are intentionally listed WITHOUT a `sort` param so the API
// default (position ASC — the user's arranged order via the reorder endpoint)
// is preserved. Do not pass `sort` here.
export function listCategories(params: Omit<ListParams, 'sort'> & { type?: 'income' | 'expense' } = {}) {
  return apiFetch<CategoryListResponse>('/api/v1/categories', {
    method: 'GET',
    query: {
      limit: params.limit,
      offset: params.offset,
      type: params.type,
    },
  })
}

export function getCategory(id: string) {
  return apiFetch<Category>(`/api/v1/categories/${id}`)
}

export function createCategory(payload: CategoryCreateRequest) {
  return apiFetch<Category>('/api/v1/categories', {
    method: 'POST',
    body: payload,
  })
}

export function updateCategory(id: string, payload: CategoryUpdateRequest) {
  return apiFetch<Category>(`/api/v1/categories/${id}`, {
    method: 'PUT',
    body: payload,
  })
}

export function deleteCategory(id: string) {
  return apiFetch<void>(`/api/v1/categories/${id}`, {
    method: 'DELETE',
  })
}

/**
 * Persist the user's arranged category order. `ids` is the full flattened list
 * of category ids in the desired order; the API stores each category's
 * `position` so subsequent list calls (default sort: position ASC) return them
 * arranged.
 */
export function reorderCategories(ids: string[]) {
  return apiFetch<void>('/api/v1/categories/reorder', {
    method: 'PUT',
    body: { ids },
  })
}
