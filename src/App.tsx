import { lazy, Suspense } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { PublicOnlyRoute } from './components/routing/PublicOnlyRoute';
import { RequireAuth } from './components/routing/RequireAuth';
import { Card } from './components/ui/Card';

// Eagerly loaded: critical first-paint pages
import { LandingPage } from './pages/landing/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { OnboardingPage } from './pages/auth/OnboardingPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { AppShellPage } from './pages/app/AppShellPage';

// Lazy-loaded: domain chunks
const AnalyticsPage = lazy(() => import('./pages/dashboard/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })));
const ForecastPage = lazy(() => import('./pages/dashboard/ForecastPage').then(m => ({ default: m.ForecastPage })));
const WidgetStatesPage = lazy(() => import('./pages/dashboard/WidgetStatesPage').then(m => ({ default: m.WidgetStatesPage })));

const WalletListPage = lazy(() => import('./pages/wallets/WalletListPage').then(m => ({ default: m.WalletListPage })));
const WalletFormPage = lazy(() => import('./pages/wallets/WalletFormPage').then(m => ({ default: m.WalletFormPage })));
const WalletDetailPage = lazy(() => import('./pages/wallets/WalletDetailPage').then(m => ({ default: m.WalletDetailPage })));
const WalletSharingPage = lazy(() => import('./pages/wallets/WalletSharingPage').then(m => ({ default: m.WalletSharingPage })));

const CategoryListPage = lazy(() => import('./pages/categories/CategoryListPage').then(m => ({ default: m.CategoryListPage })));
const CategoryFormPage = lazy(() => import('./pages/categories/CategoryFormPage').then(m => ({ default: m.CategoryFormPage })));

const TagListPage = lazy(() => import('./pages/tags/TagListPage').then(m => ({ default: m.TagListPage })));
const TagFormPage = lazy(() => import('./pages/tags/TagFormPage').then(m => ({ default: m.TagFormPage })));

const TransactionListPage = lazy(() => import('./pages/transactions/TransactionListPage').then(m => ({ default: m.TransactionListPage })));
const TransactionFormPage = lazy(() => import('./pages/transactions/TransactionFormPage').then(m => ({ default: m.TransactionFormPage })));
const TransferPage = lazy(() => import('./pages/transactions/TransferPage').then(m => ({ default: m.TransferPage })));
const AdjustmentPage = lazy(() => import('./pages/transactions/AdjustmentPage').then(m => ({ default: m.AdjustmentPage })));
const TransactionDetailPage = lazy(() => import('./pages/transactions/TransactionDetailPage').then(m => ({ default: m.TransactionDetailPage })));
const TransactionFilterPage = lazy(() => import('./pages/transactions/TransactionFilterPage').then(m => ({ default: m.TransactionFilterPage })));
const SplitBillPage = lazy(() => import('./pages/transactions/SplitBillPage').then(m => ({ default: m.SplitBillPage })));

const QuickEntryPage = lazy(() => import('./pages/quick-entry/QuickEntryPage').then(m => ({ default: m.QuickEntryPage })));
const QuickEntryFormPage = lazy(() => import('./pages/quick-entry/QuickEntryFormPage').then(m => ({ default: m.QuickEntryFormPage })));

const BudgetListPage = lazy(() => import('./pages/budgets/BudgetListPage').then(m => ({ default: m.BudgetListPage })));
const BudgetFormPage = lazy(() => import('./pages/budgets/BudgetFormPage').then(m => ({ default: m.BudgetFormPage })));
const BudgetDetailPage = lazy(() => import('./pages/budgets/BudgetDetailPage').then(m => ({ default: m.BudgetDetailPage })));
const BudgetAlertsPage = lazy(() => import('./pages/budgets/BudgetAlertsPage').then(m => ({ default: m.BudgetAlertsPage })));
const BudgetReportPage = lazy(() => import('./pages/budgets/BudgetReportPage').then(m => ({ default: m.BudgetReportPage })));

const DebtListPage = lazy(() => import('./pages/debts/DebtListPage').then(m => ({ default: m.DebtListPage })));
const DebtFormPage = lazy(() => import('./pages/debts/DebtFormPage').then(m => ({ default: m.DebtFormPage })));
const DebtDetailPage = lazy(() => import('./pages/debts/DebtDetailPage').then(m => ({ default: m.DebtDetailPage })));
const DebtPaymentPage = lazy(() => import('./pages/debts/DebtPaymentPage').then(m => ({ default: m.DebtPaymentPage })));
const TrackerPage = lazy(() => import('./pages/debts/TrackerPage').then(m => ({ default: m.TrackerPage })));

const InstallmentListPage = lazy(() => import('./pages/installments/InstallmentListPage').then(m => ({ default: m.InstallmentListPage })));
const InstallmentFormPage = lazy(() => import('./pages/installments/InstallmentFormPage').then(m => ({ default: m.InstallmentFormPage })));
const InstallmentPaymentPage = lazy(() => import('./pages/installments/InstallmentPaymentPage').then(m => ({ default: m.InstallmentPaymentPage })));

const SubscriptionListPage = lazy(() => import('./pages/subscriptions/SubscriptionListPage').then(m => ({ default: m.SubscriptionListPage })));
const SubscriptionFormPage = lazy(() => import('./pages/subscriptions/SubscriptionFormPage').then(m => ({ default: m.SubscriptionFormPage })));
const SubscriptionPaymentPage = lazy(() => import('./pages/subscriptions/SubscriptionPaymentPage').then(m => ({ default: m.SubscriptionPaymentPage })));

const RecurringListPage = lazy(() => import('./pages/recurring/RecurringListPage').then(m => ({ default: m.RecurringListPage })));
const RecurringFormPage = lazy(() => import('./pages/recurring/RecurringFormPage').then(m => ({ default: m.RecurringFormPage })));
const RecurringDetailPage = lazy(() => import('./pages/recurring/RecurringDetailPage').then(m => ({ default: m.RecurringDetailPage })));
const RecurringRunPage = lazy(() => import('./pages/recurring/RecurringRunPage').then(m => ({ default: m.RecurringRunPage })));
const RecurringHistoryPage = lazy(() => import('./pages/recurring/RecurringHistoryPage').then(m => ({ default: m.RecurringHistoryPage })));

const GoalListPage = lazy(() => import('./pages/goals/GoalListPage').then(m => ({ default: m.GoalListPage })));
const GoalFormPage = lazy(() => import('./pages/goals/GoalFormPage').then(m => ({ default: m.GoalFormPage })));
const GoalDetailPage = lazy(() => import('./pages/goals/GoalDetailPage').then(m => ({ default: m.GoalDetailPage })));
const GoalContributionPage = lazy(() => import('./pages/goals/GoalContributionPage').then(m => ({ default: m.GoalContributionPage })));
const GoalMembersPage = lazy(() => import('./pages/goals/GoalMembersPage').then(m => ({ default: m.GoalMembersPage })));

const ReportsOverviewPage = lazy(() => import('./pages/reports/ReportsOverviewPage').then(m => ({ default: m.ReportsOverviewPage })));
const CashflowReportPage = lazy(() => import('./pages/reports/CashflowReportPage').then(m => ({ default: m.CashflowReportPage })));
const ExpenseReportPage = lazy(() => import('./pages/reports/ExpenseReportPage').then(m => ({ default: m.ExpenseReportPage })));
const IncomeReportPage = lazy(() => import('./pages/reports/IncomeReportPage').then(m => ({ default: m.IncomeReportPage })));
const BudgetReportCenterPage = lazy(() => import('./pages/reports/BudgetReportCenterPage').then(m => ({ default: m.BudgetReportCenterPage })));
const DebtReportPage = lazy(() => import('./pages/reports/DebtReportPage').then(m => ({ default: m.DebtReportPage })));
const GoalReportPage = lazy(() => import('./pages/reports/GoalReportPage').then(m => ({ default: m.GoalReportPage })));

const ExportCenterPage = lazy(() => import('./pages/exports/ExportCenterPage').then(m => ({ default: m.ExportCenterPage })));
const ExportNewPage = lazy(() => import('./pages/exports/ExportNewPage').then(m => ({ default: m.ExportNewPage })));
const ExportDetailPage = lazy(() => import('./pages/exports/ExportDetailPage').then(m => ({ default: m.ExportDetailPage })));

const ActivityListPage = lazy(() => import('./pages/activities/ActivityListPage').then(m => ({ default: m.ActivityListPage })));
const ActivityDetailPage = lazy(() => import('./pages/activities/ActivityDetailPage').then(m => ({ default: m.ActivityDetailPage })));

const AlertListPage = lazy(() => import('./pages/alerts/AlertListPage').then(m => ({ default: m.AlertListPage })));
const AlertDetailPage = lazy(() => import('./pages/alerts/AlertDetailPage').then(m => ({ default: m.AlertDetailPage })));

const SystemLogListPage = lazy(() => import('./pages/system-logs/SystemLogListPage').then(m => ({ default: m.SystemLogListPage })));
const SystemLogDetailPage = lazy(() => import('./pages/system-logs/SystemLogDetailPage').then(m => ({ default: m.SystemLogDetailPage })));

const ProfileSettingsPage = lazy(() => import('./pages/settings/ProfileSettingsPage').then(m => ({ default: m.ProfileSettingsPage })));
const SettingsOverviewPage = lazy(() => import('./pages/settings/SettingsOverviewPage').then(m => ({ default: m.SettingsOverviewPage })));
const AccountSettingsPage = lazy(() => import('./pages/settings/AccountSettingsPage').then(m => ({ default: m.AccountSettingsPage })));
const SecuritySettingsPage = lazy(() => import('./pages/settings/SecuritySettingsPage').then(m => ({ default: m.SecuritySettingsPage })));
const SessionsPage = lazy(() => import('./pages/settings/SessionsPage').then(m => ({ default: m.SessionsPage })));
const NotificationsPage = lazy(() => import('./pages/settings/NotificationsPage').then(m => ({ default: m.NotificationsPage })));
const PreferencesPage = lazy(() => import('./pages/settings/PreferencesPage').then(m => ({ default: m.PreferencesPage })));
const PrivacyPage = lazy(() => import('./pages/settings/PrivacyPage').then(m => ({ default: m.PrivacyPage })));
const DataSettingsPage = lazy(() => import('./pages/settings/DataSettingsPage').then(m => ({ default: m.DataSettingsPage })));
const HelpPage = lazy(() => import('./pages/settings/HelpPage').then(m => ({ default: m.HelpPage })));
const AboutPage = lazy(() => import('./pages/settings/AboutPage').then(m => ({ default: m.AboutPage })));
const UIAuditPage = lazy(() => import('./pages/settings/UIAuditPage').then(m => ({ default: m.UIAuditPage })));

const AppMenuPage = lazy(() => import('./pages/app-menu/AppMenuPage').then(m => ({ default: m.AppMenuPage })));

function PageLoader() {
  return (
    <div className="dashboard-page grid-stack" style={{ padding: '4rem 2rem' }}>
      <Card className="panel-card" style={{ maxWidth: 400, margin: '0 auto', textAlign: 'center' }}>
        <div className="panel-head">
          <div>
            <h3>Loading…</h3>
            <p>Please wait while the page loads.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route element={<PublicOnlyRoute><Outlet /></PublicOnlyRoute>}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
      </Route>
      <Route element={<RequireAuth><Outlet /></RequireAuth>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/analytics" element={<Suspense fallback={<PageLoader />}><AnalyticsPage /></Suspense>} />
        <Route path="/dashboard/forecast" element={<Suspense fallback={<PageLoader />}><ForecastPage /></Suspense>} />
        <Route path="/dashboard/widget-states" element={<Suspense fallback={<PageLoader />}><WidgetStatesPage /></Suspense>} />

        <Route path="/wallets" element={<Suspense fallback={<PageLoader />}><WalletListPage /></Suspense>} />
        <Route path="/wallets/new" element={<Suspense fallback={<PageLoader />}><WalletFormPage /></Suspense>} />
        <Route path="/wallets/:id" element={<Suspense fallback={<PageLoader />}><WalletDetailPage /></Suspense>} />
        <Route path="/wallets/:id/edit" element={<Suspense fallback={<PageLoader />}><WalletFormPage /></Suspense>} />
        <Route path="/wallets/:id/sharing" element={<Suspense fallback={<PageLoader />}><WalletSharingPage /></Suspense>} />

        <Route path="/categories" element={<Suspense fallback={<PageLoader />}><CategoryListPage /></Suspense>} />
        <Route path="/categories/new" element={<Suspense fallback={<PageLoader />}><CategoryFormPage /></Suspense>} />
        <Route path="/categories/:id/edit" element={<Suspense fallback={<PageLoader />}><CategoryFormPage /></Suspense>} />

        <Route path="/tags" element={<Suspense fallback={<PageLoader />}><TagListPage /></Suspense>} />
        <Route path="/tags/new" element={<Suspense fallback={<PageLoader />}><TagFormPage /></Suspense>} />
        <Route path="/tags/:id/edit" element={<Suspense fallback={<PageLoader />}><TagFormPage /></Suspense>} />

        <Route path="/transactions" element={<Suspense fallback={<PageLoader />}><TransactionListPage /></Suspense>} />
        <Route path="/transactions/new" element={<Suspense fallback={<PageLoader />}><TransactionFormPage /></Suspense>} />
        <Route path="/transactions/transfer" element={<Suspense fallback={<PageLoader />}><TransferPage /></Suspense>} />
        <Route path="/transactions/adjustment" element={<Suspense fallback={<PageLoader />}><AdjustmentPage /></Suspense>} />
        <Route path="/transactions/filter" element={<Suspense fallback={<PageLoader />}><TransactionFilterPage /></Suspense>} />
        <Route path="/transactions/split" element={<Suspense fallback={<PageLoader />}><SplitBillPage /></Suspense>} />
        <Route path="/transactions/:id/edit" element={<Suspense fallback={<PageLoader />}><TransactionFormPage /></Suspense>} />
        <Route path="/transactions/:id" element={<Suspense fallback={<PageLoader />}><TransactionDetailPage /></Suspense>} />

        <Route path="/quick-entry" element={<Suspense fallback={<PageLoader />}><QuickEntryPage /></Suspense>} />
        <Route path="/quick-entry/new" element={<Suspense fallback={<PageLoader />}><QuickEntryFormPage /></Suspense>} />
        <Route path="/quick-entry/:id/edit" element={<Suspense fallback={<PageLoader />}><QuickEntryFormPage /></Suspense>} />

        <Route path="/budgets" element={<Suspense fallback={<PageLoader />}><BudgetListPage /></Suspense>} />
        <Route path="/budgets/new" element={<Suspense fallback={<PageLoader />}><BudgetFormPage /></Suspense>} />
        <Route path="/budgets/alerts" element={<Suspense fallback={<PageLoader />}><BudgetAlertsPage /></Suspense>} />
        <Route path="/budgets/report" element={<Suspense fallback={<PageLoader />}><BudgetReportPage /></Suspense>} />
        <Route path="/budgets/:id/edit" element={<Suspense fallback={<PageLoader />}><BudgetFormPage /></Suspense>} />
        <Route path="/budgets/:id" element={<Suspense fallback={<PageLoader />}><BudgetDetailPage /></Suspense>} />

        <Route path="/tracker" element={<Suspense fallback={<PageLoader />}><TrackerPage /></Suspense>} />
        <Route path="/debts" element={<Suspense fallback={<PageLoader />}><DebtListPage /></Suspense>} />
        <Route path="/debts/new/payable" element={<Suspense fallback={<PageLoader />}><DebtFormPage /></Suspense>} />
        <Route path="/debts/new/receivable" element={<Suspense fallback={<PageLoader />}><DebtFormPage /></Suspense>} />
        <Route path="/debts/:id/pay" element={<Suspense fallback={<PageLoader />}><DebtPaymentPage /></Suspense>} />
        <Route path="/debts/:id" element={<Suspense fallback={<PageLoader />}><DebtDetailPage /></Suspense>} />

        <Route path="/installments" element={<Suspense fallback={<PageLoader />}><InstallmentListPage /></Suspense>} />
        <Route path="/installments/new" element={<Suspense fallback={<PageLoader />}><InstallmentFormPage /></Suspense>} />
        <Route path="/installments/:id/pay" element={<Suspense fallback={<PageLoader />}><InstallmentPaymentPage /></Suspense>} />

        <Route path="/subscriptions" element={<Suspense fallback={<PageLoader />}><SubscriptionListPage /></Suspense>} />
        <Route path="/subscriptions/new" element={<Suspense fallback={<PageLoader />}><SubscriptionFormPage /></Suspense>} />
        <Route path="/subscriptions/:id/pay" element={<Suspense fallback={<PageLoader />}><SubscriptionPaymentPage /></Suspense>} />

        <Route path="/recurring" element={<Suspense fallback={<PageLoader />}><RecurringListPage /></Suspense>} />
        <Route path="/recurring/new" element={<Suspense fallback={<PageLoader />}><RecurringFormPage /></Suspense>} />
        <Route path="/recurring/:id/edit" element={<Suspense fallback={<PageLoader />}><RecurringFormPage /></Suspense>} />
        <Route path="/recurring/:id/run" element={<Suspense fallback={<PageLoader />}><RecurringRunPage /></Suspense>} />
        <Route path="/recurring/:id/history" element={<Suspense fallback={<PageLoader />}><RecurringHistoryPage /></Suspense>} />
        <Route path="/recurring/:id" element={<Suspense fallback={<PageLoader />}><RecurringDetailPage /></Suspense>} />

        <Route path="/goals" element={<Suspense fallback={<PageLoader />}><GoalListPage /></Suspense>} />
        <Route path="/goals/new" element={<Suspense fallback={<PageLoader />}><GoalFormPage /></Suspense>} />
        <Route path="/goals/:id/edit" element={<Suspense fallback={<PageLoader />}><GoalFormPage /></Suspense>} />
        <Route path="/goals/:id/contribute" element={<Suspense fallback={<PageLoader />}><GoalContributionPage /></Suspense>} />
        <Route path="/goals/:id/members" element={<Suspense fallback={<PageLoader />}><GoalMembersPage /></Suspense>} />
        <Route path="/goals/:id" element={<Suspense fallback={<PageLoader />}><GoalDetailPage /></Suspense>} />

        <Route path="/reports" element={<Suspense fallback={<PageLoader />}><ReportsOverviewPage /></Suspense>} />
        <Route path="/reports/cashflow" element={<Suspense fallback={<PageLoader />}><CashflowReportPage /></Suspense>} />
        <Route path="/reports/expenses" element={<Suspense fallback={<PageLoader />}><ExpenseReportPage /></Suspense>} />
        <Route path="/reports/income" element={<Suspense fallback={<PageLoader />}><IncomeReportPage /></Suspense>} />
        <Route path="/reports/budgets" element={<Suspense fallback={<PageLoader />}><BudgetReportCenterPage /></Suspense>} />
        <Route path="/reports/debts" element={<Suspense fallback={<PageLoader />}><DebtReportPage /></Suspense>} />
        <Route path="/reports/goals" element={<Suspense fallback={<PageLoader />}><GoalReportPage /></Suspense>} />

        <Route path="/exports" element={<Suspense fallback={<PageLoader />}><ExportCenterPage /></Suspense>} />
        <Route path="/exports/new" element={<Suspense fallback={<PageLoader />}><ExportNewPage /></Suspense>} />
        <Route path="/exports/history" element={<Suspense fallback={<PageLoader />}><ExportCenterPage /></Suspense>} />
        <Route path="/exports/:id" element={<Suspense fallback={<PageLoader />}><ExportDetailPage /></Suspense>} />

        <Route path="/activities" element={<Suspense fallback={<PageLoader />}><ActivityListPage /></Suspense>} />
        <Route path="/activities/:id" element={<Suspense fallback={<PageLoader />}><ActivityDetailPage /></Suspense>} />

        <Route path="/alerts" element={<Suspense fallback={<PageLoader />}><AlertListPage /></Suspense>} />
        <Route path="/alerts/:id" element={<Suspense fallback={<PageLoader />}><AlertDetailPage /></Suspense>} />

        <Route path="/system-logs" element={<Suspense fallback={<PageLoader />}><SystemLogListPage /></Suspense>} />
        <Route path="/system-logs/:id" element={<Suspense fallback={<PageLoader />}><SystemLogDetailPage /></Suspense>} />

        <Route path="/settings" element={<Suspense fallback={<PageLoader />}><SettingsOverviewPage /></Suspense>} />
        <Route path="/settings/profile" element={<Suspense fallback={<PageLoader />}><ProfileSettingsPage /></Suspense>} />
        <Route path="/settings/account" element={<Suspense fallback={<PageLoader />}><AccountSettingsPage /></Suspense>} />
        <Route path="/settings/security" element={<Suspense fallback={<PageLoader />}><SecuritySettingsPage /></Suspense>} />
        <Route path="/settings/sessions" element={<Suspense fallback={<PageLoader />}><SessionsPage /></Suspense>} />
        <Route path="/settings/notifications" element={<Suspense fallback={<PageLoader />}><NotificationsPage /></Suspense>} />
        <Route path="/settings/preferences" element={<Suspense fallback={<PageLoader />}><PreferencesPage /></Suspense>} />
        <Route path="/settings/privacy" element={<Suspense fallback={<PageLoader />}><PrivacyPage /></Suspense>} />
        <Route path="/settings/data" element={<Suspense fallback={<PageLoader />}><DataSettingsPage /></Suspense>} />
        <Route path="/settings/help" element={<Suspense fallback={<PageLoader />}><HelpPage /></Suspense>} />
        <Route path="/settings/about" element={<Suspense fallback={<PageLoader />}><AboutPage /></Suspense>} />
        <Route path="/settings/ui-audit" element={<Suspense fallback={<PageLoader />}><UIAuditPage /></Suspense>} />

        <Route path="/app-menu" element={<Suspense fallback={<PageLoader />}><AppMenuPage /></Suspense>} />
        <Route path="/app-shell" element={<AppShellPage />} />
        <Route path="/app" element={<Navigate to="/dashboard" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
