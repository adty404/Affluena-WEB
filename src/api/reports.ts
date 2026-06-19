import { apiFetch } from './client';
import { ReportResponse } from '../types/reporting';

export const getIncomeReport = async (month: string): Promise<ReportResponse> => {
  return apiFetch(`/api/v1/reports/income?month=${month}`);
};

export const getExpenseReport = async (month: string): Promise<ReportResponse> => {
  return apiFetch(`/api/v1/reports/expense?month=${month}`);
};

export const getCashflowReport = async (month: string): Promise<ReportResponse> => {
  return apiFetch(`/api/v1/reports/cashflow?month=${month}`);
};

export const getDebtReport = async (month: string): Promise<ReportResponse> => {
  return apiFetch(`/api/v1/reports/debt?month=${month}`);
};

export const getGoalReport = async (month: string): Promise<ReportResponse> => {
  return apiFetch(`/api/v1/reports/goal?month=${month}`);
};

export const getReportsOverview = async (month: string): Promise<ReportResponse> => {
  return apiFetch(`/api/v1/reports/overview?month=${month}`);
};
