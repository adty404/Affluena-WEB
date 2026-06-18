import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { DataTable } from '../../components/ui/DataTable';
import { TagPill } from '../../components/master-data/TagPill';
import { useTags } from '../../hooks/useTags';
import type { Tag } from '../../types/tag';

export function TagListPage() {
  const { data, isLoading, error } = useTags({ limit: 100 });
  const tags = data?.tags ?? [];

  const columns = [
    { key: 'tag', header: 'Tag', render: (tag: Tag) => <TagPill tag={tag} /> },
    { key: 'action', header: 'Action', render: (tag: Tag) => <Button size="small" to={`/tags/${tag.id}/edit`}>Edit</Button> },
  ];

  return (
    <AppLayout title="Tags" description="Manage flexible transaction labels for filtering and reporting.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <span className="badge dark">● Tags</span>
            <h2>Tag membuat transaksi lebih mudah dicari lintas category dan wallet.</h2>
            <p>Tag dipakai di transaction form sebagai multi-select chip.</p>
          </div>
          <div className="app-hero-actions"><Button to="/tags/new" variant="primary">+ Create Tag</Button></div>
        </section>

        {error ? (
          <Card className="panel-card">
            <div className="readiness-list">
              <div><span>Error</span><strong>{(error as { error?: string }).error ?? 'Gagal memuat tag'}</strong></div>
            </div>
          </Card>
        ) : null}

        {isLoading ? (
          <Card className="panel-card"><div className="readiness-list"><div><span>Memuat</span><strong>…</strong></div></div></Card>
        ) : tags.length === 0 ? (
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Belum ada tag</h3><p>Buat tag pertama untuk memudahkan filter transaksi.</p></div></div>
            <div className="modal-actions"><Button to="/tags/new" variant="primary">+ Create Tag</Button></div>
          </Card>
        ) : (
          <>
            <section className="dashboard-grid">
              <Card className="panel-card">
                <div className="panel-head"><div><h3>Tag Cloud</h3><p>Popular tags this month.</p></div></div>
                <div className="tag-cloud">{tags.map((tag, index) => <TagPill key={tag.id} tag={tag} active={index < 3} />)}</div>
              </Card>
            </section>
            <Card className="panel-card">
              <div className="panel-head"><div><h3>Tag Table</h3><p>{data?.pagination.total ?? tags.length} tag terdaftar.</p></div><Button to="/tags/new" size="small" variant="primary">+ Tag</Button></div>
              <DataTable columns={columns} data={tags} getRowKey={(tag) => tag.id} />
            </Card>
          </>
        )}
      </div>
    </AppLayout>
  );
}
