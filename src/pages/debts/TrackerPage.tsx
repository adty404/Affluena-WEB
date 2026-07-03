import clsx from 'clsx';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { itemAccentVars } from '../../components/finance/ColorPicker';
import { useDebts } from '../../hooks/useDebts';
import { useInstallments, useSubscriptions } from '../../hooks/useTrackers';
import { NAV } from '../../lib/copy';

type TrackerItem = { id: string; title: string; module: string; walletName: string; amount: number; dueDate: string; status: string; to: string; color?: string };

const statusLabel = (status: string) => ({
  open: 'Belum Lunas',
  active: 'Aktif',
  paid: 'Lunas',
  paused: 'Dijeda',
  cancelled: 'Dibatalkan',
  overdue: 'Terlambat',
  due_soon: 'Segera Jatuh Tempo',
  completed: 'Selesai',
} as Record<string, string>)[status] ?? status.replace('_', ' ');

export function TrackerPage() {
  const { data: debtsData, isLoading: isLoadingDebts } = useDebts();
  const { data: installmentsData, isLoading: isLoadingInstallments } = useInstallments();
  const { data: subscriptionsData, isLoading: isLoadingSubscriptions } = useSubscriptions();

  const debts = debtsData?.debts ?? [];
  const installments = installmentsData?.installments ?? [];
  const subscriptions = subscriptionsData?.subscriptions ?? [];

  const trackerItems: TrackerItem[] = [
    ...debts.map((item) => ({ id: item.id, title: item.counterparty_name, module: 'Utang', walletName: item.wallet_id, amount: item.remaining_amount_minor, dueDate: item.due_date || '-', status: item.status, to: `/debts/${item.id}` })),
    ...installments.map((item) => ({ id: item.id, title: item.name, module: 'Cicilan', walletName: item.wallet_id, amount: item.monthly_amount_minor, dueDate: `Tanggal ${item.due_day}`, status: item.status, to: `/installments/${item.id}/pay`, color: item.color })),
    ...subscriptions.map((item) => ({ id: item.id, title: item.name, module: 'Langganan', walletName: item.wallet_id, amount: item.amount_minor, dueDate: item.next_due_date, status: item.status, to: `/subscriptions/${item.id}/pay`, color: item.color })),
  ];

  const totalDue = installments.reduce((sum, item) => sum + item.monthly_amount_minor, 0) + subscriptions.reduce((sum, item) => sum + item.amount_minor, 0) + debts.filter(d => d.type === 'payable' && d.status === 'open').reduce((sum, item) => sum + item.remaining_amount_minor, 0);
  const dueSoon = debts.filter(d => d.status === 'open' && d.due_date).length; // Simplified

  const isLoading = isLoadingDebts || isLoadingInstallments || isLoadingSubscriptions;

  // Real upcoming due dates derived from the same obligations shown in the table
  // below: subscriptions (next_due_date) + payable debts (due_date) carry real
  // dates; active installments recur on due_day, resolved to their next
  // occurrence. Sorted soonest-first, showing the nearest few.
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const parseDue = (raw?: string | null): Date | null => {
    if (!raw) return null;
    const d = new Date(raw);
    return Number.isNaN(d.getTime()) ? null : d;
  };
  const nextInstallmentDue = (dueDay: number): Date => {
    const now = new Date();
    const candidate = new Date(now.getFullYear(), now.getMonth(), dueDay);
    if (candidate < startOfToday) candidate.setMonth(candidate.getMonth() + 1);
    return candidate;
  };
  type UpcomingDue = { id: string; title: string; module: string; date: Date; to: string };
  const upcomingDue: UpcomingDue[] = [
    ...subscriptions
      .filter((s) => s.status === 'active')
      .map((s) => ({ due: parseDue(s.next_due_date), item: { id: s.id, title: s.name, module: 'Langganan', to: `/subscriptions/${s.id}/pay` } }))
      .filter((x): x is { due: Date; item: Omit<UpcomingDue, 'date'> } => x.due !== null)
      .map(({ due, item }) => ({ ...item, date: due })),
    ...debts
      .filter((d) => d.type === 'payable' && d.status === 'open')
      .map((d) => ({ due: parseDue(d.due_date), item: { id: d.id, title: d.counterparty_name, module: 'Utang', to: `/debts/${d.id}` } }))
      .filter((x): x is { due: Date; item: Omit<UpcomingDue, 'date'> } => x.due !== null)
      .map(({ due, item }) => ({ ...item, date: due })),
    ...installments
      .filter((i) => i.status === 'active')
      .map((i) => ({ id: i.id, title: i.name, module: 'Cicilan', to: `/installments/${i.id}/pay`, date: nextInstallmentDue(i.due_day) })),
  ]
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 6);

  const dueDateFormatter = new Intl.DateTimeFormat('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });
  const dueTone = (date: Date): 'today' | 'warn' | 'blue' => {
    const days = Math.round((date.getTime() - startOfToday.getTime()) / 86_400_000);
    if (days <= 0) return 'today';
    if (days <= 3) return 'warn';
    return 'blue';
  };

  return (
    <AppLayout title={NAV.pemantauUtang} description="Kalender jatuh tempo untuk utang, cicilan, dan langganan.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div><span className="badge dark">● {NAV.pemantauUtang}</span><h2>Semua kewajiban berkala terlihat dalam satu tempat.</h2><p>Kalender jatuh tempo menggabungkan utang, cicilan, dan langganan beserta pengingatnya.</p></div>
          <div className="app-hero-actions"><Button to="/debts/new/payable"><AppIcon name="payable" /> Tambah Utang</Button><Button to="/installments/new"><AppIcon name="installment" /> Tambah Cicilan</Button><Button to="/subscriptions/new" variant="primary"><AppIcon name="subscription" /> Tambah Langganan</Button></div>
        </section>

        <section className="stat-grid">
          <Card className="stat-card orange"><span>Total Kewajiban</span><strong><Amount value={totalDue} type="expense" /></strong><small>Utang + cicilan + langganan</small></Card>
          <Card className="stat-card"><span>Segera Jatuh Tempo</span><strong>{dueSoon}</strong><small>utang berjalan</small></Card>
          <Card className="stat-card blue"><span>Langganan</span><strong>{subscriptions.length}</strong><small>Perpanjangan terpantau</small></Card>
          <Card className="stat-card purple"><span>Cicilan</span><strong>{installments.length}</strong><small>Tenor terpantau</small></Card>
        </section>

        <section className="dashboard-grid tracker-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Jatuh Tempo Terdekat</h3><p>Kewajiban dengan tanggal jatuh tempo terdekat.</p></div><Button to="/recurring" size="small"><AppIcon name="recurring" /> {NAV.berulang}</Button></div>
            {isLoading ? (
              <p style={{ padding: '1rem', color: 'var(--muted)' }}>Memuat...</p>
            ) : upcomingDue.length > 0 ? (
              <div className="due-calendar-grid">
                {upcomingDue.map((item) => (
                  <div key={`${item.module}-${item.id}`} className={`due-day ${dueTone(item.date)}`}>
                    <strong>{item.date.getDate()}</strong>
                    <span>{dueDateFormatter.format(item.date)} · {item.title}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ padding: '1rem', color: 'var(--muted)' }}>Belum ada kewajiban dengan tanggal jatuh tempo.</p>
            )}
          </Card>

          <Card className="panel-card">
            <div className="panel-head"><div><h3>Prioritas Hari Ini</h3><p>Aksi paling penting untuk hari ini.</p></div></div>
            <div className="compact-action-list">
              <Button to="/debts" full><AppIcon name="receivable" /> Lihat Utang</Button>
              <Button to="/installments" full><AppIcon name="installment" /> Lihat Cicilan</Button>
              <Button to="/subscriptions" full><AppIcon name="subscription" /> Lihat Langganan</Button>
            </div>
          </Card>
        </section>

        <Card className="panel-card">
          <div className="panel-head"><div><h3>Tabel Semua Kewajiban</h3><p>Semua kewajiban finansial dengan aksi lanjutan yang jelas.</p></div></div>
          <DataTable<TrackerItem>
            data={trackerItems}
            getRowKey={(item) => `${item.module}-${item.id}`}
            columns={[
              { key: 'title', header: 'Item', render: (item) => { const accent = itemAccentVars(item.color); return <div className="table-title"><span className={clsx('mini-icon', accent ? 'has-accent' : 'safe')} style={accent}><AppIcon name={item.module === 'Utang' ? 'debt' : item.module === 'Cicilan' ? 'installment' : 'subscription'} /></span><strong>{item.title}</strong><small>{item.module}</small></div>; } },
              { key: 'wallet', header: 'Dompet', render: (item) => item.walletName },
              { key: 'amount', header: 'Jumlah', align: 'right', render: (item) => <Amount value={item.amount} type="expense" /> },
              { key: 'due', header: 'Jatuh Tempo', render: (item) => item.dueDate },
              { key: 'status', header: 'Status', render: (item) => <Badge tone={item.status.includes('due') || item.status.includes('final') ? 'orange' : item.status.includes('overdue') ? 'red' : 'blue'}>{statusLabel(item.status)}</Badge> },
              { key: 'action', header: 'Aksi', render: (item) => <Button to={item.to} size="small">Buka</Button> },
            ]}
          />
        </Card>
      </div>
    </AppLayout>
  );
}
