import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getNotificationRules, updateNotificationRule } from '../api/notifications'
import { queryKeys } from '../lib/queryClient'
import type { NotificationRuleUpdate } from '../types/settings'
import { useToast } from '../components/ui/Toast'

export function useNotificationRules() {
  return useQuery({
    queryKey: queryKeys.notifications.rules,
    queryFn: getNotificationRules,
  })
}

export function useUpdateNotificationRule() {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: ({ id, update }: { id: string; update: NotificationRuleUpdate }) =>
      updateNotificationRule(id, update),
    onSuccess: () => {
      showToast('Notification preferences saved.')
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.rules })
    },
    onError: (error: Error) => {
      showToast(error.message || 'Failed to update notification preferences.')
    },
  })
}
