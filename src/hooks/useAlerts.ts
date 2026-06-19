import { useQuery } from '@tanstack/react-query';
import { getAlerts } from '../api/alerts';
import { queryKeys } from '../lib/queryClient';

export function useAlerts(month?: string) {
  return useQuery({
    queryKey: queryKeys.alerts.list(month),
    queryFn: () => getAlerts(month),
  });
}
