export type GoalStatus = 'active' | 'achieved' | 'cancelled';

export type GoalMember = {
  goal_id: string;
  user_id: string;
  status: 'joined' | 'pending' | 'rejected';
  created_at: string;
  updated_at: string;
};

export type Goal = {
  id: string;
  user_id: string;
  name: string;
  target_amount_minor: number;
  collected_amount_minor: number;
  deadline?: string;
  status: GoalStatus;
  /** Optional UI metadata: `#RRGGBB` hex, '' = no color. */
  color?: string;
  /** Optional UI metadata: client-defined semantic icon id, '' = default icon. */
  icon?: string;
  created_at: string;
  updated_at: string;
  members?: GoalMember[];
};
