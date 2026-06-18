export type GoalStatus = 'active' | 'at_risk' | 'completed';

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
  created_at: string;
  updated_at: string;
  members?: GoalMember[];
};
