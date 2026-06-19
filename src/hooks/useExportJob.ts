import { useQuery } from '@tanstack/react-query'
import { getExportJob } from '../api/export'
import { queryKeys } from '../lib/queryClient'

export function useExportJob(id: string) {
  return useQuery({
    queryKey: queryKeys.exportJobs.detail(id),
    queryFn: () => getExportJob(id),
    enabled: !!id,
  })
}
