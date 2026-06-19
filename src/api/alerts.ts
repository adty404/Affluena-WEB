import { apiFetch } from './client';
import type { Alert, AlertsResponse } from '../types/reporting';

export async function getAlerts(month?: string): Promise<AlertsResponse> {
  const query: Record<string, string> = {};
  if (month) {
    query.month = month;
  } else {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    query.month = `${yyyy}-${mm}`;
  }
  return apiFetch<AlertsResponse>('/api/v1/alerts', { query });
}

export async function getAlert(id: string): Promise<Alert> {
  return apiFetch<Alert>(`/api/v1/alerts/${id}`);
}
