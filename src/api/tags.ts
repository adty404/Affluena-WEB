import { apiFetch } from './client'
import type {
  Tag,
  TagCreateRequest,
  TagListResponse,
  TagUpdateRequest,
} from '../types/tag'

export interface ListParams {
  limit?: number
  offset?: number
  sort?: string
}

export function listTags(params: ListParams = {}) {
  return apiFetch<TagListResponse>('/api/v1/tags', {
    method: 'GET',
    query: {
      limit: params.limit,
      offset: params.offset,
      sort: params.sort,
    },
  })
}

export function getTag(id: string) {
  return apiFetch<Tag>(`/api/v1/tags/${id}`)
}

export function createTag(payload: TagCreateRequest) {
  return apiFetch<Tag>('/api/v1/tags', {
    method: 'POST',
    body: payload,
  })
}

export function updateTag(id: string, payload: TagUpdateRequest) {
  return apiFetch<Tag>(`/api/v1/tags/${id}`, {
    method: 'PUT',
    body: payload,
  })
}

export function deleteTag(id: string) {
  return apiFetch<void>(`/api/v1/tags/${id}`, {
    method: 'DELETE',
  })
}
