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
        <div className="dashboard-page grid-stack"><Card className="panel-card"><div className="readiness-list"><div><span>Error</span><strong>Tag tidak ditemukan.</strong></div></div><div className="modal-actions"><Button to="/tags">Back to list</Button></div></Card></div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={isEdit ? 'Edit Tag' : 'Create Tag'} description="Buat atau edit transaction tag.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <span className="badge dark">● Tag Form</span>
            <h2>{isEdit ? `Edit #${existing?.name ?? ''}` : 'Buat tag baru.'}</h2>
            <p>Nama tag unique per user dan akan tampil sebagai chip/pill di transaksi.</p>
          </div>
          <div className="app-hero-actions"><Button to="/tags"><AppIcon name="back" /> Back</Button></div>
        </section>

        <section className="dashboard-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Tag Information</h3><p>Field utama tags table.</p></div></div>
            {isEdit ? (
              <form className="form-stack" onSubmit={updateForm.handleSubmit(onUpdate)} noValidate>
                <label>
                  <span>Tag name</span>
                  <Input {...updateForm.register('name')} />
                  {updateForm.formState.errors.name && <span className="form-error">{updateForm.formState.errors.name.message}</span>}
                </label>
                <label>
                  <span>Description</span>
                  <Textarea rows={3} defaultValue="Tag untuk memudahkan filter transaksi dan laporan lintas kategori." />
                </label>
                <div className="form-row-between">
                  <Button to="/tags">Cancel</Button>
                  <div className="inline-actions">
                    <Button type="button" variant="danger" onClick={() => setDeleteOpen(true)}><AppIcon name="delete" /> Delete</Button>
                    <Button type="submit" variant="primary" disabled={updateForm.formState.isSubmitting || updateMut.isPending}><AppIcon name="save" /> Save Tag</Button>
                  </div>
                </div>
              </form>
            ) : (
              <form className="form-stack" onSubmit={createForm.handleSubmit(onCreate)} noValidate>
                <label>
                  <span>Tag name</span>
                  <Input {...createForm.register('name')} />
                  {createForm.formState.errors.name && <span className="form-error">{createForm.formState.errors.name.message}</span>}
                </label>
                <label>
                  <span>Description</span>
                  <Textarea rows={3} defaultValue="Tag untuk memudahkan filter transaksi dan laporan lintas kategori." />
                </label>
                <div className="form-row-between">
                  <Button to="/tags">Cancel</Button>
                  <Button type="submit" variant="primary" disabled={createForm.formState.isSubmitting || createMut.isPending}><AppIcon name="save" /> Save Tag</Button>
                </div>
              </form>
            )}
          </Card>
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Preview</h3><p>Tag chip appearance.</p></div></div>
            <div className="tag-preview">
              <TagPill tag={{ name: existing?.name ?? 'example' }} active />
              <p>Preview di transaction form: tag bisa multiple select dan dipakai filter/report.</p>
            </div>
            <div className="readiness-list">
              <div><span>Unique per user</span><strong>required</strong></div>
              <div><span>Transaction relation</span><strong>transaction_tags</strong></div>
              <div><span>Filter support</span><strong>yes</strong></div>
            </div>
          </Card>
        </section>
      </div>

      <Modal open={deleteOpen} title="Delete Tag" description="Konfirmasi sebelum tag dihapus." onClose={() => setDeleteOpen(false)}>
        <div className="readiness-list">
          <div><span>Tag</span><strong>#{existing?.name ?? id}</strong></div>
          <div><span>Rekomendasi</span><strong>Hapus kalau nggak ada transaksi terkait</strong></div>
        </div>
        <div className="modal-actions">
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button variant="danger" onClick={onDelete} disabled={deleteMut.isPending}>Delete Tag</Button>
        </div>
      </Modal>
    </AppLayout>
  );
}
