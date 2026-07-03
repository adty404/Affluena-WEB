export type WalletType = 'cash' | 'bank' | 'e_wallet' | 'investment' | 'goal';
export type WalletRole = 'owner' | 'member' | 'viewer';
export type WalletShareStatus = 'pending' | 'joined' | 'rejected';

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
  /** Optional UI metadata: `#RRGGBB` hex (or legacy color name), '' = no color. */
  color: string;
  /** Optional UI metadata: client-defined semantic icon id, '' = default icon. */
  icon?: string;
  description: string;
  /** Set on `goal`-type wallets; links the wallet back to its parent goal. Omitted by the API for non-goal wallets. */
  goal_id?: string | null;
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
  icon?: string;
  description?: string;
};

export type WalletUpdateRequest = {
  name: string;
  type: Exclude<WalletType, 'goal'>;
  currency_code: string;
  color?: string;
  icon?: string;
  description?: string;
};

export type WalletInviteRequest = {
  email: string;
  /** 'member' (read+write, API default) or 'viewer' (read-only). */
  role?: Extract<WalletRole, 'member' | 'viewer'>;
};

export type WalletMemberResponse = {
  status: WalletShareStatus;
};
