import { apiFetch } from './client'

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
