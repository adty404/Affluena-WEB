import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { CategoryTree } from '../../components/master-data/CategoryTree';
import { useCategories } from '../../hooks/useCategories';
import { categoryTypeLabels } from '../../schemas/category';
import type { Category } from '../../types/category';

export function CategoryListPage() {
  const { data, isLoading, error } = useCategories({ limit: 100 });
  const categories = data?.categories ?? [];
  const incomeCount = categories.filter((c) => c.type === 'income').length;
  const expenseCount = categories.filter((c) => c.type === 'expense').length;

  const columns = [
    { key: 'name', header: 'Category', render: (category: Category) => (
      <div>
        <strong>{category.name}</strong>
        <span className="table-subtitle">{category.parent_id ? `Child of ${category.parent_id}` : 'Root category'}</span>
      </div>
    ) },
    { key: 'type', header: 'Type', render: (category: Category) => <Badge tone={category.type === 'income' ? 'green' : 'orange'}>{categoryTypeLabels[category.type]}</Badge> },
    { key: 'action', header: 'Action', render: (category: Category) => <Button size="small" to={`/categories/${category.id}/edit`}>Edit</Button> },
  ];

  return (
    <AppLayout title="Categories" description="Manage income and expense category hierarchy.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <span className="badge dark">● Category hierarchy</span>
            <h2>Category tree rapi sampai 3 level untuk income dan expense.</h2>
            <p>Category dipakai oleh transactions, budget, forecast, and analytics. Parent harus same type dan tidak boleh cycle.</p>
          </div>
          <div className="app-hero-actions"><Button to="/categories/new" variant="primary">+ Create Category</Button></div>
        </section>

        {error ? (
          <Card className="panel-card">
            <div className="readiness-list">
              <div><span>Error</span><strong>{(error as { error?: string }).error ?? 'Gagal memuat kategori'}</strong></div>
            </div>
          </Card>
        ) : null}

        <section className="stat-grid">
          <Card className="stat-card"><span>Total Categories</span><strong>{isLoading ? '…' : categories.length}</strong><small>All categories</small></Card>
          <Card className="stat-card green"><span>Income</span><strong>{isLoading ? '…' : incomeCount}</strong><small>Income categories</small></Card>
          <Card className="stat-card orange"><span>Expense</span><strong>{isLoading ? '…' : expenseCount}</strong><small>Expense categories</small></Card>
        </section>

        {isLoading ? (
          <Card className="panel-card"><div className="readiness-list"><div><span>Memuat</span><strong>…</strong></div></div></Card>
        ) : categories.length === 0 ? (
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Belum ada kategori</h3><p>Buat kategori pertama untuk mulai mencatat transaksi.</p></div></div>
            <div className="modal-actions"><Button to="/categories/new" variant="primary">+ Create Category</Button></div>
          </Card>
        ) : (
          <>
            <section className="dashboard-grid">
              <Card className="panel-card">
                <div className="panel-head"><div><h3>Category Tree</h3><p>Root dan child category.</p></div></div>
                <CategoryTree categories={categories} />
              </Card>
            </section>
            <Card className="panel-card">
              <div className="panel-head"><div><h3>Category Table</h3><p>{data?.pagination.total ?? categories.length} kategori terdaftar.</p></div><Button to="/categories/new" size="small" variant="primary">+ Category</Button></div>
              <DataTable columns={columns} data={categories} getRowKey={(category) => category.id} />
            </Card>
          </>
        )}
      </div>
    </AppLayout>
  );
}
