export type CategoryType = 'income' | 'expense';

export type Category = {
  id: string;
  name: string;
  type: CategoryType;
  icon: string;
  color: 'green' | 'blue' | 'orange' | 'purple' | 'red' | 'gray';
  parentId?: string;
  monthlyUsage: number;
  transactionCount: number;
  children?: Category[];
};
