export type SessionStatus = 'current' | 'trusted' | 'signed_out';
export type PreferenceTone = 'green' | 'blue' | 'orange' | 'purple' | 'gray' | 'red';

export type AccountSession = {
  id: string;
  device: string;
  location: string;
  browser: string;
  lastActive: string;
  status: SessionStatus;
};

export type LoginHistoryItem = {
  id: string;
  time: string;
  device: string;
  location: string;
  status: 'success' | 'blocked' | 'review';
};

export interface NotificationRule {
  id: string;
  user_id: string;
  rule_key: string;
  title: string;
  description: string;
  enabled: boolean;
  channel: 'email' | 'in-app' | 'both';
  tone: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationRulesResponse {
  rules: NotificationRule[];
}

export interface NotificationRuleUpdate {
  enabled?: boolean;
  channel?: 'email' | 'in-app' | 'both';
}

export type FAQItem = {
  id: string;
  question: string;
  answer: string;
};
