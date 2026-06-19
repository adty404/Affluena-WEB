import { useQuery } from '@tanstack/react-query'
import { getSystemLogs } from '../api/systemLogs'
import { queryKeys } from '../lib/queryClient'

export function useSystemLogs(limit?: number) {
  return useQuery({
    queryKey: queryKeys.systemLogs.list(limit),
    queryFn: () => getSystemLogs(limit),
  })
}
