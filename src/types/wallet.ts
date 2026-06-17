export type WalletType = 'cash' | 'bank' | 'e_wallet' | 'investment' | 'goal';
export type WalletRole = 'owner' | 'editor' | 'viewer';
export type WalletShareStatus = 'pending' | 'joined' | 'rejected';

export type Wallet = {
  id: string;
  user_id: string;
  name: string;
  type: WalletType;
  currency_code: string;
  balance_minor: number;
  role?: WalletRole;
  share_status?: WalletShareStatus;
  created_at: string;
  updated_at: string;
};

export type WalletListResponse = {
  wallets: Wallet[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
};

export type WalletCreateRequest = {
  name: string;
  type: Exclude<WalletType, 'goal'>;
  currency_code: string;
  balance_minor: number;
};

export type WalletUpdateRequest = {
  name: string;
  type: Exclude<WalletType, 'goal'>;
  currency_code: string;
};

export type WalletInviteRequest = {
  email: string;
};

export type WalletMemberResponse = {
  status: WalletShareStatus;
};
