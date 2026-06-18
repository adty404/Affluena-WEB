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

export function listCategories(params: ListParams & { type?: 'income' | 'expense' } = {}) {
  return apiFetch<CategoryListResponse>('/api/v1/categories', {
    method: 'GET',
    query: {
      limit: params.limit,
      offset: params.offset,
      sort: params.sort,
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
