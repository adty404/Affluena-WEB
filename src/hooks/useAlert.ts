import { useQuery } from '@tanstack/react-query';
import { getAlert } from '../api/alerts';
import { queryKeys } from '../lib/queryClient';

export function useAlert(id: string) {
  return useQuery({
    queryKey: queryKeys.alerts.detail(id),
    queryFn: () => getAlert(id),
    enabled: !!id,
  });
}
