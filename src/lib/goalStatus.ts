import type { GoalMember, GoalStatus } from '../types/goal';

type BadgeTone = 'green' | 'blue' | 'orange' | 'purple' | 'gray' | 'red';
type ProgressTone = 'green' | 'orange';

// The API/DB stores goal status as one of: active | achieved | cancelled.
// These helpers keep label, badge tone, and progress tone consistent across
// every goal surface (list, detail, form, cards) so the UI never invents
// statuses the backend does not return.
export const GOAL_STATUSES: GoalStatus[] = ['active', 'achieved', 'cancelled'];

const STATUS_LABEL: Record<GoalStatus, string> = {
  active: 'Active',
  achieved: 'Achieved',
  cancelled: 'Cancelled',
};

const STATUS_BADGE_TONE: Record<GoalStatus, BadgeTone> = {
  active: 'blue',
  achieved: 'green',
  cancelled: 'gray',
};

export function goalStatusLabel(status: GoalStatus): string {
  return STATUS_LABEL[status] ?? status;
}

export function goalStatusBadgeTone(status: GoalStatus): BadgeTone {
  return STATUS_BADGE_TONE[status] ?? 'gray';
}

export function goalProgressTone(status: GoalStatus): ProgressTone {
  return status === 'achieved' ? 'green' : status === 'cancelled' ? 'orange' : 'green';
}

// Goal members mirror mobile: the API only returns the raw user id (no
// name/email), so surface a short, stable reference derived from that id and
// the same Indonesian status labels the mobile app uses.
const MEMBER_STATUS_LABEL: Record<GoalMember['status'], string> = {
  pending: 'Menunggu',
  joined: 'Bergabung',
  rejected: 'Ditolak',
};

const MEMBER_STATUS_TONE: Record<GoalMember['status'], BadgeTone> = {
  pending: 'orange',
  joined: 'green',
  rejected: 'red',
};

export function goalMemberStatusLabel(status: GoalMember['status']): string {
  return MEMBER_STATUS_LABEL[status] ?? status;
}

export function goalMemberStatusTone(status: GoalMember['status']): BadgeTone {
  return MEMBER_STATUS_TONE[status] ?? 'gray';
}

/** "Kamu" for the signed-in user, otherwise "Anggota <first 8 of user id>". */
export function goalMemberLabel(member: GoalMember, currentUserId?: string): string {
  if (currentUserId && member.user_id === currentUserId) return 'Kamu';
  const trimmed = member.user_id.trim();
  if (!trimmed) return 'Anggota';
  return `Anggota ${trimmed.slice(0, 8)}`;
}
