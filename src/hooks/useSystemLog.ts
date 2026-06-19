import { useQuery } from '@tanstack/react-query'
import { getSystemLog } from '../api/systemLogs'
import { queryKeys } from '../lib/queryClient'

export function useSystemLog(id: string) {
  return useQuery({
    queryKey: queryKeys.systemLogs.detail(id),
    queryFn: () => getSystemLog(id),
    enabled: !!id,
  })
}
