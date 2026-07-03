import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  invitePartner,
  listPartners,
  respondPartner,
  revokePartner,
} from '../api/partners';
import type {
  PartnerInviteRequest,
  PartnerRespondRequest,
} from '../types/partner';
import { invalidateFinancialQueries, queryKeys } from '../lib/queryClient';

/** "Berbagi Dompet" links in both directions (owned + incoming). */
export function usePartners() {
  return useQuery({
    queryKey: queryKeys.partners.all,
    queryFn: listPartners,
  });
}

export function useInvitePartner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: PartnerInviteRequest) => invitePartner(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.partners.all });
    },
  });
}

/**
 * Accept/reject an incoming invite. Joining fans out read-only wallet shares,
 * so wallet-dependent queries must refetch too.
 */
export function useRespondPartner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: PartnerRespondRequest }) =>
      respondPartner(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.partners.all });
      invalidateFinancialQueries(qc);
    },
  });
}

/**
 * Revoke a link (either party). Removes the auto-granted viewer wallet shares,
 * so wallet-dependent queries must refetch too.
 */
export function useRevokePartner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => revokePartner(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.partners.all });
      invalidateFinancialQueries(qc);
    },
  });
}
