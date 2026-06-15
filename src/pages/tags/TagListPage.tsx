import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { DataTable } from '../../components/ui/DataTable';
import { TagPill } from '../../components/master-data/TagPill';
import { Amount } from '../../components/finance/Amount';
import { mockTags } from '../../data/mockTags';
import type { Tag } from '../../types/tag';

export function TagListPage() {
  const columns = [
    { key: 'tag', header: 'Tag', render: (tag: Tag) => <TagPill tag={tag} /> },
    { key: 'count', header: 'Transactions', render: (tag: Tag) => tag.transactionCount },
    { key: 'amount', header: 'Total Amount', align: 'right' as const, render: (tag: Tag) => <Amount value={tag.totalAmount} /> },
    { key: 'last', header: 'Last Used', render: (tag: Tag) => tag.lastUsed },
    { key: 'action', header: 'Action', render: (tag: Tag) => <Button size="small" to={`/tags/${tag.id}/edit`}>Edit</Button> },
  ];
  return (
    <AppLayout title="Tags" description="Manage flexible transaction labels for filtering and reporting.">
      <div className="dashboard-page grid-stack"><section className="app-hero-card dashboard-hero"><div><span className="badge dark">● Tags</span><h2>Tag membuat transaksi lebih mudah dicari lintas category dan wallet.</h2><p>Tag dipakai di transaction form sebagai multi-select chip.</p></div><div className="app-hero-actions"><Button to="/tags/new" variant="primary">+ Create Tag</Button><Button to="/transactions/filter">Filter Transactions</Button></div></section><section className="dashboard-grid"><Card className="panel-card"><div className="panel-head"><div><h3>Tag Cloud</h3><p>Popular tags this month.</p></div></div><div className="tag-cloud">{mockTags.map((tag, index) => <TagPill key={tag.id} tag={tag} active={index < 3} />)}</div></Card><Card className="panel-card"><div className="panel-head"><div><h3>Tagged Preview</h3><p>Contoh transaksi berdasarkan tag.</p></div></div><div className="transaction-list"><div className="transaction-row"><div className="transaction-icon">-</div><div><strong>Team dinner</strong><span>#work-trip #reimburse</span></div><Amount value={320000} variant="expense" /></div><div className="transaction-row"><div className="transaction-icon income">+</div><div><strong>Family transfer</strong><span>#family #monthly</span></div><Amount value={1250000} variant="income" /></div></div></Card></section><Card className="panel-card"><div className="panel-head"><div><h3>Tag Table</h3><p>Tags unique per user.</p></div><Button to="/tags/new" size="small" variant="primary">+ Tag</Button></div><DataTable columns={columns} data={mockTags} getRowKey={(tag) => tag.id} /></Card></div>
    </AppLayout>
  );
}
