import { apiFetch } from './client'
import type { NotificationRulesResponse, NotificationRule, NotificationRuleUpdate } from '../types/settings'

export async function getNotificationRules(): Promise<NotificationRulesResponse> {
  return apiFetch<NotificationRulesResponse>('/api/v1/notifications/rules')
}

export async function updateNotificationRule(id: string, update: NotificationRuleUpdate): Promise<NotificationRule> {
  return apiFetch<NotificationRule>(`/api/v1/notifications/rules/${id}`, {
    method: 'PUT',
    body: update,
  })
}
