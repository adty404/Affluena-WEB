import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { AppIcon } from '../../components/ui/AppIcon';
import { useCategories, useCategory, useCreateCategory, useDeleteCategory, useUpdateCategory } from '../../hooks/useCategories';
import { categoryCreateSchema, categoryUpdateSchema, categoryTypeOptions, type CategoryCreateFormValues, type CategoryUpdateFormValues } from '../../schemas/category';
import type { ApiError } from '../../api/types';
import type { Category } from '../../types/category';

function computeDepth(categories: Category[], categoryId: string | undefined, memo = new Map<string, number>()): number {
  if (!categoryId) return 0;
  if (memo.has(categoryId)) return memo.get(categoryId)!;
  const cat = categories.find((c) => c.id === categoryId);
  if (!cat || !cat.parent_id) {
    memo.set(categoryId, 0);
    return 0;
  }
  const d = 1 + computeDepth(categories, cat.parent_id, memo);
  memo.set(categoryId, d);
  return d;
}

export function CategoryFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const isEdit = Boolean(id);

  const { data: existing, isLoading } = useCategory(id);
  const { data: allCategoriesData } = useCategories({ limit: 200 });
  const allCategories = allCategoriesData?.categories ?? [];

  const createMut = useCreateCategory();
  const updateMut = useUpdateCategory(id ?? '');
  const deleteMut = useDeleteCategory();

  const createForm = useForm<CategoryCreateFormValues>({
    resolver: zodResolver(categoryCreateSchema),
    defaultValues: { name: '', type: 'expense', parent_id: undefined },
  });

  const updateForm = useForm<CategoryUpdateFormValues>({
    resolver: zodResolver(categoryUpdateSchema),
    values: existing
      ? {
          name: existing.name,
          type: existing.type,
          parent_id: existing.parent_id,
        }
      : undefined,
  });

  const activeForm = isEdit ? updateForm : createForm;
  const formType = activeForm.watch('type');
  const formParentId = activeForm.watch('parent_id');

  const eligibleParents = useMemo(() => {
    return allCategories.filter((c) => {
      if (c.type !== formType) return false;
      if (isEdit && c.id === id) return false;
      if (c.id === formParentId) return true;
      const depth = computeDepth(allCategories, c.id);
      return depth < 3;
    });
  }, [allCategories, formType, id, isEdit, formParentId]);

  async function onCreate(values: CategoryCreateFormValues) {
    try {
      await createMut.mutateAsync(values);
      showToast('Kategori dibuat.');
      navigate('/categories', { replace: true });
    } catch (err) {
      const apiErr = err as ApiError;
      showToast(apiErr.error || 'Gagal membuat kategori.');
    }
  }

  async function onUpdate(values: CategoryUpdateFormValues) {
    if (!id) return;
    try {
      await updateMut.mutateAsync(values);
      showToast('Kategori diperbarui.');
      navigate('/categories', { replace: true });
    } catch (err) {
      const apiErr = err as ApiError;
      showToast(apiErr.error || 'Gagal memperbarui kategori.');
    }
  }

  async function onDelete() {
    if (!id) return;
    try {
      await deleteMut.mutateAsync(id);
      setDeleteOpen(false);
      showToast('Kategori dihapus.');
      navigate('/categories', { replace: true });
    } catch (err) {
      const apiErr = err as ApiError;
      showToast(apiErr.error || 'Gagal menghapus kategori.');
    }
  }

  if (isEdit && isLoading) {
    return (
      <AppLayout title="Edit Category" description="Memuat…">
        <div className="dashboard-page grid-stack"><Card className="panel-card"><div className="readiness-list"><div><span>Memuat kategori</span><strong>…</strong></div></div></Card></div>
      </AppLayout>
    );
  }

  if (isEdit && !existing) {
    return (
      <AppLayout title="Edit Category" description="Kategori tidak ditemukan.">
        <div className="dashboard-page grid-stack"><Card className="panel-card"><div className="readiness-list"><div><span>Error</span><strong>Kategori tidak ditemukan.</strong></div></div><div className="modal-actions"><Button to="/categories">Back to list</Button></div></Card></div>
      </AppLayout>
    );
  }

  const renderParentSelect = (field: ReturnType<typeof activeForm.register>) => (
    <Select {...field}>
      <option value="">No parent</option>
      {eligibleParents.map((cat) => (
        <option key={cat.id} value={cat.id}>{cat.name}</option>
      ))}
    </Select>
  );

  return (
    <AppLayout title={isEdit ? 'Edit Category' : 'Create Category'} description="Buat atau edit income/expense category.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <span className="badge dark">● Category Form</span>
            <h2>{isEdit ? `Edit ${existing?.name ?? ''}` : 'Buat category baru.'}</h2>
            <p>Parent category harus same type, same user, dan tidak boleh cycle.</p>
          </div>
          <div className="app-hero-actions"><Button to="/categories"><AppIcon name="back" /> Back</Button></div>
        </section>

        <section className="dashboard-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Category Information</h3><p>Field utama categories table.</p></div></div>
            {isEdit ? (
              <form className="form-stack" onSubmit={updateForm.handleSubmit(onUpdate)} noValidate>
                <label>
                  <span>Category name</span>
                  <Input {...updateForm.register('name')} />
                  {updateForm.formState.errors.name && <span className="form-error">{updateForm.formState.errors.name.message}</span>}
                </label>
                <div className="form-two">
                  <label>
                    <span>Type</span>
                    <Select {...updateForm.register('type')}>
                      {categoryTypeOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </Select>
                  </label>
                  <label>
                    <span>Parent category</span>
                    {renderParentSelect(updateForm.register('parent_id'))}
                  </label>
                </div>
                <label>
                  <span>Description</span>
                  <Textarea rows={3} defaultValue="Digunakan untuk klasifikasi transaksi dan ringkasan budget bulanan." />
                </label>
                <div className="form-row-between">
                  <Button to="/categories">Cancel</Button>
                  <div className="inline-actions">
                    <Button type="button" variant="danger" onClick={() => setDeleteOpen(true)}><AppIcon name="delete" /> Delete</Button>
                    <Button type="submit" variant="primary" disabled={updateForm.formState.isSubmitting || updateMut.isPending}><AppIcon name="save" /> Save Category</Button>
                  </div>
                </div>
              </form>
            ) : (
              <form className="form-stack" onSubmit={createForm.handleSubmit(onCreate)} noValidate>
                <label>
                  <span>Category name</span>
                  <Input {...createForm.register('name')} />
                  {createForm.formState.errors.name && <span className="form-error">{createForm.formState.errors.name.message}</span>}
                </label>
                <div className="form-two">
                  <label>
                    <span>Type</span>
                    <Select {...createForm.register('type')}>
                      {categoryTypeOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </Select>
                  </label>
                  <label>
                    <span>Parent category</span>
                    {renderParentSelect(createForm.register('parent_id'))}
                  </label>
                </div>
                <label>
                  <span>Description</span>
                  <Textarea rows={3} defaultValue="Digunakan untuk klasifikasi transaksi dan ringkasan budget bulanan." />
                </label>
                <div className="form-row-between">
                  <Button to="/categories">Cancel</Button>
                  <Button type="submit" variant="primary" disabled={createForm.formState.isSubmitting || createMut.isPending}><AppIcon name="save" /> Save Category</Button>
                </div>
              </form>
            )}
          </Card>
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Validation</h3><p>Rules penting untuk backend.</p></div></div>
            <div className="readiness-list">
              <div><span>Max depth</span><strong>3 levels</strong></div>
              <div><span>Parent type</span><strong>same type</strong></div>
              <div><span>No cycle</span><strong>required</strong></div>
              <div><span>User isolation</span><strong>required</strong></div>
            </div>
          </Card>
        </section>
      </div>

      <Modal open={deleteOpen} title="Delete Category" description="Konfirmasi sebelum kategori dihapus." onClose={() => setDeleteOpen(false)}>
        <div className="readiness-list">
          <div><span>Category</span><strong>{existing?.name ?? id}</strong></div>
          <div><span>Type</span><strong>{existing?.type ?? '—'}</strong></div>
          <div><span>Rekomendasi</span><strong>Hapus kalau nggak ada transaksi terkait</strong></div>
        </div>
        <div className="modal-actions">
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button variant="danger" onClick={onDelete} disabled={deleteMut.isPending}>Delete Category</Button>
        </div>
      </Modal>
    </AppLayout>
  );
}
