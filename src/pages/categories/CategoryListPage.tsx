import { useState } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import { AppIcon } from '../../components/ui/AppIcon';
import { useToast } from '../../components/ui/Toast';
import { CategoryTree } from '../../components/master-data/CategoryTree';
import { useCategories, useDeleteCategory } from '../../hooks/useCategories';
import { categoryTypeLabels } from '../../schemas/category';
import type { ApiError } from '../../api/types';
import type { Category } from '../../types/category';

export function CategoryListPage() {
  const { showToast } = useToast();
  const { data, isLoading, error } = useCategories({ limit: 100 });
  const deleteMut = useDeleteCategory();
  const [pendingDelete, setPendingDelete] = useState<Category | null>(null);

  const categories = data?.categories ?? [];
  const incomeCount = categories.filter((c) => c.type === 'income').length;
  const expenseCount = categories.filter((c) => c.type === 'expense').length;

  async function confirmDelete() {
    if (!pendingDelete) return;
    try {
      await deleteMut.mutateAsync(pendingDelete.id);
      showToast(`Category "${pendingDelete.name}" deleted.`);
      setPendingDelete(null);
    } catch (err) {
      showToast((err as ApiError).error || 'Failed to delete category.');
    }
  }

  return (
    <AppLayout title="Categories" description="Manage your income and expense category hierarchy.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <span className="badge dark">● Category hierarchy</span>
            <h2>Organise income and expense into a clean tree, up to three levels deep.</h2>
            <p>Categories power your transactions, budgets, forecasts, and analytics. A subcategory always shares its parent's type, and the structure can never loop back on itself.</p>
          </div>
          <div className="app-hero-actions"><Button to="/categories/new" variant="primary"><AppIcon name="add" /> New Category</Button></div>
        </section>

        {error ? (
          <Card className="panel-card">
            <div className="readiness-list">
              <div><span>Error</span><strong>{(error as { error?: string }).error ?? 'Failed to load categories'}</strong></div>
            </div>
          </Card>
        ) : null}

        <section className="stat-grid">
          <Card className="stat-card"><span>Total Categories</span><strong>{isLoading ? '…' : categories.length}</strong><small>Across all types</small></Card>
          <Card className="stat-card green"><span>Income</span><strong>{isLoading ? '…' : incomeCount}</strong><small>Income categories</small></Card>
          <Card className="stat-card orange"><span>Expense</span><strong>{isLoading ? '…' : expenseCount}</strong><small>Expense categories</small></Card>
        </section>

        {isLoading ? (
          <Card className="panel-card"><div className="readiness-list"><div><span>Loading categories</span><strong>…</strong></div></div></Card>
        ) : categories.length === 0 ? (
          <Card className="panel-card">
            <EmptyState
              icon={<div className="category-icon green"><AppIcon name="categories" /></div>}
              title="No categories yet"
              description="Start with a top-level category like Salary or Groceries, then nest subcategories under it (for example Groceries → Supermarket → Weekly shop). You can go up to three levels deep per type."
              action={(
                <div className="modal-actions">
                  <Button to="/categories/new?type=income"><AppIcon name="add" /> Income category</Button>
                  <Button to="/categories/new?type=expense" variant="primary"><AppIcon name="add" /> Expense category</Button>
                </div>
              )}
            />
          </Card>
        ) : (
          <Card className="panel-card category-tree-card">
            <div className="panel-head">
              <div>
                <h3>Category Tree</h3>
                <p>Expand a branch to see its subcategories. Use the row actions to add a subcategory, edit, or delete.</p>
              </div>
              <Button to="/categories/new" size="small" variant="primary"><AppIcon name="add" /> New Category</Button>
            </div>
            <CategoryTree categories={categories} onDelete={setPendingDelete} />
          </Card>
        )}
      </div>

      <Modal
        open={Boolean(pendingDelete)}
        title="Delete Category"
        description="This action cannot be undone."
        onClose={() => setPendingDelete(null)}
      >
        <div className="readiness-list">
          <div><span>Category</span><strong>{pendingDelete?.name ?? '—'}</strong></div>
          <div><span>Type</span><strong>{pendingDelete ? categoryTypeLabels[pendingDelete.type] : '—'}</strong></div>
          <div><span>Note</span><strong>Deleting a parent may affect its subcategories.</strong></div>
        </div>
        <div className="modal-actions">
          <Button onClick={() => setPendingDelete(null)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete} disabled={deleteMut.isPending}>
            <AppIcon name="delete" /> Delete Category
          </Button>
        </div>
      </Modal>
    </AppLayout>
  );
}
