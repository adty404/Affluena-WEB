export type CategoryType = 'income' | 'expense'

export interface Category {
  id: string
  user_id: string
  parent_id?: string
  name: string
  type: CategoryType
  /** Semantic icon id from the client-owned catalog ('' = no icon chosen). */
  icon?: string
  /** `#RRGGBB` hex accent ('' = no color chosen). */
  color?: string
  /**
   * User-arranged order — the API's default list sort is position ASC.
   * Not settable via create/update; use the reorder endpoint.
   */
  position?: number
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
  /** Semantic icon id; send '' to clear. Omitted when undefined. */
  icon?: string
  /** `#RRGGBB` hex; send '' to clear. Omitted when undefined. */
  color?: string
}

export interface CategoryUpdateRequest {
  name: string
  type: CategoryType
  parent_id?: string
  /** Semantic icon id; send '' to clear. Omitted when undefined. */
  icon?: string
  /** `#RRGGBB` hex; send '' to clear. Omitted when undefined. */
  color?: string
}

/** Body for `PUT /api/v1/categories/reorder`: the full ordered id list. */
export interface CategoryReorderRequest {
  ids: string[]
}
