/**
 * "Berbagi Dompet" (wallet-history sharing) — account-level, one-way,
 * read-only share links. The API endpoints live under `/api/v1/partners` for
 * historical reasons; the user-facing feature name is "Berbagi Dompet".
 */

/** 'owned' = I invited this person to view my wallets; 'incoming' = they share theirs with me. */
export type PartnerDirection = 'owned' | 'incoming';
export type PartnerStatus = 'pending' | 'joined' | 'rejected';

/** A share link as seen by the caller; user_id/email/name are the OTHER party. */
export type PartnerLink = {
  id: string;
  direction: PartnerDirection;
  status: PartnerStatus;
  user_id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type PartnersResponse = {
  /** The API may serialize an empty list as null — read defensively. */
  partners: PartnerLink[] | null;
};

export type PartnerInviteRequest = {
  email: string;
};

export type PartnerRespondRequest = {
  status: Extract<PartnerStatus, 'joined' | 'rejected'>;
};

/** At most 5 active (pending/joined) outgoing viewers per owner. */
export const MAX_PARTNER_SHARES = 5;
