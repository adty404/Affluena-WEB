import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryClient';
import {
  getIncomeReport,
  getExpenseReport,
  getCashflowReport,
  getDebtReport,
  getGoalReport,
  getReportsOverview,
} from '../api/reports';

export const useIncomeReport = (month: string) => {
  return useQuery({
    queryKey: queryKeys.reports.income(month),
    queryFn: () => getIncomeReport(month),
  });
};

export const useExpenseReport = (month: string) => {
  return useQuery({
    queryKey: queryKeys.reports.expense(month),
    queryFn: () => getExpenseReport(month),
  });
};

export const useCashflowReport = (month: string) => {
  return useQuery({
    queryKey: queryKeys.reports.cashflow(month),
    queryFn: () => getCashflowReport(month),
  });
};

export const useDebtReport = (month: string) => {
  return useQuery({
    queryKey: queryKeys.reports.debt(month),
    queryFn: () => getDebtReport(month),
  });
};

export const useGoalReport = (month: string) => {
  return useQuery({
    queryKey: queryKeys.reports.goal(month),
    queryFn: () => getGoalReport(month),
  });
};

export const useReportsOverview = (month: string) => {
  return useQuery({
    queryKey: queryKeys.reports.overview(month),
    queryFn: () => getReportsOverview(month),
  });
};
