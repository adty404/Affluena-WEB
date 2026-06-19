import { apiFetch } from './client'
import type { Activity, ActivityListResponse } from '../types/reporting'

export function getActivities(params?: Record<string, unknown>) {
  return apiFetch<ActivityListResponse>('/api/v1/activities', {
    method: 'GET',
    query: params as Record<string, string | number | boolean | undefined | null>,
  })
}

export function getActivity(id: string) {
  return apiFetch<Activity>(`/api/v1/activities/${id}`, {
    method: 'GET',
  })
}
