import { useState } from 'react';
import clsx from 'clsx';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { FinanceOverviewCard } from '../../components/finance/FinanceOverviewCard';
import { itemAccentVars } from '../../components/finance/ColorPicker';
import { useToast } from '../../components/ui/Toast';
import { useRecurringRules, useDeleteRecurringRule } from '../../hooks/useRecurring';
import type { RecurringRule } from '../../types/recurring';

const statusTone = (status: RecurringRule['status']) => status === 'active' ? 'green' : status === 'paused' ? 'orange' : 'gray';
const typeIcon = (type: RecurringRule['type']) => type === 'income' ? 'receivable' : type === 'expense' ? 'payable' : 'transactions';
const amountTone = (type: RecurringRule['type']) => type === 'income' ? 'income' : 'expense';
const iconTone = (type: RecurringRule['type'], status: RecurringRule['status']) => status === 'paused' ? 'warning' : type === 'income' ? 'safe' : type === 'expense' ? 'danger' : 'info';

export function RecurringListPage() {
  const { data, isLoading, error } = useRecurringRules();
  const deleteMut = useDeleteRecurringRule();
  const { showToast } = useToast();
  const [target, setTarget] = useState<RecurringRule | null>(null);

  if (isLoading) return <AppLayout title="Recurring Automation" description="Loading..."><div className="p-8">Loading...</div></AppLayout>;
  if (error) return <AppLayout title="Recurring Automation" description="Loading..."><div className="p-8 text-red-500">Error loading recurring rules</div></AppLayout>;

  const rules = data?.recurring_transactions || [];

  const confirmDelete = () => {
    if (!target) return;
    deleteMut.mutate(target.id, {
      onSuccess: () => {
        showToast('Recurring rule deleted successfully');
        setTarget(null);
      },
      onError: (err: any) => showToast(err?.message || 'Failed to delete recurring rule'),
    });
  };
  
  const activeCount = rules.filter(r => r.status === 'active').length;
  const pausedCount = rules.filter(r => r.status === 'paused').length;
  const monthlyIncome = rules.filter(r => r.type === 'income' && r.status === 'active').reduce((sum, r) => sum + r.amount_minor, 0);
  const monthlyOutflow = rules.filter(r => r.type === 'expense' && r.status === 'active').reduce((sum, r) => sum + r.amount_minor, 0);

  return (
    <AppLayout title="Recurring Automation" description="Recurring rules, manual run, run history, and rule status.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div><span className="badge dark">● Automation</span><h2>Otomatisasi transaksi berulang dengan kontrol manual yang aman.</h2><p>Recurring rule menggunakan frequency, next run, status active/paused/cancelled, dan run history untuk audit.</p></div>
          <div className="app-hero-actions"><Button to="/recurring/new" variant="primary"><AppIcon name="add" /> Add Rule</Button>{rules[0] ? <Button to={`/recurring/${rules[0].id}/history`}><AppIcon name="history" /> Run History</Button> : null}</div>
        </section>

        <section className="stat-grid">
          <Card className="stat-card"><span>Active Rules</span><strong>{activeCount}</strong><small>Running</small></Card>
          <Card className="stat-card orange"><span>Paused</span><strong>{pausedCount}</strong><small>Needs review</small></Card>
          <Card className="stat-card"><span>Monthly Income</span><strong><Amount value={monthlyIncome} type="income" /></strong><small>Auto income</small></Card>
          <Card className="stat-card purple"><span>Monthly Outflow</span><strong><Amount value={monthlyOutflow} type="expense" /></strong><small>Auto expense</small></Card>
        </section>

        <section className="entity-card-grid stable-card-grid">
          {rules.slice(0, 3).map((rule) => (
            <FinanceOverviewCard
              key={rule.id}
              title={rule.name}
              subtitle={`${rule.frequency} · next ${new Date(rule.next_run_at).toLocaleDateString()}`}
              icon={typeIcon(rule.type)}
              iconTone={iconTone(rule.type, rule.status)}
              badge={rule.status}
              badgeTone={statusTone(rule.status)}
              amount={rule.amount_minor}
              amountType={amountTone(rule.type)}
              accentColor={rule.color}
              description={rule.note}
              metaLeft={rule.to_wallet_id ? `${rule.wallet_id} → ${rule.to_wallet_id}` : rule.wallet_id}
              metaRight={rule.category_id ?? rule.type}
              actions={<><Button to={`/recurring/${rule.id}`} size="small">Detail</Button><Button to={`/recurring/${rule.id}/run`} size="small" variant="primary"><AppIcon name="run" /> Run</Button><Button size="small" variant="danger" onClick={() => setTarget(rule)}><AppIcon name="delete" /> Delete</Button></>}
            />
          ))}
        </section>

        {rules.length === 0 && (
          <Card className="panel-card">
            <EmptyState icon={<AppIcon name="recurring" />} title="Belum ada recurring rule" description="Buat rule untuk otomatisasi income atau expense berulang dengan run history yang teraudit." action={<Button to="/recurring/new" variant="primary"><AppIcon name="add" /> Add Rule</Button>} />
          </Card>
        )}

        <Card className="panel-card">
          <div className="panel-head"><div><h3>Recurring Transaction List</h3><p>Semua rule dan status eksekusinya.</p></div><Button to="/recurring/new" size="small" variant="primary"><AppIcon name="add" /> Add</Button></div>
          <DataTable<RecurringRule>
            data={rules}
            getRowKey={(rule) => rule.id}
            columns={[
              { key: 'title', header: 'Rule', render: (rule) => { const accent = itemAccentVars(rule.color); return <div className="table-title"><span className={clsx('mini-icon', accent ? 'has-accent' : 'info')} style={accent}><AppIcon name={typeIcon(rule.type)} /></span><strong>{rule.name}</strong><small>{rule.type} · {rule.frequency}</small></div>; } },
              { key: 'wallet', header: 'Wallet', render: (rule) => rule.to_wallet_id ? `${rule.wallet_id} → ${rule.to_wallet_id}` : rule.wallet_id },
              { key: 'amount', header: 'Amount', align: 'right', render: (rule) => <Amount value={rule.amount_minor} type={amountTone(rule.type)} /> },
              { key: 'next', header: 'Next Run', render: (rule) => new Date(rule.next_run_at).toLocaleDateString() },
              { key: 'status', header: 'Status', render: (rule) => <Badge tone={statusTone(rule.status)}>{rule.status}</Badge> },
              { key: 'action', header: 'Action', render: (rule) => <div className="inline-actions"><Button to={`/recurring/${rule.id}`} size="small">View</Button><Button to={`/recurring/${rule.id}/edit`} size="small">Edit</Button><Button to={`/recurring/${rule.id}/run`} size="small">Run</Button><Button size="small" variant="danger" onClick={() => setTarget(rule)}><AppIcon name="delete" /></Button></div> },
            ]}
          />
        </Card>
      </div>

      <Modal
        open={!!target}
        title="Delete Recurring Rule"
        description="Tindakan ini menghapus rule. Run history yang sudah tercatat tidak ikut terhapus."
        onClose={() => (deleteMut.isPending ? null : setTarget(null))}
      >
        <div className="readiness-list">
          <div><span>Rule</span><strong>{target?.name}</strong></div>
          <div><span>Amount</span><strong>{target ? <Amount value={target.amount_minor} type={target.type === 'income' ? 'income' : 'expense'} /> : null}</strong></div>
        </div>
        <div className="modal-actions">
          <Button onClick={() => setTarget(null)} disabled={deleteMut.isPending}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete} disabled={deleteMut.isPending}>{deleteMut.isPending ? 'Deleting...' : 'Delete Rule'}</Button>
        </div>
      </Modal>
    </AppLayout>
  );
}
