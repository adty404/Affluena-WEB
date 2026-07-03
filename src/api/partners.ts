import { apiFetch } from './client';
import type {
  PartnerInviteRequest,
  PartnerRespondRequest,
  PartnersResponse,
} from '../types/partner';

/**
 * "Berbagi Dompet" endpoints. The backend keeps the historical `/partners`
 * path — do not rename it to match the `/sharing` UI slug.
 */

export function listPartners() {
  return apiFetch<PartnersResponse>('/api/v1/partners');
}

export function invitePartner(payload: PartnerInviteRequest) {
  return apiFetch<void>('/api/v1/partners/invites', {
    method: 'POST',
    body: payload,
  });
}

export function respondPartner(id: string, payload: PartnerRespondRequest) {
  return apiFetch<void>(`/api/v1/partners/${id}`, {
    method: 'PATCH',
    body: payload,
  });
}

export function revokePartner(id: string) {
  return apiFetch<void>(`/api/v1/partners/${id}`, {
    method: 'DELETE',
  });
}
