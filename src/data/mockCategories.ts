import type { Category } from '../types/category';

export const mockCategories: Category[] = [
  {
    id: 'food', name: 'Food & Drink', type: 'expense', icon: '🍽', color: 'orange', monthlyUsage: 1798000, transactionCount: 42,
    children: [
      { id: 'groceries', name: 'Groceries', type: 'expense', icon: '🛒', color: 'green', parentId: 'food', monthlyUsage: 900000, transactionCount: 16 },
      { id: 'coffee', name: 'Coffee', type: 'expense', icon: '☕', color: 'orange', parentId: 'food', monthlyUsage: 248000, transactionCount: 9 },
      { id: 'delivery', name: 'Food Delivery', type: 'expense', icon: '🛵', color: 'red', parentId: 'food', monthlyUsage: 650000, transactionCount: 17 },
    ],
  },
  {
    id: 'transport', name: 'Transportation', type: 'expense', icon: '🚕', color: 'blue', monthlyUsage: 1284000, transactionCount: 26,
    children: [
      { id: 'train', name: 'Train & LRT', type: 'expense', icon: '🚆', color: 'blue', parentId: 'transport', monthlyUsage: 640000, transactionCount: 20 },
      { id: 'ride', name: 'Ride Hailing', type: 'expense', icon: '🏍', color: 'purple', parentId: 'transport', monthlyUsage: 420000, transactionCount: 4 },
    ],
  },
  { id: 'salary', name: 'Salary', type: 'income', icon: '💼', color: 'green', monthlyUsage: 9600000, transactionCount: 1 },
  { id: 'freelance', name: 'Freelance', type: 'income', icon: '💻', color: 'purple', monthlyUsage: 2500000, transactionCount: 3 },
  { id: 'shopping', name: 'Shopping', type: 'expense', icon: '🛍', color: 'red', monthlyUsage: 1248000, transactionCount: 12 },
];

export const flatCategories: Category[] = mockCategories.flatMap((category) => [category, ...(category.children ?? [])]);
