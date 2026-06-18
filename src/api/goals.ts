import { apiFetch } from './client';
import type { Goal } from '../types/goal';

export async function getGoals(): Promise<Goal[]> {
  return apiFetch<Goal[]>('/api/v1/goals');
}

export async function getGoal(id: string): Promise<Goal> {
  return apiFetch<Goal>(`/api/v1/goals/${id}`);
}

export async function createGoal(data: { name: string; target_amount_minor: number; deadline?: string }): Promise<Goal> {
  return apiFetch<Goal>('/api/v1/goals', { method: 'POST', body: data });
}

export async function updateGoal(id: string, data: { name: string; target_amount_minor: number; deadline?: string }): Promise<Goal> {
  return apiFetch<Goal>(`/api/v1/goals/${id}`, { method: 'PUT', body: data });
}

export async function inviteGoalMember(id: string, data: { email: string }): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/api/v1/goals/${id}/members`, { method: 'POST', body: data });
}

export async function respondGoalMember(id: string, userId: string, data: { status: 'joined' | 'rejected' }): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/api/v1/goals/${id}/members/${userId}/respond`, { method: 'PUT', body: data });
}
