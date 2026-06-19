import { apiFetch } from './client'
import type { SystemLog, SystemLogsResponse } from '../types/reporting'

export function getSystemLogs(limit?: number) {
  const query: Record<string, string | number> = {}
  if (limit !== undefined) {
    query.limit = limit
  }
  return apiFetch<SystemLogsResponse>('/api/v1/system-logs', {
    method: 'GET',
    query,
  })
}

export function getSystemLog(id: string) {
  return apiFetch<SystemLog>(`/api/v1/system-logs/${id}`, {
    method: 'GET',
  })
}
