import { useQuery } from '@tanstack/react-query'
import { me } from '../api/auth'
import { queryKeys } from '../lib/queryClient'
import { getAccessToken } from '../lib/token'

export function useMe() {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: () => me(),
    enabled: Boolean(getAccessToken()),
    staleTime: 60_000,
  })
}
