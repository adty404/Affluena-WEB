import { useQuery } from '@tanstack/react-query'
import { me } from '../api/auth'
import { queryKeys } from '../lib/queryClient'

export function useMe() {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: () => me(),
    enabled:
      typeof window !== 'undefined' &&
      Boolean(window.localStorage.getItem('affluena.access_token')),
    staleTime: 60_000,
  })
}
