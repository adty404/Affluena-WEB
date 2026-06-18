export type CategoryType = 'income' | 'expense'

export interface Category {
  id: string
  user_id: string
  parent_id?: string
  name: string
  type: CategoryType
  created_at: string
  updated_at: string
}

export interface CategoryListResponse {
  categories: Category[]
  pagination: import('../api/types').Pagination
}

export interface CategoryCreateRequest {
  name: string
  type: CategoryType
  parent_id?: string
}

export interface CategoryUpdateRequest {
  name: string
  type: CategoryType
  parent_id?: string
}
