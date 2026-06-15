
import type { Goal } from '../types/goal';

export const mockGoals: Goal[] = [
  {
    id: 'goal-emergency-fund',
    name: 'Emergency Fund',
    targetAmount: 30000000,
    currentAmount: 18500000,
    deadline: '2026-12-31',
    walletName: 'Emergency Fund',
    visibility: 'private',
    status: 'active',
    icon: 'goal',
    note: 'Dana darurat untuk minimal enam bulan kebutuhan pokok.',
    members: [
      { id: 'member-aditya', name: 'Aditya Prasetyo', role: 'owner', contributionAmount: 18500000, status: 'joined' },
    ],
    contributions: [
      { id: 'contrib-001', date: '2026-06-01', walletName: 'Bank BCA', amount: 2500000, note: 'Monthly emergency saving' },
      { id: 'contrib-002', date: '2026-05-01', walletName: 'Bank BCA', amount: 2000000, note: 'Monthly emergency saving' },
    ],
  },
  {
    id: 'goal-new-laptop',
    name: 'New Laptop',
    targetAmount: 22000000,
    currentAmount: 9600000,
    deadline: '2026-10-15',
    walletName: 'Investment Pocket',
    visibility: 'private',
    status: 'active',
    icon: 'investment',
    note: 'Upgrade laptop kerja tanpa mengganggu budget bulanan.',
    members: [
      { id: 'member-aditya', name: 'Aditya Prasetyo', role: 'owner', contributionAmount: 9600000, status: 'joined' },
    ],
    contributions: [
      { id: 'contrib-003', date: '2026-06-10', walletName: 'Bank BCA', amount: 1500000, note: 'Laptop fund contribution' },
      { id: 'contrib-004', date: '2026-05-10', walletName: 'Bank BCA', amount: 1500000, note: 'Laptop fund contribution' },
    ],
  },
  {
    id: 'goal-vacation',
    name: 'Family Vacation',
    targetAmount: 18000000,
    currentAmount: 5200000,
    deadline: '2026-09-30',
    walletName: 'Shared Vacation Wallet',
    visibility: 'shared',
    status: 'at_risk',
    icon: 'transport',
    note: 'Shared goal untuk liburan keluarga. Butuh kontribusi rutin agar tetap on track.',
    members: [
      { id: 'member-aditya', name: 'Aditya Prasetyo', role: 'owner', contributionAmount: 4000000, status: 'joined' },
      { id: 'member-rina', name: 'Rina', role: 'contributor', contributionAmount: 1200000, status: 'joined' },
      { id: 'member-ari', name: 'Ari', role: 'viewer', contributionAmount: 0, status: 'pending' },
    ],
    contributions: [
      { id: 'contrib-005', date: '2026-06-12', walletName: 'Bank BCA', amount: 1000000, note: 'Vacation contribution' },
      { id: 'contrib-006', date: '2026-05-12', walletName: 'Bank BCA', amount: 800000, note: 'Vacation contribution' },
    ],
  },
];

export const goalSummary = {
  totalTarget: mockGoals.reduce((sum, goal) => sum + goal.targetAmount, 0),
  totalSaved: mockGoals.reduce((sum, goal) => sum + goal.currentAmount, 0),
  active: mockGoals.filter((goal) => goal.status === 'active').length,
  shared: mockGoals.filter((goal) => goal.visibility === 'shared').length,
};
