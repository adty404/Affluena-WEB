import type { Wallet } from '../types/wallet';

const now = new Date().toISOString();

export const mockWallets: Wallet[] = [
  {
    id: 'mock-bca',
    user_id: 'mock-user',
    name: 'Bank BCA',
    type: 'bank',
    currency_code: 'IDR',
    balance_minor: 18500000,
    role: 'owner',
    share_status: 'joined',
    created_at: now,
    updated_at: now,
  },
  {
    id: 'mock-cash',
    user_id: 'mock-user',
    name: 'Cash Wallet',
    type: 'cash',
    currency_code: 'IDR',
    balance_minor: 1250000,
    role: 'owner',
    share_status: 'joined',
    created_at: now,
    updated_at: now,
  },
  {
    id: 'mock-shared',
    user_id: 'mock-user-other',
    name: 'Family Shared',
    type: 'e_wallet',
    currency_code: 'IDR',
    balance_minor: 4750000,
    role: 'editor',
    share_status: 'joined',
    created_at: now,
    updated_at: now,
  },
  {
    id: 'mock-investment',
    user_id: 'mock-user',
    name: 'Investment Pocket',
    type: 'investment',
    currency_code: 'IDR',
    balance_minor: 12400000,
    role: 'owner',
    share_status: 'joined',
    created_at: now,
    updated_at: now,
  },
];
