export type Tag = {
  id: string;
  name: string;
  color: 'green' | 'blue' | 'orange' | 'purple' | 'red' | 'gray';
  transactionCount: number;
  totalAmount: number;
  lastUsed: string;
};
