import { useQuery } from '@tanstack/react-query'
import { listExportJobs } from '../api/export'
import { queryKeys } from '../lib/queryClient'

export function useExportJobs(limit?: number, offset?: number) {
  return useQuery({
    queryKey: queryKeys.exportJobs.list(limit, offset),
    queryFn: () => listExportJobs(limit, offset),
  })
}
