import { apiFetch } from './client'
import type { ActivityEvent } from '../types/reporting'

export interface ActivityListResponse {
  activities: ActivityEvent[]
  total: number
  page: number
  limit: number
}

export function getActivities(params?: Record<string, unknown>) {
  return apiFetch<ActivityListResponse>('/api/v1/activities', {
    method: 'GET',
    query: params as Record<string, string | number | boolean | undefined | null>,
  })
}
