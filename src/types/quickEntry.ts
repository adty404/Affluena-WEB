import type { Transaction } from './transaction';

export interface QuickEntryTemplate {
  id: string;
  user_id: string;
  name: string;
  type: string;
  wallet_id: string;
  to_wallet_id?: string;
  category_id?: string;
  amount_minor: number;
  note: string;
  created_at: string;
  updated_at: string;
}

export interface QuickEntryTemplateListResponse {
  templates: QuickEntryTemplate[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}
