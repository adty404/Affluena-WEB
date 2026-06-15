import type { Wallet } from '../types/wallet';

export const mockWallets: Wallet[] = [
  {
    id: '1', name: 'Bank BCA', type: 'bank', balance: 18500000, currency: 'IDR', color: 'green', isShared: false, memberCount: 1,
    monthlyInflow: 9600000, monthlyOutflow: 4200000, lastActivity: '14 Jun 2026, 13:24', description: 'Main operational wallet for salary, transfers, and recurring payments.',
    members: [{ id: 'm1', name: 'Aditya Prasetyo', email: 'adty404@gmail.com', role: 'owner', status: 'joined' }],
  },
  {
    id: '2', name: 'Cash Wallet', type: 'cash', balance: 1250000, currency: 'IDR', color: 'blue', isShared: false, memberCount: 1,
    monthlyInflow: 2500000, monthlyOutflow: 2100000, lastActivity: 'Today, 09:10', description: 'Daily cash spending wallet.',
    members: [{ id: 'm1', name: 'Aditya Prasetyo', email: 'adty404@gmail.com', role: 'owner', status: 'joined' }],
  },
  {
    id: '3', name: 'Family Shared', type: 'e_wallet', balance: 4750000, currency: 'IDR', color: 'purple', isShared: true, memberCount: 3,
    monthlyInflow: 3200000, monthlyOutflow: 1750000, lastActivity: 'Yesterday, 20:41', description: 'Shared wallet for family spending and split bills.',
    members: [
      { id: 'm1', name: 'Aditya Prasetyo', email: 'adty404@gmail.com', role: 'owner', status: 'joined' },
      { id: 'm2', name: 'Nadia', email: 'nadia@example.com', role: 'editor', status: 'joined' },
      { id: 'm3', name: 'Raka', email: 'raka@example.com', role: 'viewer', status: 'pending' },
    ],
  },
  {
    id: '4', name: 'Investment Pocket', type: 'investment', balance: 12400000, currency: 'IDR', color: 'orange', isShared: false, memberCount: 1,
    monthlyInflow: 1500000, monthlyOutflow: 0, lastActivity: '12 Jun 2026', description: 'Long term investment pocket.',
    members: [{ id: 'm1', name: 'Aditya Prasetyo', email: 'adty404@gmail.com', role: 'owner', status: 'joined' }],
  },
];

export const walletTypeLabels: Record<Wallet['type'], string> = {
  cash: 'Cash', bank: 'Bank', e_wallet: 'E-Wallet', investment: 'Investment', goal: 'Goal Wallet',
};
