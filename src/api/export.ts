import { apiFetch } from './client'
import type { ExportJob, ExportJobsResponse } from '../types/reporting'

export function getExportCSV(from?: string, to?: string) {
  const query: Record<string, string> = {}
  if (from) query.from = from
  if (to) query.to = to

  return apiFetch<Blob>('/api/v1/export/csv', {
    method: 'GET',
    query,
    responseType: 'blob',
  })
}

export function listExportJobs(limit?: number, offset?: number) {
  const query: Record<string, string> = {}
  if (limit !== undefined) query.limit = limit.toString()
  if (offset !== undefined) query.offset = offset.toString()

  return apiFetch<ExportJobsResponse>('/api/v1/export/jobs', {
    method: 'GET',
    query,
  })
}

export function getExportJob(id: string) {
  return apiFetch<ExportJob>(`/api/v1/export/jobs/${id}`, {
    method: 'GET',
  })
}
