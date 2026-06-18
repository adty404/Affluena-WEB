import { useQuery } from '@tanstack/react-query'
import { getActivities } from '../api/activity'
import { queryKeys } from '../lib/queryClient'

export function useActivities(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.activities.list(params),
    queryFn: () => getActivities(params),
  })
}
