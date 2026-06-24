import type { GoalStatus } from '../types/goal';

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
