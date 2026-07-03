import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { AppIcon } from '../../components/ui/AppIcon';
import { Amount } from '../../components/finance/Amount';
import { ProgressBar } from '../../components/finance/ProgressBar';
import { ColorPicker, normalizeItemColor } from '../../components/finance/ColorPicker';
import { useCategories } from '../../hooks/useCategories';
import { useBudget, useCreateBudget, useUpdateBudget, useDeleteBudget } from '../../hooks/useBudgets';
import { budgetSchema, type BudgetFormData } from '../../schemas/budget';

export function BudgetFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEdit = Boolean(id);

  const { data: categoriesData } = useCategories({ type: 'expense' });
  const expenseCategories = categoriesData?.categories ?? [];

  const { data: budget, isLoading: isBudgetLoading } = useBudget(id);
  const createBudget = useCreateBudget();
  const updateBudget = useUpdateBudget(id as string);
  const deleteBudget = useDeleteBudget();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      category_id: '',
      month: new Date().toISOString().slice(0, 7),
      limit_minor: 0,
      color: '',
      icon: '',
    },
  });

  useEffect(() => {
    if (isEdit && budget) {
      reset({
        category_id: budget.category_id,
        month: budget.month ? budget.month.slice(0, 7) : new Date().toISOString().slice(0, 7),
        limit_minor: budget.limit_minor,
        color: normalizeItemColor(budget.color),
        // No icon picker on web yet — round-trip whatever mobile stored.
        icon: budget.icon ?? '',
      });
    }
  }, [isEdit, budget, reset]);

  const onSubmit = async (data: BudgetFormData) => {
    try {
      if (isEdit) {
        await updateBudget.mutateAsync(data);
        showToast('Budget updated successfully.');
      } else {
        await createBudget.mutateAsync(data);
        showToast('Budget created successfully.');
      }
      navigate('/budgets');
    } catch (error) {
      showToast('Failed to save budget.');
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm('Are you sure you want to delete this budget?')) return;
    try {
      await deleteBudget.mutateAsync(id);
      showToast('Budget deleted successfully.');
      navigate('/budgets');
    } catch (error) {
      showToast('Failed to delete budget.');
    }
  };

  const watchCategoryId = watch('category_id');
  const watchLimitMinor = watch('limit_minor');
  const watchMonth = watch('month');

  const selectedCategory = expenseCategories.find(c => c.id === watchCategoryId);
  const categoryName = selectedCategory?.name ?? 'Select Category';
  const categoryIcon = 'categories';

  if (isEdit && isBudgetLoading) {
    return <AppLayout title="Edit Budget" description="Loading budget data..."><p>Loading...</p></AppLayout>;
  }

  return (
    <AppLayout title={isEdit ? 'Edit Budget' : 'New Budget'} description="Create dan edit monthly category budget dengan threshold warning/exceeded.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <span className="badge dark">● Budget form</span>
            <h2>{isEdit ? 'Update category budget tanpa kehilangan alert history.' : 'Buat budget bulanan per kategori expense.'}</h2>
            <p>Form ini memandu user memilih category, period, limit, threshold, dan note. Semua field dibuat jelas agar aman saat nanti connect API.</p>
          </div>
          <div className="app-hero-actions">
            <Button to="/budgets"><AppIcon name="back" /> Back</Button>
            <Button variant="primary" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}><AppIcon name="save" /> Save</Button>
          </div>
        </section>

        <section className="dashboard-grid">
          <Card className="panel-card form-panel">
            <div className="panel-head"><div><h3>Budget Information</h3><p>Pastikan satu category hanya punya satu budget di periode yang sama.</p></div></div>
            <form className="form-stack" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-two">
                <label>
                  <span>Expense Category</span>
                  <Select {...register('category_id')}>
                    <option value="">Select a category</option>
                    {expenseCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                  </Select>
                  {errors.category_id && <span className="field-error">{errors.category_id.message}</span>}
                  <small className="field-help">Budget hanya berlaku untuk expense category.</small>
                </label>
                <label>
                  <span>Period</span>
                  <Input type="month" {...register('month')} />
                  {errors.month && <span className="field-error">{errors.month.message}</span>}
                  <small className="field-help">Periode digunakan untuk menghitung actual spending.</small>
                </label>
              </div>
              <div className="form-two">
                <label>
                  <span>Budget Limit</span>
                  <Input 
                    type="number" 
                    {...register('limit_minor', { valueAsNumber: true })} 
                  />
                  {errors.limit_minor && <span className="field-error">{errors.limit_minor.message}</span>}
                  <small className="field-help">Backend sebaiknya menyimpan limit dalam minor unit.</small>
                </label>
                <label>
                  <span>Rollover Behavior</span>
                  <Select defaultValue="none"><option value="none">No rollover</option><option value="remaining">Rollover remaining to next month</option><option value="overspend">Rollover overspend to next month</option></Select>
                  <small className="field-help">Default aman: tidak rollover otomatis.</small>
                </label>
              </div>
              <div className="form-two">
                <label>
                  <span>Warning Threshold</span>
                  <Select defaultValue="80"><option value="70">70%</option><option value="75">75%</option><option value="80">80%</option><option value="90">90%</option></Select>
                  <small className="field-help">Alert pertama saat usage melewati threshold ini.</small>
                </label>
                <label>
                  <span>Exceeded Threshold</span>
                  <Select defaultValue="100"><option value="95">95%</option><option value="100">100%</option><option value="110">110%</option></Select>
                  <small className="field-help">Status exceeded saat actual melewati limit ini.</small>
                </label>
              </div>
              <label>
                <span>Warna</span>
                <ColorPicker
                  value={watch('color')}
                  onChange={(hex) => setValue('color', hex, { shouldDirty: true })}
                />
                <small className="field-help">Warna yang sama dipakai di aplikasi mobile.</small>
              </label>
              <label>
                <span>Note</span>
                <Textarea defaultValue="" />
                <small className="field-help">Tambahkan konteks agar budget mudah dipahami saat review.</small>
              </label>
              <div className="form-row-between">
                <div>
                  <Button to="/budgets">Cancel</Button>
                  {isEdit && (
                    <Button type="button" variant="danger" onClick={handleDelete} disabled={deleteBudget.isPending} style={{ marginLeft: '8px' }}>
                      <AppIcon name="delete" /> Delete
                    </Button>
                  )}
                </div>
                <Button type="submit" variant="primary" disabled={isSubmitting}><AppIcon name="save" /> Save Budget</Button>
              </div>
            </form>
          </Card>

          <div className="grid-stack">
            <Card className="panel-card budget-preview-card">
              <div className="preview-icon"><AppIcon name={categoryIcon} /></div>
              <Badge tone="green">safe</Badge>
              <h3>{categoryName}</h3>
              <p>{watchMonth || 'YYYY-MM'} · warning at 80%</p>
              <strong><Amount value={watchLimitMinor || 0} /></strong>
              <ProgressBar value={0} tone="green" />
            </Card>
            <Card className="panel-card">
              <div className="panel-head"><div><h3>Validation Rules</h3><p>Guardrail untuk UX form.</p></div></div>
              <div className="readiness-list">
                <div><span>Unique budget</span><Badge tone="blue">category + period</Badge></div>
                <div><span>Actual source</span><Badge tone="purple">expense transactions</Badge></div>
                <div><span>Warning alert</span><Badge tone="orange">80%</Badge></div>
                <div><span>Exceeded alert</span><Badge tone="red">100%</Badge></div>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
