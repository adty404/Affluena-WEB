import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createTag,
  deleteTag,
  getTag,
  listTags,
  type ListParams,
  updateTag,
} from '../api/tags'
import type {
  TagCreateRequest,
  TagUpdateRequest,
} from '../types/tag'
import { queryKeys } from '../lib/queryClient'

export function useTags(params: ListParams = {}) {
  return useQuery({
    queryKey: queryKeys.tags.list(params as Record<string, unknown>),
    queryFn: () => listTags(params),
  })
}

export function useTag(id: string | undefined) {
  return useQuery({
    queryKey: id ? queryKeys.tags.detail(id) : ['tags', 'detail', 'undefined'],
    queryFn: () => getTag(id as string),
    enabled: Boolean(id),
  })
}

export function useCreateTag() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: TagCreateRequest) => createTag(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.tags.all })
    },
  })
}

export function useUpdateTag(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: TagUpdateRequest) => updateTag(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.tags.detail(id) })
      qc.invalidateQueries({ queryKey: queryKeys.tags.all })
    },
  })
}

export function useDeleteTag() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteTag(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.tags.all })
    },
  })
}
