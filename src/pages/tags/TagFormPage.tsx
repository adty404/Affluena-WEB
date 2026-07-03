import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Input, Textarea } from '../../components/ui/Input';
import { TagPill } from '../../components/master-data/TagPill';
import { useToast } from '../../components/ui/Toast';
import { AppIcon } from '../../components/ui/AppIcon';
import { useCreateTag, useDeleteTag, useTag, useUpdateTag } from '../../hooks/useTags';
import { tagCreateSchema, tagUpdateSchema, type TagCreateFormValues, type TagUpdateFormValues } from '../../schemas/tag';
import type { ApiError } from '../../api/types';

export function TagFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const isEdit = Boolean(id);

  const { data: existing, isLoading } = useTag(id);
  const createMut = useCreateTag();
  const updateMut = useUpdateTag(id ?? '');
  const deleteMut = useDeleteTag();

  const createForm = useForm<TagCreateFormValues>({
    resolver: zodResolver(tagCreateSchema),
    defaultValues: { name: '' },
  });

  const updateForm = useForm<TagUpdateFormValues>({
    resolver: zodResolver(tagUpdateSchema),
    values: existing ? { name: existing.name } : undefined,
  });

  async function onCreate(values: TagCreateFormValues) {
    try {
      await createMut.mutateAsync(values);
      showToast('Tag dibuat.');
      navigate('/tags', { replace: true });
    } catch (err) {
      const apiErr = err as ApiError;
      showToast(apiErr.error || 'Gagal membuat tag.');
    }
  }

  async function onUpdate(values: TagUpdateFormValues) {
    if (!id) return;
    try {
      await updateMut.mutateAsync(values);
      showToast('Tag diperbarui.');
      navigate('/tags', { replace: true });
    } catch (err) {
      const apiErr = err as ApiError;
      showToast(apiErr.error || 'Gagal memperbarui tag.');
    }
  }

  async function onDelete() {
    if (!id) return;
    try {
      await deleteMut.mutateAsync(id);
      setDeleteOpen(false);
      showToast('Tag dihapus.');
      navigate('/tags', { replace: true });
    } catch (err) {
      const apiErr = err as ApiError;
      showToast(apiErr.error || 'Gagal menghapus tag.');
    }
  }

  if (isEdit && isLoading) {
    return (
      <AppLayout title="Edit Tag" description="Memuat…">
        <div className="dashboard-page grid-stack"><Card className="panel-card"><div className="readiness-list"><div><span>Memuat tag</span><strong>…</strong></div></div></Card></div>
      </AppLayout>
    );
  }

  if (isEdit && !existing) {
    return (
      <AppLayout title="Edit Tag" description="Tag tidak ditemukan.">
        <div className="dashboard-page grid-stack"><Card className="panel-card"><div className="readiness-list"><div><span>Error</span><strong>Tag tidak ditemukan.</strong></div></div><div className="modal-actions"><Button to="/tags">Kembali ke daftar</Button></div></Card></div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={isEdit ? 'Edit Tag' : 'Buat Tag'} description="Buat atau edit tag transaksi.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <span className="badge dark">● Tag</span>
            <h2>{isEdit ? `Edit #${existing?.name ?? ''}` : 'Buat tag baru.'}</h2>
            <p>Nama tag harus unik dan akan tampil sebagai label di transaksimu.</p>
          </div>
          <div className="app-hero-actions"><Button to="/tags"><AppIcon name="back" /> Kembali</Button></div>
        </section>

        <section className="dashboard-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Informasi Tag</h3><p>Nama tag yang tampil di transaksimu.</p></div></div>
            {isEdit ? (
              <form className="form-stack" onSubmit={updateForm.handleSubmit(onUpdate)} noValidate>
                <label>
                  <span>Nama tag</span>
                  <Input {...updateForm.register('name')} />
                  {updateForm.formState.errors.name && <span className="form-error">{updateForm.formState.errors.name.message}</span>}
                </label>
                <label>
                  <span>Deskripsi</span>
                  <Textarea rows={3} defaultValue="Tag untuk memudahkan filter transaksi dan laporan lintas kategori." />
                </label>
                <div className="form-row-between">
                  <Button to="/tags">Batal</Button>
                  <div className="inline-actions">
                    <Button type="button" variant="danger" onClick={() => setDeleteOpen(true)}><AppIcon name="delete" /> Hapus</Button>
                    <Button type="submit" variant="primary" disabled={updateForm.formState.isSubmitting || updateMut.isPending}><AppIcon name="save" /> Simpan Tag</Button>
                  </div>
                </div>
              </form>
            ) : (
              <form className="form-stack" onSubmit={createForm.handleSubmit(onCreate)} noValidate>
                <label>
                  <span>Nama tag</span>
                  <Input {...createForm.register('name')} />
                  {createForm.formState.errors.name && <span className="form-error">{createForm.formState.errors.name.message}</span>}
                </label>
                <label>
                  <span>Deskripsi</span>
                  <Textarea rows={3} defaultValue="Tag untuk memudahkan filter transaksi dan laporan lintas kategori." />
                </label>
                <div className="form-row-between">
                  <Button to="/tags">Batal</Button>
                  <Button type="submit" variant="primary" disabled={createForm.formState.isSubmitting || createMut.isPending}><AppIcon name="save" /> Simpan Tag</Button>
                </div>
              </form>
            )}
          </Card>
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Pratinjau</h3><p>Tampilan label tag.</p></div></div>
            <div className="tag-preview">
              <TagPill tag={{ name: existing?.name ?? 'contoh' }} active />
              <p>Seperti inilah tag tampil saat mencatat transaksi — bisa dipasang beberapa sekaligus untuk filter dan laporan.</p>
            </div>
            <div className="readiness-list">
              <div><span>Nama tag</span><strong>Harus unik</strong></div>
              <div><span>Filter & laporan</span><strong>Didukung</strong></div>
            </div>
          </Card>
        </section>
      </div>

      <Modal open={deleteOpen} title="Hapus Tag" description="Konfirmasi sebelum tag dihapus." onClose={() => setDeleteOpen(false)}>
        <div className="readiness-list">
          <div><span>Tag</span><strong>#{existing?.name ?? id}</strong></div>
          <div><span>Rekomendasi</span><strong>Hapus kalau sudah tidak ada transaksi terkait</strong></div>
        </div>
        <div className="modal-actions">
          <Button onClick={() => setDeleteOpen(false)}>Batal</Button>
          <Button variant="danger" onClick={onDelete} disabled={deleteMut.isPending}>Hapus Tag</Button>
        </div>
      </Modal>
    </AppLayout>
  );
}
