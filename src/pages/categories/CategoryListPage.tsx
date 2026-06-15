import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { CategoryTree } from '../../components/master-data/CategoryTree';
import { Amount } from '../../components/finance/Amount';
import { mockCategories, flatCategories } from '../../data/mockCategories';
import type { Category } from '../../types/category';

export function CategoryListPage() {
  const columns = [
    { key: 'name', header: 'Category', render: (category: Category) => <div><strong>{category.icon} {category.name}</strong><span className="table-subtitle">{category.parentId ? `Child of ${category.parentId}` : 'Root category'}</span></div> },
    { key: 'type', header: 'Type', render: (category: Category) => <Badge tone={category.type === 'income' ? 'green' : 'orange'}>{category.type}</Badge> },
    { key: 'usage', header: 'Monthly Usage', align: 'right' as const, render: (category: Category) => <Amount value={category.monthlyUsage} variant={category.type === 'income' ? 'income' : 'expense'} /> },
    { key: 'count', header: 'Transactions', render: (category: Category) => category.transactionCount },
    { key: 'action', header: 'Action', render: (category: Category) => <Button size="small" to={`/categories/${category.id}/edit`}>Edit</Button> },
  ];
  return (
    <AppLayout title="Categories" description="Manage income and expense category hierarchy.">
      <div className="dashboard-page grid-stack"><section className="app-hero-card dashboard-hero"><div><span className="badge dark">● Category hierarchy</span><h2>Category tree rapi sampai 3 level untuk income dan expense.</h2><p>Category dipakai oleh transactions, budget, forecast, and analytics. Parent harus same type dan tidak boleh cycle.</p></div><div className="app-hero-actions"><Button to="/categories/new" variant="primary">+ Create Category</Button><Button to="/transactions/new">Use in Transaction</Button></div></section><section className="dashboard-grid"><Card className="panel-card"><div className="panel-head"><div><h3>Category Tree</h3><p>Root dan child category.</p></div></div><CategoryTree categories={mockCategories} /></Card><Card className="panel-card"><div className="panel-head"><div><h3>Most Used</h3><p>Top categories this month.</p></div></div><div className="expense-list">{flatCategories.slice(0,5).map((category) => <div key={category.id}><span><i className={`legend-dot ${category.color}`} />{category.name}</span><strong><Amount value={category.monthlyUsage} /></strong></div>)}</div></Card></section><Card className="panel-card"><div className="panel-head"><div><h3>Category Table</h3><p>Table pattern untuk list dan action.</p></div><Button to="/categories/new" size="small" variant="primary">+ Category</Button></div><DataTable columns={columns} data={flatCategories} getRowKey={(category) => category.id} /></Card></div>
    </AppLayout>
  );
}
