import { useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
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
    defaultValues: { name: '', type: defaultType, parent_id: prefillParentId },
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
      showToast('Category created.');
      navigate('/categories', { replace: true });
    } catch (err) {
      const apiErr = err as ApiError;
      showToast(apiErr.error || 'Failed to create category.');
    }
  }

  async function onUpdate(values: CategoryUpdateFormValues) {
    if (!id) return;
    try {
      await updateMut.mutateAsync(values);
      showToast('Category updated.');
      navigate('/categories', { replace: true });
    } catch (err) {
      const apiErr = err as ApiError;
      showToast(apiErr.error || 'Failed to update category.');
    }
  }

  async function onDelete() {
    if (!id) return;
    try {
      await deleteMut.mutateAsync(id);
      setDeleteOpen(false);
      showToast('Category deleted.');
      navigate('/categories', { replace: true });
    } catch (err) {
      const apiErr = err as ApiError;
      showToast(apiErr.error || 'Failed to delete category.');
    }
  }

  if (isEdit && isLoading) {
    return (
      <AppLayout title="Edit Category" description="Loading…">
        <div className="dashboard-page grid-stack"><Card className="panel-card"><div className="readiness-list"><div><span>Loading category</span><strong>…</strong></div></div></Card></div>
      </AppLayout>
    );
  }

  if (isEdit && !existing) {
    return (
      <AppLayout title="Edit Category" description="Category not found.">
        <div className="dashboard-page grid-stack"><Card className="panel-card"><div className="readiness-list"><div><span>Error</span><strong>Category not found.</strong></div></div><div className="modal-actions"><Button to="/categories">Back to list</Button></div></Card></div>
      </AppLayout>
    );
  }

  const prefillParentName = prefillParentId
    ? allCategories.find((c) => c.id === prefillParentId)?.name
    : undefined;

  const renderParentSelect = (field: ReturnType<typeof activeForm.register>) => (
    <>
      <Select {...field}>
        <option value="">No parent (top level)</option>
        {eligibleParents.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </Select>
      <small>Only categories with room for another level are listed.</small>
    </>
  );

  return (
    <AppLayout title={isEdit ? 'Edit Category' : 'Create Category'} description="Create or edit an income or expense category.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <span className="badge dark">● Category Form</span>
            <h2>{isEdit ? `Edit ${existing?.name ?? ''}` : prefillParentName ? `New subcategory under ${prefillParentName}` : 'Create a new category'}</h2>
            <p>A subcategory must share its parent's type, belong to you, and never form a loop. The tree supports up to three levels.</p>
          </div>
          <div className="app-hero-actions"><Button to="/categories"><AppIcon name="back" /> Back</Button></div>
        </section>

        <section className="dashboard-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Category Information</h3><p>Name, type, and where it sits in the hierarchy.</p></div></div>
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
                  <span>Notes</span>
                  <Textarea rows={3} placeholder="Optional notes, e.g. what this category is used for." />
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
                  <span>Notes</span>
                  <Textarea rows={3} placeholder="Optional notes, e.g. what this category is used for." />
                </label>
                <div className="form-row-between">
                  <Button to="/categories">Cancel</Button>
                  <Button type="submit" variant="primary" disabled={createForm.formState.isSubmitting || createMut.isPending}><AppIcon name="save" /> Save Category</Button>
                </div>
              </form>
            )}
          </Card>
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Rules</h3><p>What keeps the hierarchy valid.</p></div></div>
            <div className="readiness-list">
              <div><span>Max depth</span><strong>3 levels</strong></div>
              <div><span>Parent type</span><strong>same type</strong></div>
              <div><span>No cycle</span><strong>required</strong></div>
              <div><span>User isolation</span><strong>required</strong></div>
            </div>
          </Card>
        </section>
      </div>

      <Modal open={deleteOpen} title="Delete Category" description="This action cannot be undone." onClose={() => setDeleteOpen(false)}>
        <div className="readiness-list">
          <div><span>Category</span><strong>{existing?.name ?? id}</strong></div>
          <div><span>Type</span><strong>{existing ? categoryTypeLabels[existing.type] : '—'}</strong></div>
          <div><span>Note</span><strong>Best removed when no transactions reference it.</strong></div>
        </div>
        <div className="modal-actions">
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button variant="danger" onClick={onDelete} disabled={deleteMut.isPending}>Delete Category</Button>
        </div>
      </Modal>
    </AppLayout>
  );
}
