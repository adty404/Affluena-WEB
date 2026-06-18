import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { quickEntryApi } from '../api/quickEntry';
import type { QuickEntryTemplateInput } from '../schemas/quickEntry';

export const quickEntryKeys = {
  all: ['quickEntry'] as const,
  lists: () => [...quickEntryKeys.all, 'list'] as const,
  list: (filters: string) => [...quickEntryKeys.lists(), { filters }] as const,
  details: () => [...quickEntryKeys.all, 'detail'] as const,
  detail: (id: string) => [...quickEntryKeys.details(), id] as const,
};

export function useQuickEntryTemplates(params?: { limit?: number; offset?: number; sort?: string }) {
  return useQuery({
    queryKey: quickEntryKeys.list(JSON.stringify(params || {})),
    queryFn: () => quickEntryApi.list(params),
  });
}

export function useQuickEntryTemplate(id: string) {
  return useQuery({
    queryKey: quickEntryKeys.detail(id),
    queryFn: () => quickEntryApi.get(id),
    enabled: !!id,
  });
}

export function useCreateQuickEntryTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: QuickEntryTemplateInput) => quickEntryApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quickEntryKeys.lists() });
    },
  });
}

export function useUpdateQuickEntryTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: QuickEntryTemplateInput }) =>
      quickEntryApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: quickEntryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: quickEntryKeys.detail(variables.id) });
    },
  });
}

export function useDeleteQuickEntryTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => quickEntryApi.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: quickEntryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: quickEntryKeys.detail(id) });
    },
  });
}

export function useExecuteQuickEntryTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data?: { transaction_at?: string; note?: string } }) =>
      quickEntryApi.execute(id, data),
    onSuccess: () => {
      // Invalidate transactions since a new one was created
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}
