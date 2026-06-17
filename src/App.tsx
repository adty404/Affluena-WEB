import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { RequireAuth } from './components/routing/RequireAuth';
import { LandingPage } from './pages/landing/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { OnboardingPage } from './pages/auth/OnboardingPage';
import { AppShellPage } from './pages/app/AppShellPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { AnalyticsPage } from './pages/dashboard/AnalyticsPage';
import { ForecastPage } from './pages/dashboard/ForecastPage';
import { WidgetStatesPage } from './pages/dashboard/WidgetStatesPage';
import { WalletListPage } from './pages/wallets/WalletListPage';
import { WalletFormPage } from './pages/wallets/WalletFormPage';
import { WalletDetailPage } from './pages/wallets/WalletDetailPage';
import { WalletSharingPage } from './pages/wallets/WalletSharingPage';
import { CategoryListPage } from './pages/categories/CategoryListPage';
import { CategoryFormPage } from './pages/categories/CategoryFormPage';
import { TagListPage } from './pages/tags/TagListPage';
import { TagFormPage } from './pages/tags/TagFormPage';
import { TransactionListPage } from './pages/transactions/TransactionListPage';
import { TransactionFormPage } from './pages/transactions/TransactionFormPage';
import { TransferPage } from './pages/transactions/TransferPage';
import { AdjustmentPage } from './pages/transactions/AdjustmentPage';
import { TransactionDetailPage } from './pages/transactions/TransactionDetailPage';
import { TransactionFilterPage } from './pages/transactions/TransactionFilterPage';
import { SplitBillPage } from './pages/transactions/SplitBillPage';
import { QuickEntryPage } from './pages/quick-entry/QuickEntryPage';
import { QuickEntryFormPage } from './pages/quick-entry/QuickEntryFormPage';
import { BudgetListPage } from './pages/budgets/BudgetListPage';
import { BudgetFormPage } from './pages/budgets/BudgetFormPage';
import { BudgetDetailPage } from './pages/budgets/BudgetDetailPage';
import { BudgetAlertsPage } from './pages/budgets/BudgetAlertsPage';
import { BudgetReportPage } from './pages/budgets/BudgetReportPage';
import { ProfileSettingsPage } from './pages/settings/ProfileSettingsPage';

import { SettingsOverviewPage } from './pages/settings/SettingsOverviewPage';
import { AccountSettingsPage } from './pages/settings/AccountSettingsPage';
import { SecuritySettingsPage } from './pages/settings/SecuritySettingsPage';
import { SessionsPage } from './pages/settings/SessionsPage';
import { NotificationsPage } from './pages/settings/NotificationsPage';
import { PreferencesPage } from './pages/settings/PreferencesPage';
import { PrivacyPage } from './pages/settings/PrivacyPage';
import { DataSettingsPage } from './pages/settings/DataSettingsPage';
import { HelpPage } from './pages/settings/HelpPage';
import { AboutPage } from './pages/settings/AboutPage';
import { UIAuditPage } from './pages/settings/UIAuditPage';
import { AppMenuPage } from './pages/app-menu/AppMenuPage';

import { DebtListPage } from './pages/debts/DebtListPage';
import { DebtFormPage } from './pages/debts/DebtFormPage';
import { DebtDetailPage } from './pages/debts/DebtDetailPage';
import { DebtPaymentPage } from './pages/debts/DebtPaymentPage';
import { TrackerPage } from './pages/debts/TrackerPage';
import { InstallmentListPage } from './pages/installments/InstallmentListPage';
import { InstallmentFormPage } from './pages/installments/InstallmentFormPage';
import { InstallmentPaymentPage } from './pages/installments/InstallmentPaymentPage';
import { SubscriptionListPage } from './pages/subscriptions/SubscriptionListPage';
import { SubscriptionFormPage } from './pages/subscriptions/SubscriptionFormPage';
import { SubscriptionPaymentPage } from './pages/subscriptions/SubscriptionPaymentPage';
import { RecurringListPage } from './pages/recurring/RecurringListPage';
import { RecurringFormPage } from './pages/recurring/RecurringFormPage';
import { RecurringDetailPage } from './pages/recurring/RecurringDetailPage';
import { RecurringRunPage } from './pages/recurring/RecurringRunPage';
import { RecurringHistoryPage } from './pages/recurring/RecurringHistoryPage';
import { GoalListPage } from './pages/goals/GoalListPage';
import { GoalFormPage } from './pages/goals/GoalFormPage';
import { GoalDetailPage } from './pages/goals/GoalDetailPage';
import { GoalContributionPage } from './pages/goals/GoalContributionPage';
import { GoalMembersPage } from './pages/goals/GoalMembersPage';
import { ReportsOverviewPage } from './pages/reports/ReportsOverviewPage';
import { CashflowReportPage } from './pages/reports/CashflowReportPage';
import { ExpenseReportPage } from './pages/reports/ExpenseReportPage';
import { IncomeReportPage } from './pages/reports/IncomeReportPage';
import { BudgetReportCenterPage } from './pages/reports/BudgetReportCenterPage';
import { DebtReportPage } from './pages/reports/DebtReportPage';
import { GoalReportPage } from './pages/reports/GoalReportPage';
import { ExportCenterPage } from './pages/exports/ExportCenterPage';
import { ExportNewPage } from './pages/exports/ExportNewPage';
import { ExportDetailPage } from './pages/exports/ExportDetailPage';
import { ActivityListPage } from './pages/activities/ActivityListPage';
import { ActivityDetailPage } from './pages/activities/ActivityDetailPage';
import { AlertListPage } from './pages/alerts/AlertListPage';
import { AlertDetailPage } from './pages/alerts/AlertDetailPage';
import { SystemLogListPage } from './pages/system-logs/SystemLogListPage';
import { SystemLogDetailPage } from './pages/system-logs/SystemLogDetailPage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route element={<RequireAuth><Outlet /></RequireAuth>}>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
      <Route path="/dashboard/forecast" element={<ForecastPage />} />
      <Route path="/dashboard/widget-states" element={<WidgetStatesPage />} />

      <Route path="/wallets" element={<WalletListPage />} />
      <Route path="/wallets/new" element={<WalletFormPage />} />
      <Route path="/wallets/:id" element={<WalletDetailPage />} />
      <Route path="/wallets/:id/edit" element={<WalletFormPage />} />
      <Route path="/wallets/:id/sharing" element={<WalletSharingPage />} />
      <Route path="/categories" element={<CategoryListPage />} />
      <Route path="/categories/new" element={<CategoryFormPage />} />
      <Route path="/categories/:id/edit" element={<CategoryFormPage />} />
      <Route path="/tags" element={<TagListPage />} />
      <Route path="/tags/new" element={<TagFormPage />} />
      <Route path="/tags/:id/edit" element={<TagFormPage />} />

      <Route path="/transactions" element={<TransactionListPage />} />
      <Route path="/transactions/new" element={<TransactionFormPage />} />
      <Route path="/transactions/transfer" element={<TransferPage />} />
      <Route path="/transactions/adjustment" element={<AdjustmentPage />} />
      <Route path="/transactions/filter" element={<TransactionFilterPage />} />
      <Route path="/transactions/split" element={<SplitBillPage />} />
      <Route path="/transactions/:id/edit" element={<TransactionFormPage />} />
      <Route path="/transactions/:id" element={<TransactionDetailPage />} />
      <Route path="/quick-entry" element={<QuickEntryPage />} />
      <Route path="/quick-entry/new" element={<QuickEntryFormPage />} />
      <Route path="/quick-entry/:id/edit" element={<QuickEntryFormPage />} />

      <Route path="/budgets" element={<BudgetListPage />} />
      <Route path="/budgets/new" element={<BudgetFormPage />} />
      <Route path="/budgets/alerts" element={<BudgetAlertsPage />} />
      <Route path="/budgets/report" element={<BudgetReportPage />} />
      <Route path="/budgets/:id/edit" element={<BudgetFormPage />} />
      <Route path="/budgets/:id" element={<BudgetDetailPage />} />

      <Route path="/tracker" element={<TrackerPage />} />
      <Route path="/debts" element={<DebtListPage />} />
      <Route path="/debts/new/payable" element={<DebtFormPage />} />
      <Route path="/debts/new/receivable" element={<DebtFormPage />} />
      <Route path="/debts/:id/pay" element={<DebtPaymentPage />} />
      <Route path="/debts/:id" element={<DebtDetailPage />} />
      <Route path="/installments" element={<InstallmentListPage />} />
      <Route path="/installments/new" element={<InstallmentFormPage />} />
      <Route path="/installments/:id/pay" element={<InstallmentPaymentPage />} />
      <Route path="/subscriptions" element={<SubscriptionListPage />} />
      <Route path="/subscriptions/new" element={<SubscriptionFormPage />} />
      <Route path="/subscriptions/:id/pay" element={<SubscriptionPaymentPage />} />

      <Route path="/recurring" element={<RecurringListPage />} />
      <Route path="/recurring/new" element={<RecurringFormPage />} />
      <Route path="/recurring/:id/edit" element={<RecurringFormPage />} />
      <Route path="/recurring/:id/run" element={<RecurringRunPage />} />
      <Route path="/recurring/:id/history" element={<RecurringHistoryPage />} />
      <Route path="/recurring/:id" element={<RecurringDetailPage />} />

      <Route path="/goals" element={<GoalListPage />} />
      <Route path="/goals/new" element={<GoalFormPage />} />
      <Route path="/goals/:id/edit" element={<GoalFormPage />} />
      <Route path="/goals/:id/contribute" element={<GoalContributionPage />} />
      <Route path="/goals/:id/members" element={<GoalMembersPage />} />
      <Route path="/goals/:id" element={<GoalDetailPage />} />

<Route path="/reports" element={<ReportsOverviewPage />} />
<Route path="/reports/cashflow" element={<CashflowReportPage />} />
<Route path="/reports/expenses" element={<ExpenseReportPage />} />
<Route path="/reports/income" element={<IncomeReportPage />} />
<Route path="/reports/budgets" element={<BudgetReportCenterPage />} />
<Route path="/reports/debts" element={<DebtReportPage />} />
<Route path="/reports/goals" element={<GoalReportPage />} />
<Route path="/exports" element={<ExportCenterPage />} />
<Route path="/exports/new" element={<ExportNewPage />} />
<Route path="/exports/history" element={<ExportCenterPage />} />
<Route path="/exports/:id" element={<ExportDetailPage />} />
<Route path="/activities" element={<ActivityListPage />} />
<Route path="/activities/:id" element={<ActivityDetailPage />} />
<Route path="/alerts" element={<AlertListPage />} />
<Route path="/alerts/:id" element={<AlertDetailPage />} />
<Route path="/system-logs" element={<SystemLogListPage />} />
<Route path="/system-logs/:id" element={<SystemLogDetailPage />} />
      <Route path="/settings" element={<SettingsOverviewPage />} />
      <Route path="/settings/profile" element={<ProfileSettingsPage />} />
      <Route path="/settings/account" element={<AccountSettingsPage />} />
      <Route path="/settings/security" element={<SecuritySettingsPage />} />
      <Route path="/settings/sessions" element={<SessionsPage />} />
      <Route path="/settings/notifications" element={<NotificationsPage />} />
      <Route path="/settings/preferences" element={<PreferencesPage />} />
      <Route path="/settings/privacy" element={<PrivacyPage />} />
      <Route path="/settings/data" element={<DataSettingsPage />} />
      <Route path="/settings/help" element={<HelpPage />} />
      <Route path="/settings/about" element={<AboutPage />} />
      <Route path="/settings/ui-audit" element={<UIAuditPage />} />
      <Route path="/app-menu" element={<AppMenuPage />} />
      <Route path="/app-shell" element={<AppShellPage />} />
      <Route path="/app" element={<Navigate to="/dashboard" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
