import { useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { Modal } from '../../components/ui/Modal';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { AppIcon } from '../../components/ui/AppIcon';
import { ColorPicker, itemAccentVars } from '../../components/finance/ColorPicker';
import { IconPicker } from '../../components/finance/IconPicker';
import { CategoryIcon } from '../../components/master-data/CategoryIcon';
import { useCategories, useCategory, useCreateCategory, useDeleteCategory, useUpdateCategory } from '../../hooks/useCategories';
import { categoryCreateSchema, categoryUpdateSchema, categoryTypeOptions, categoryTypeLabels, type CategoryCreateFormValues, type CategoryUpdateFormValues } from '../../schemas/category';
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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const isEdit = Boolean(id);

  const prefillType = searchParams.get('type');
  const prefillParentId = searchParams.get('parent_id') ?? undefined;
  const defaultType: Category['type'] = prefillType === 'income' || prefillType === 'expense' ? prefillType : 'expense';

  const { data: existing, isLoading } = useCategory(id);
  const { data: allCategoriesData } = useCategories({ limit: 200 });
  const allCategories = allCategoriesData?.categories ?? [];

  const createMut = useCreateCategory();
  const updateMut = useUpdateCategory(id ?? '');
  const deleteMut = useDeleteCategory();

  const createForm = useForm<CategoryCreateFormValues>({
    resolver: zodResolver(categoryCreateSchema),
    defaultValues: { name: '', type: defaultType, parent_id: prefillParentId, color: '', icon: '' },
  });

  const updateForm = useForm<CategoryUpdateFormValues>({
    resolver: zodResolver(categoryUpdateSchema),
    values: existing
      ? {
          name: existing.name,
          type: existing.type,
          parent_id: existing.parent_id,
          color: existing.color ?? '',
          icon: existing.icon ?? '',
        }
      : undefined,
  });

  const activeForm = isEdit ? updateForm : createForm;
  const formType = activeForm.watch('type');
  const formParentId = activeForm.watch('parent_id');
  const formColor = activeForm.watch('color') ?? '';
  const formIcon = activeForm.watch('icon') ?? '';

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
      <AppLayout title="Edit Kategori" description="Memuat…">
        <div className="dashboard-page grid-stack"><div className="loading-state">Memuat...</div></div>
      </AppLayout>
    );
  }

  if (isEdit && !existing) {
    return (
      <AppLayout title="Edit Kategori" description="Kategori tidak ditemukan.">
        <div className="dashboard-page grid-stack"><Card className="panel-card"><EmptyState icon={<AppIcon name="empty" />} title="Kategori tidak ditemukan" description="Kategori mungkin sudah dihapus." action={<Button to="/categories">Kembali ke daftar</Button>} /></Card></div>
      </AppLayout>
    );
  }

  const prefillParentName = prefillParentId
    ? allCategories.find((c) => c.id === prefillParentId)?.name
    : undefined;

  const renderParentSelect = (field: ReturnType<typeof activeForm.register>) => (
    <>
      <Select {...field}>
        <option value="">Tanpa induk (level teratas)</option>
        {eligibleParents.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </Select>
      <small>Hanya kategori yang masih bisa punya level tambahan yang ditampilkan.</small>
    </>
  );

  const accentPreview = itemAccentVars(formColor);
  const renderAppearanceFields = (
    setValue: (name: 'color' | 'icon', value: string) => void,
  ) => (
    <>
      <div className="category-appearance-preview">
        <span className={`category-icon${accentPreview ? ' has-accent' : ' green'}`} style={accentPreview}>
          <CategoryIcon icon={formIcon} type={formType as Category['type']} />
        </span>
        <div>
          <strong>Pratinjau</strong>
          <small>Ikon dan warna ini muncul di daftar kategori dan baris transaksi.</small>
        </div>
      </div>
      <label>
        <span>Warna</span>
        <ColorPicker value={formColor} onChange={(hex) => setValue('color', hex)} />
      </label>
      <label>
        <span>Ikon</span>
        <IconPicker value={formIcon} type={formType as Category['type']} accentColor={formColor} onChange={(id) => setValue('icon', id)} />
      </label>
    </>
  );

  return (
    <AppLayout title={isEdit ? 'Edit Kategori' : 'Buat Kategori'} description="Buat atau edit kategori pemasukan atau pengeluaran.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <span className="badge dark">Kategori</span>
            <h2>{isEdit ? `Edit ${existing?.name ?? ''}` : prefillParentName ? `Subkategori baru di bawah ${prefillParentName}` : 'Buat kategori baru.'}</h2>
            <p>Subkategori selalu mengikuti tipe kategori induknya, dan susunannya bisa sampai tiga level.</p>
          </div>
          <div className="app-hero-actions"><Button to="/categories"><AppIcon name="back" /> Kembali</Button></div>
        </section>

        <section className="dashboard-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Informasi Kategori</h3><p>Nama, tipe, dan posisinya dalam susunan kategori.</p></div></div>
            {isEdit ? (
              <form className="form-stack" onSubmit={updateForm.handleSubmit(onUpdate)} noValidate>
                <label>
                  <span>Nama kategori</span>
                  <Input {...updateForm.register('name')} />
                  {updateForm.formState.errors.name && <span className="form-error">{updateForm.formState.errors.name.message}</span>}
                </label>
                <div className="form-two">
                  <label>
                    <span>Tipe</span>
                    <Select {...updateForm.register('type')}>
                      {categoryTypeOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </Select>
                  </label>
                  <label>
                    <span>Kategori induk</span>
                    {renderParentSelect(updateForm.register('parent_id'))}
                  </label>
                </div>
                {renderAppearanceFields((name, value) => updateForm.setValue(name, value, { shouldDirty: true }))}
                <div className="form-row-between">
                  <Button to="/categories">Batal</Button>
                  <div className="inline-actions">
                    <Button type="button" variant="danger" onClick={() => setDeleteOpen(true)}><AppIcon name="delete" /> Hapus</Button>
                    <Button type="submit" variant="primary" disabled={updateForm.formState.isSubmitting || updateMut.isPending}><AppIcon name="save" /> Simpan Kategori</Button>
                  </div>
                </div>
              </form>
            ) : (
              <form className="form-stack" onSubmit={createForm.handleSubmit(onCreate)} noValidate>
                <label>
                  <span>Nama kategori</span>
                  <Input {...createForm.register('name')} />
                  {createForm.formState.errors.name && <span className="form-error">{createForm.formState.errors.name.message}</span>}
                </label>
                <div className="form-two">
                  <label>
                    <span>Tipe</span>
                    <Select {...createForm.register('type')}>
                      {categoryTypeOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </Select>
                  </label>
                  <label>
                    <span>Kategori induk</span>
                    {renderParentSelect(createForm.register('parent_id'))}
                  </label>
                </div>
                {renderAppearanceFields((name, value) => createForm.setValue(name, value, { shouldDirty: true }))}
                <div className="form-row-between">
                  <Button to="/categories">Batal</Button>
                  <Button type="submit" variant="primary" disabled={createForm.formState.isSubmitting || createMut.isPending}><AppIcon name="save" /> Simpan Kategori</Button>
                </div>
              </form>
            )}
          </Card>
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Aturan Kategori</h3><p>Batasan yang menjaga kategorimu tetap rapi.</p></div></div>
            <div className="readiness-list">
              <div><span>Kedalaman</span><strong>Maksimal 3 level</strong></div>
              <div><span>Tipe induk</span><strong>Sama dengan tipe subkategorinya</strong></div>
              <div><span>Struktur</span><strong>Kategori tidak bisa jadi induk dirinya sendiri</strong></div>
            </div>
          </Card>
        </section>
      </div>

      <Modal open={deleteOpen} title="Hapus Kategori" description="Tindakan ini tidak bisa dibatalkan." onClose={() => setDeleteOpen(false)}>
        <div className="readiness-list">
          <div><span>Kategori</span><strong>{existing?.name ?? id}</strong></div>
          <div><span>Tipe</span><strong>{existing ? categoryTypeLabels[existing.type] : '—'}</strong></div>
          <div><span>Catatan</span><strong>Sebaiknya dihapus saat tidak ada transaksi yang memakainya.</strong></div>
        </div>
        <div className="modal-actions">
          <Button onClick={() => setDeleteOpen(false)}>Batal</Button>
          <Button variant="danger" onClick={onDelete} disabled={deleteMut.isPending}>Hapus Kategori</Button>
        </div>
      </Modal>
    </AppLayout>
  );
}
