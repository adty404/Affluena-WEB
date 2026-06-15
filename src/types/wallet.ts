export type WalletType = 'cash' | 'bank' | 'e_wallet' | 'investment' | 'goal';
export type WalletShareStatus = 'pending' | 'joined' | 'rejected';

export type WalletMember = {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'editor' | 'viewer';
  status: WalletShareStatus;
};

export type Wallet = {
  id: string;
  name: string;
  type: WalletType;
  balance: number;
  currency: 'IDR';
  color: 'green' | 'blue' | 'orange' | 'purple' | 'gray';
  isShared: boolean;
  memberCount: number;
  monthlyInflow: number;
  monthlyOutflow: number;
  lastActivity: string;
  description: string;
  members: WalletMember[];
};
