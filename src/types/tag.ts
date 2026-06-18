export interface Tag {
  id: string
  user_id: string
  name: string
  created_at: string
  updated_at: string
}

export interface TagListResponse {
  tags: Tag[]
  pagination: import('../api/types').Pagination
}

export interface TagCreateRequest {
  name: string
}

export interface TagUpdateRequest {
  name: string
}
