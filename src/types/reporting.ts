export type ReportPeriod = 'This Month' | 'Last Month' | 'Quarter' | 'Year';
export type Severity = 'info' | 'success' | 'warning' | 'danger';

export type ReportMetric = {
  id: string;
  label: string;
  value: number;
  helper: string;
  tone: 'green' | 'blue' | 'orange' | 'purple' | 'red' | 'gray';
};

export type ReportRow = {
  id: string;
  name: string;
  category: string;
  amount: number;
  previousAmount: number;
  changePercent: number;
  wallet: string;
  status: 'healthy' | 'watch' | 'critical' | 'growth';
};

export interface ExportJob {
  id: string;
  user_id: string;
  format: string;
  from_at: string | null;
  to_at: string | null;
  row_count: number;
  status: 'completed' | 'failed';
  created_at: string;
}

export type ExportJobsResponse = {
  jobs: ExportJob[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
};

export type Activity = {
  id: string;
  user_id: string;
  action_type: string;
  entity_type: string;
  entity_id: string;
  description: string;
  created_at: string;
};

export type ActivityListResponse = {
  data: Activity[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
};

export interface Alert {
  id: string;
  type: 'budget' | 'debt' | 'recurring';
  title: string;
  module: string;
  description: string;
  severity: 'info' | 'success' | 'warning' | 'danger';
  created_at: string;
  action_path: string;
}

export type AlertMessage = Alert;

export type AlertsResponse = {
  alerts: Alert[];
};

export type SystemLog = {
  id: string;
  method: string;
  path: string;
  status_code: number;
  latency_ms: number;
  client_ip: string;
  user_agent: string;
  user_id: string;
  request_payload: Record<string, unknown> | null;
  response_payload: Record<string, unknown> | null;
  created_at: string;
};

export type SystemLogsResponse = {
  logs: SystemLog[];
};
