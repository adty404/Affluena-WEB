
export type GoalStatus = 'active' | 'at_risk' | 'completed';
export type GoalVisibility = 'private' | 'shared';

export type GoalMember = {
  id: string;
  name: string;
  role: 'owner' | 'contributor' | 'viewer';
  contributionAmount: number;
  status: 'joined' | 'pending';
};

export type GoalContribution = {
  id: string;
  date: string;
  walletName: string;
  amount: number;
  note: string;
};

export type Goal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  walletName: string;
  visibility: GoalVisibility;
  status: GoalStatus;
  icon: 'goal' | 'cash' | 'investment' | 'transport' | 'shopping';
  note: string;
  members: GoalMember[];
  contributions: GoalContribution[];
};
