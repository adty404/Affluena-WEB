export interface ApiError {
  error: string
  status: number
}

export interface Pagination {
  total: number
  limit: number
  offset: number
}

export interface PaginatedResponse<T> {
  pagination: Pagination
}

export interface EmptyBody {}
