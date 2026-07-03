import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { DataTable } from '../../components/ui/DataTable';
import { TagPill } from '../../components/master-data/TagPill';
import { useTags } from '../../hooks/useTags';
import { NAV } from '../../lib/copy';
import type { Tag } from '../../types/tag';

export function TagListPage() {
  const { data, isLoading, error } = useTags({ limit: 100 });
  const tags = data?.tags ?? [];

  const columns = [
    { key: 'tag', header: 'Tag', render: (tag: Tag) => <TagPill tag={tag} /> },
    { key: 'action', header: 'Aksi', render: (tag: Tag) => <Button size="small" to={`/tags/${tag.id}/edit`}>Edit</Button> },
  ];

  return (
    <AppLayout title={NAV.tag} description="Kelola label transaksi untuk memudahkan filter dan laporan.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <span className="badge dark">● {NAV.tag}</span>
            <h2>Tag membuat transaksi lebih mudah dicari lintas kategori dan dompet.</h2>
            <p>Tempelkan beberapa tag sekaligus saat mencatat transaksi.</p>
          </div>
          <div className="app-hero-actions"><Button to="/tags/new" variant="primary">+ Buat Tag</Button></div>
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
            <div className="modal-actions"><Button to="/tags/new" variant="primary">+ Buat Tag</Button></div>
          </Card>
        ) : (
          <>
            <section className="dashboard-grid">
              <Card className="panel-card">
                <div className="panel-head"><div><h3>Tag Populer</h3><p>Tag yang paling sering dipakai bulan ini.</p></div></div>
                <div className="tag-cloud">{tags.map((tag, index) => <TagPill key={tag.id} tag={tag} active={index < 3} />)}</div>
              </Card>
            </section>
            <Card className="panel-card">
              <div className="panel-head"><div><h3>Daftar Tag</h3><p>{data?.pagination.total ?? tags.length} tag terdaftar.</p></div><Button to="/tags/new" size="small" variant="primary">+ Tag</Button></div>
              <DataTable columns={columns} data={tags} getRowKey={(tag) => tag.id} />
            </Card>
          </>
        )}
      </div>
    </AppLayout>
  );
}
