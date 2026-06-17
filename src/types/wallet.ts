export type WalletType = 'cash' | 'bank' | 'e_wallet' | 'investment' | 'goal';
export type WalletRole = 'owner' | 'editor' | 'viewer' | 'member';
export type WalletShareStatus = 'pending' | 'joined' | 'rejected';

export type WalletColor = 'green' | 'blue' | 'orange' | 'purple' | 'gray' | '';

export type WalletMember = {
  wallet_id: string;
  user_id: string;
  email: string;
  role: string;
  status: WalletShareStatus;
  created_at: string;
  updated_at: string;
};

export type Wallet = {
  id: string;
  user_id: string;
  name: string;
  type: WalletType;
  currency_code: string;
  balance_minor: number;
  color: string;
  description: string;
  role?: WalletRole;
  share_status?: WalletShareStatus;
  created_at: string;
  updated_at: string;
  members?: WalletMember[];
};

export type WalletAnalytics = {
  wallet_id: string;
  month: string;
  inflow_minor: number;
  outflow_minor: number;
  transaction_count: number;
  last_activity_at?: string;
};

export type WalletListResponse = {
  wallets: Wallet[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
};

export type WalletMembersResponse = {
  members: WalletMember[];
};

export type WalletCreateRequest = {
  name: string;
  type: Exclude<WalletType, 'goal'>;
  currency_code: string;
  balance_minor: number;
  color?: string;
  description?: string;
};

export type WalletUpdateRequest = {
  name: string;
  type: Exclude<WalletType, 'goal'>;
  currency_code: string;
  color?: string;
  description?: string;
};

export type WalletInviteRequest = {
  email: string;
};

export type WalletMemberResponse = {
  status: WalletShareStatus;
};
