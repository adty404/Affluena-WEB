import { useQuery } from '@tanstack/react-query'
import { getActivity } from '../api/activity'
import { queryKeys } from '../lib/queryClient'

export function useActivity(id: string) {
  return useQuery({
    queryKey: queryKeys.activities.detail(id),
    queryFn: () => getActivity(id),
    enabled: !!id,
  })
}
