import clsx from 'clsx';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { ProgressBar } from '../../components/finance/ProgressBar';
import { itemAccentVars } from '../../components/finance/ColorPicker';
import { BudgetCard } from '../../components/budgets/BudgetCard';
import { BudgetAlertItem } from '../../components/budgets/BudgetAlertItem';
import type { BudgetSummary } from '../../types/budget';
import { useBudgets, useBudgetAlerts } from '../../hooks/useBudgets';
import { useCategories } from '../../hooks/useCategories';
import { NAV } from '../../lib/copy';

const statusTone = {
  safe: 'green',
  warning: 'orange',
  exceeded: 'red',
} as const;

const statusLabel = {
  safe: 'Aman',
  warning: 'Peringatan',
  exceeded: 'Terlampaui',
} as const;

export function BudgetListPage() {
  const { data: budgetsData, isLoading, error } = useBudgets();
  const { data: categoriesData } = useCategories({ type: 'expense' });
  const { data: alertsData, isLoading: alertsLoading } = useBudgetAlerts();

  const budgets = budgetsData?.budgets ?? [];
  const alerts = alertsData?.alerts ?? [];
  
  const totalLimit = budgets.reduce((sum, b) => sum + b.limit_minor, 0);
  const totalActual = budgets.reduce((sum, b) => sum + b.spent_minor, 0);
  const overallUsage = totalLimit > 0 ? Math.round((totalActual / totalLimit) * 100) : 0;
  
  const safeCount = budgets.filter(b => b.usage_percent < 80).length;
  const warningCount = budgets.filter(b => b.usage_percent >= 80 && b.usage_percent < 100).length;
  const exceededCount = budgets.filter(b => b.usage_percent >= 100).length;

  return (
    <AppLayout title={NAV.anggaran} description="Kendalikan batas belanja bulanan per kategori dan pantau penggunaannya.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero budget-hero">
          <div>
            <span className="badge dark">● Anggaran</span>
            <h2>Kendalikan pengeluaran bulanan per kategori dengan notifikasi otomatis.</h2>
            <p>Affluena menghitung pengeluaran aktual dari transaksimu dan memberi tahu saat anggaran mendekati atau melewati batas.</p>
          </div>
          <div className="app-hero-actions">
            <Button to="/budgets/new" variant="primary"><AppIcon name="add" /> Buat Anggaran</Button>
            <Button to="/budgets/alerts"><AppIcon name="budgetAlert" /> Notifikasi</Button>
            <Button to="/budgets/report"><AppIcon name="budgetReport" /> Laporan</Button>
          </div>
        </section>

        <section className="stat-grid">
          <Card className="stat-card"><span>Total Batas</span><strong><Amount value={totalLimit} /></strong><small>{budgets.length} anggaran aktif</small></Card>
          <Card className="stat-card"><span>Pengeluaran Aktual</span><strong><Amount value={totalActual} type="expense" /></strong><small>{overallUsage}% terpakai</small></Card>
          <Card className="stat-card"><span>Aman</span><strong>{safeCount}</strong><small>Di bawah 80%</small></Card>
          <Card className="stat-card"><span>Perlu Perhatian</span><strong>{warningCount + exceededCount}</strong><small>Peringatan atau terlampaui</small></Card>
        </section>

        {isLoading ? (
          <p>Memuat anggaran...</p>
        ) : error ? (
          <p>Gagal memuat anggaran.</p>
        ) : budgets.length === 0 ? (
          <Card className="panel-card"><p>Belum ada anggaran. Buat satu untuk mulai.</p></Card>
        ) : (
          <>
            <section className="budget-card-grid">
              {budgets.slice(0, 3).map((budget, index) => <BudgetCard key={budget.id} budget={budget} featured={index === 0} />)}
            </section>

            <section className="dashboard-grid">
              <Card className="panel-card">
                <div className="panel-head">
                  <div><h3>Daftar Anggaran</h3><p>Anggaran per kategori dengan status aman, peringatan, dan terlampaui.</p></div>
                  <div className="panel-actions"><Button to="/budgets/new" size="small" variant="primary"><AppIcon name="add" /> Tambah</Button><Button to="/budgets/report" size="small"><AppIcon name="chart" /> Laporan</Button></div>
                </div>
                <DataTable<BudgetSummary>
                  data={budgets}
                  getRowKey={(budget) => budget.id}
                  columns={[
                    { 
                      key: 'category',
                      header: 'Kategori',
                      render: (budget) => {
                        const category = (categoriesData?.categories ?? []).find(c => c.id === budget.category_id);
                        const categoryName = category?.name ?? 'Kategori tidak dikenal';
                        const categoryIcon = 'categories';
                        let status: 'safe' | 'warning' | 'exceeded' = 'safe';
                        if (budget.usage_percent >= 100) status = 'exceeded';
                        else if (budget.usage_percent >= 80) status = 'warning';
                        // Appearance tint only when the budget is safe; the
                        // warning/exceeded status colors always win.
                        const accent = status === 'safe' ? itemAccentVars(budget.color) : undefined;

                        return (
                          <div className="table-title">
                            <span className={clsx('mini-icon', status, accent && 'has-accent')} style={accent}><AppIcon name={categoryIcon} /></span>
                            <strong>{categoryName}</strong>
                            <small>{budget.month}</small>
                          </div>
                        );
                      } 
                    },
                    { key: 'limit', header: 'Batas', align: 'right', render: (budget) => <Amount value={budget.limit_minor} /> },
                    { key: 'actual', header: 'Aktual', align: 'right', render: (budget) => <Amount value={budget.spent_minor} type="expense" /> },
                    {
                      key: 'usage',
                      header: 'Penggunaan',
                      render: (budget) => { 
                        const usage = budget.usage_percent; 
                        let status: 'safe' | 'warning' | 'exceeded' = 'safe';
                        if (usage >= 100) status = 'exceeded';
                        else if (usage >= 80) status = 'warning';
                        return (
                          <div className="table-progress">
                            <ProgressBar value={usage} tone={status === 'safe' ? 'green' : status === 'warning' ? 'orange' : 'red'} />
                            <span>{usage}%</span>
                          </div>
                        ); 
                      } 
                    },
                    { 
                      key: 'status', 
                      header: 'Status', 
                      render: (budget) => {
                        let status: 'safe' | 'warning' | 'exceeded' = 'safe';
                        if (budget.usage_percent >= 100) status = 'exceeded';
                        else if (budget.usage_percent >= 80) status = 'warning';
                        return <Badge tone={statusTone[status]}>{statusLabel[status]}</Badge>;
                      }
                    },
                    { key: 'action', header: 'Aksi', render: (budget) => <div className="inline-actions"><Button to={`/budgets/${budget.id}`} size="small">Lihat</Button><Button to={`/budgets/${budget.id}/edit`} size="small">Edit</Button></div> },
                  ]}
                />
              </Card>

              <Card className="panel-card">
                <div className="panel-head"><div><h3>Notifikasi Terbaru</h3><p>Pemberitahuan saat anggaran mendekati atau melewati batas.</p></div><Button to="/budgets/alerts" size="small">Buka</Button></div>
                <div className="budget-alert-list">
                  {alertsLoading ? (
                    <p>Memuat notifikasi...</p>
                  ) : alerts.length > 0 ? (
                    alerts.slice(0, 3).map((alert) => <BudgetAlertItem key={alert.id} alert={alert} />)
                  ) : (
                    <p>Tidak ada notifikasi aktif.</p>
                  )}
                </div>
              </Card>
            </section>
          </>
        )}
      </div>
    </AppLayout>
  );
}
