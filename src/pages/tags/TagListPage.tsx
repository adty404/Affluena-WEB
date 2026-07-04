import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { EmptyState } from '../../components/ui/EmptyState';
import { AppIcon } from '../../components/ui/AppIcon';
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
            <Badge className="dark">{NAV.tag}</Badge>
            <h2>Tag membuat transaksi lebih mudah dicari lintas kategori dan dompet.</h2>
            <p>Tempelkan beberapa tag sekaligus saat mencatat transaksi.</p>
          </div>
          <div className="app-hero-actions"><Button to="/tags/new" variant="primary"><AppIcon name="add" /> Buat Tag</Button></div>
        </section>

        {error ? (
          <Card className="panel-card">
            <EmptyState icon={<AppIcon name="empty" />} title="Gagal memuat tag" description={(error as { error?: string }).error ?? 'Periksa koneksi lalu coba lagi.'} />
          </Card>
        ) : isLoading ? (
          <div className="loading-state">Memuat tag...</div>
        ) : tags.length === 0 ? (
          <Card className="panel-card">
            <EmptyState icon={<AppIcon name="tags" />} title="Belum ada tag" description="Buat tag pertama untuk memudahkan filter transaksi." action={<Button to="/tags/new" variant="primary"><AppIcon name="add" /> Buat Tag</Button>} />
          </Card>
        ) : (
          <>
            <section className="dashboard-grid">
              <Card className="panel-card">
                <div className="panel-head"><div><h3>Semua Tag</h3><p>Semua tag yang bisa kamu tempelkan ke transaksi.</p></div></div>
                <div className="tag-cloud">{tags.map((tag) => <TagPill key={tag.id} tag={tag} />)}</div>
              </Card>
            </section>
            <Card className="panel-card">
              <div className="panel-head"><div><h3>Daftar Tag</h3><p>{data?.pagination.total ?? tags.length} tag terdaftar.</p></div><Button to="/tags/new" size="small" variant="primary"><AppIcon name="add" /> Tag</Button></div>
              <DataTable columns={columns} data={tags} getRowKey={(tag) => tag.id} />
            </Card>
          </>
        )}
      </div>
    </AppLayout>
  );
}
