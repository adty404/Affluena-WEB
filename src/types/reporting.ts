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

export type ExportJob = {
  id: string;
  name: string;
  module: string;
  period: string;
  format: 'CSV' | 'XLSX';
  status: 'ready' | 'processing' | 'failed';
  rows: number;
  requestedAt: string;
  size: string;
};

export type ActivityEvent = {
  id: string;
  actor: string;
  action: string;
  module: string;
  description: string;
  timestamp: string;
  severity: Severity;
};

export type AlertMessage = {
  id: string;
  title: string;
  module: string;
  description: string;
  timestamp: string;
  severity: Severity;
  read: boolean;
  actionTo: string;
};

export type SystemLog = {
  id: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  statusCode: number;
  latencyMs: number;
  user: string;
  timestamp: string;
  module: string;
};
