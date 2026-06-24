import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getGoals, getGoal, createGoal, updateGoal, inviteGoalMember, respondGoalMember } from '../api/goals';
import { queryKeys } from '../lib/queryClient';

export function useGoals() {
  return useQuery({
    queryKey: queryKeys.goals.all,
    queryFn: getGoals,
  });
}

export function useGoal(id: string) {
  return useQuery({
    queryKey: queryKeys.goals.detail(id),
    queryFn: () => getGoal(id),
    enabled: Boolean(id),
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.all });
    },
  });
}

export function useUpdateGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateGoal>[1] }) => updateGoal(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.detail(variables.id) });
    },
  });
}

export function useInviteGoalMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof inviteGoalMember>[1] }) => inviteGoalMember(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.detail(variables.id) });
    },
  });
}

export function useRespondGoalMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, userId, data }: { id: string; userId: string; data: Parameters<typeof respondGoalMember>[2] }) => respondGoalMember(id, userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.detail(variables.id) });
    },
  });
}
