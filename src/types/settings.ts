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

export type NotificationRule = {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  channel: 'email' | 'in-app' | 'both';
  tone: PreferenceTone;
};

export type FAQItem = {
  id: string;
  question: string;
  answer: string;
};
