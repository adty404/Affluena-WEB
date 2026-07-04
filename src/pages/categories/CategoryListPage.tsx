import { useState } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import { AppIcon } from '../../components/ui/AppIcon';
import { useToast } from '../../components/ui/Toast';
import { CategoryTree } from '../../components/master-data/CategoryTree';
import { useCategories, useDeleteCategory, useReorderCategories } from '../../hooks/useCategories';
import { NAV } from '../../lib/copy';
import { categoryTypeLabels } from '../../schemas/category';
import type { ApiError } from '../../api/types';
import type { Category } from '../../types/category';

export function CategoryListPage() {
  const { showToast } = useToast();
  const { data, isLoading, error } = useCategories({ limit: 100 });
  const deleteMut = useDeleteCategory();
  const reorderMut = useReorderCategories();
  const [pendingDelete, setPendingDelete] = useState<Category | null>(null);

  function handleReorder(ids: string[]) {
    reorderMut.mutate(ids, {
      onSuccess: () => showToast('Urutan kategori disimpan.'),
      onError: (err) => showToast((err as unknown as ApiError).error || 'Gagal menyimpan urutan kategori.'),
    });
  }

  const categories = data?.categories ?? [];
  const incomeCount = categories.filter((c) => c.type === 'income').length;
  const expenseCount = categories.filter((c) => c.type === 'expense').length;

  async function confirmDelete() {
    if (!pendingDelete) return;
    try {
      await deleteMut.mutateAsync(pendingDelete.id);
      showToast(`Kategori "${pendingDelete.name}" dihapus.`);
      setPendingDelete(null);
    } catch (err) {
      showToast((err as ApiError).error || 'Gagal menghapus kategori.');
    }
  }

  return (
    <AppLayout title={NAV.kategori} description="Kelola susunan kategori pemasukan dan pengeluaranmu.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <span className="badge dark">{NAV.kategori}</span>
            <h2>Susun kategori pemasukan dan pengeluaran sesuai kebiasaanmu.</h2>
            <p>Kategori membuat transaksi, anggaran, dan laporanmu tetap rapi — bisa bertingkat sampai tiga level.</p>
          </div>
          <div className="app-hero-actions"><Button to="/categories/new" variant="primary"><AppIcon name="add" /> Kategori Baru</Button></div>
        </section>

        {error ? (
          <Card className="panel-card">
            <EmptyState icon={<AppIcon name="empty" />} title="Gagal memuat kategori" description={(error as { error?: string }).error ?? 'Periksa koneksi lalu coba lagi.'} />
          </Card>
        ) : null}

        <section className="stat-grid">
          <Card className="stat-card"><span>Total Kategori</span><strong>{isLoading ? '…' : categories.length}</strong><small>Semua tipe</small></Card>
          <Card className="stat-card green"><span>Pemasukan</span><strong>{isLoading ? '…' : incomeCount}</strong><small>Kategori pemasukan</small></Card>
          <Card className="stat-card orange"><span>Pengeluaran</span><strong>{isLoading ? '…' : expenseCount}</strong><small>Kategori pengeluaran</small></Card>
        </section>

        {isLoading ? (
          <div className="loading-state">Memuat kategori...</div>
        ) : categories.length === 0 ? (
          <Card className="panel-card">
            <EmptyState
              icon={<div className="category-icon green"><AppIcon name="categories" /></div>}
              title="Belum ada kategori"
              description="Mulai dengan kategori utama seperti Gaji atau Belanja, lalu tambahkan subkategori di bawahnya (misalnya Belanja → Supermarket → Belanja mingguan). Bisa sampai tiga level per tipe."
              action={(
                <div className="modal-actions">
                  <Button to="/categories/new?type=income"><AppIcon name="add" /> Kategori pemasukan</Button>
                  <Button to="/categories/new?type=expense" variant="primary"><AppIcon name="add" /> Kategori pengeluaran</Button>
                </div>
              )}
            />
          </Card>
        ) : (
          <Card className="panel-card category-tree-card">
            <div className="panel-head">
              <div>
                <h3>Pohon Kategori</h3>
                <p>Buka cabang untuk melihat subkategorinya. Geser pegangan di tiap baris untuk mengubah urutan; pakai tombol untuk menambah subkategori, mengedit, atau menghapus.</p>
              </div>
              <Button to="/categories/new" size="small" variant="primary"><AppIcon name="add" /> Kategori Baru</Button>
            </div>
            <CategoryTree categories={categories} onDelete={setPendingDelete} onReorder={handleReorder} />
          </Card>
        )}
      </div>

      <Modal
        open={Boolean(pendingDelete)}
        title="Hapus Kategori"
        description="Tindakan ini tidak bisa dibatalkan."
        onClose={() => setPendingDelete(null)}
      >
        <div className="readiness-list">
          <div><span>Kategori</span><strong>{pendingDelete?.name ?? '—'}</strong></div>
          <div><span>Tipe</span><strong>{pendingDelete ? categoryTypeLabels[pendingDelete.type] : '—'}</strong></div>
          <div><span>Catatan</span><strong>Menghapus kategori induk bisa memengaruhi subkategorinya.</strong></div>
        </div>
        <div className="modal-actions">
          <Button onClick={() => setPendingDelete(null)}>Batal</Button>
          <Button variant="danger" onClick={confirmDelete} disabled={deleteMut.isPending}>
            <AppIcon name="delete" /> Hapus Kategori
          </Button>
        </div>
      </Modal>
    </AppLayout>
  );
}
