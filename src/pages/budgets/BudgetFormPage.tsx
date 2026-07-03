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
        showToast('Anggaran berhasil diperbarui.');
      } else {
        await createBudget.mutateAsync(data);
        showToast('Anggaran berhasil dibuat.');
      }
      navigate('/budgets');
    } catch (error) {
      showToast('Gagal menyimpan anggaran.');
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm('Yakin ingin menghapus anggaran ini?')) return;
    try {
      await deleteBudget.mutateAsync(id);
      showToast('Anggaran berhasil dihapus.');
      navigate('/budgets');
    } catch (error) {
      showToast('Gagal menghapus anggaran.');
    }
  };

  const watchCategoryId = watch('category_id');
  const watchLimitMinor = watch('limit_minor');
  const watchMonth = watch('month');

  const selectedCategory = expenseCategories.find(c => c.id === watchCategoryId);
  const categoryName = selectedCategory?.name ?? 'Pilih Kategori';
  const categoryIcon = 'categories';

  if (isEdit && isBudgetLoading) {
    return <AppLayout title="Edit Anggaran" description="Memuat data anggaran..."><p>Memuat...</p></AppLayout>;
  }

  return (
    <AppLayout title={isEdit ? 'Edit Anggaran' : 'Anggaran Baru'} description="Buat dan atur batas belanja bulanan per kategori.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <span className="badge dark">● Anggaran</span>
            <h2>{isEdit ? 'Perbarui anggaran tanpa kehilangan riwayat notifikasi.' : 'Buat anggaran bulanan per kategori pengeluaran.'}</h2>
            <p>Pilih kategori, tentukan periode dan batas, lalu biarkan Affluena memantau pengeluaranmu.</p>
          </div>
          <div className="app-hero-actions">
            <Button to="/budgets"><AppIcon name="back" /> Kembali</Button>
            <Button variant="primary" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}><AppIcon name="save" /> Simpan</Button>
          </div>
        </section>

        <section className="dashboard-grid">
          <Card className="panel-card form-panel">
            <div className="panel-head"><div><h3>Informasi Anggaran</h3><p>Satu kategori hanya punya satu anggaran di bulan yang sama.</p></div></div>
            <form className="form-stack" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-two">
                <label>
                  <span>Kategori Pengeluaran</span>
                  <Select {...register('category_id')}>
                    <option value="">Pilih kategori</option>
                    {expenseCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                  </Select>
                  {errors.category_id && <span className="field-error">{errors.category_id.message}</span>}
                  <small className="field-help">Anggaran hanya berlaku untuk kategori pengeluaran.</small>
                </label>
                <label>
                  <span>Periode</span>
                  <Input type="month" {...register('month')} />
                  {errors.month && <span className="field-error">{errors.month.message}</span>}
                  <small className="field-help">Periode dipakai untuk menghitung pengeluaran aktual.</small>
                </label>
              </div>
              <div className="form-two">
                <label>
                  <span>Batas Bulanan (Rp)</span>
                  <Input
                    type="number"
                    {...register('limit_minor', { valueAsNumber: true })}
                  />
                  {errors.limit_minor && <span className="field-error">{errors.limit_minor.message}</span>}
                </label>
                <label>
                  <span>Sisa Anggaran</span>
                  <Select defaultValue="none"><option value="none">Tidak dibawa ke bulan berikutnya</option><option value="remaining">Sisa dibawa ke bulan berikutnya</option><option value="overspend">Kelebihan belanja dibawa ke bulan berikutnya</option></Select>
                  <small className="field-help">Bawaan: sisa tidak dibawa otomatis ke bulan berikutnya.</small>
                </label>
              </div>
              <div className="form-two">
                <label>
                  <span>Batas Notifikasi Peringatan</span>
                  <Select defaultValue="80"><option value="70">70%</option><option value="75">75%</option><option value="80">80%</option><option value="90">90%</option></Select>
                  <small className="field-help">Notifikasi pertama dikirim saat penggunaan melewati angka ini.</small>
                </label>
                <label>
                  <span>Batas Notifikasi Terlampaui</span>
                  <Select defaultValue="100"><option value="95">95%</option><option value="100">100%</option><option value="110">110%</option></Select>
                  <small className="field-help">Anggaran dianggap terlampaui saat pengeluaran melewati angka ini.</small>
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
                <span>Catatan</span>
                <Textarea defaultValue="" />
                <small className="field-help">Tambahkan konteks agar anggaran mudah dipahami.</small>
              </label>
              <div className="form-row-between">
                <div>
                  <Button to="/budgets">Batal</Button>
                  {isEdit && (
                    <Button type="button" variant="danger" onClick={handleDelete} disabled={deleteBudget.isPending} style={{ marginLeft: '8px' }}>
                      <AppIcon name="delete" /> Hapus
                    </Button>
                  )}
                </div>
                <Button type="submit" variant="primary" disabled={isSubmitting}><AppIcon name="save" /> Simpan Anggaran</Button>
              </div>
            </form>
          </Card>

          <div className="grid-stack">
            <Card className="panel-card budget-preview-card">
              <div className="preview-icon"><AppIcon name={categoryIcon} /></div>
              <Badge tone="green">Aman</Badge>
              <h3>{categoryName}</h3>
              <p>{watchMonth || 'YYYY-MM'} · peringatan di 80%</p>
              <strong><Amount value={watchLimitMinor || 0} /></strong>
              <ProgressBar value={0} tone="green" />
            </Card>
            <Card className="panel-card">
              <div className="panel-head"><div><h3>Cara Kerja Anggaran</h3><p>Hal penting yang perlu kamu tahu.</p></div></div>
              <div className="readiness-list">
                <div><span>Satu anggaran</span><Badge tone="blue">per kategori per bulan</Badge></div>
                <div><span>Sumber data</span><Badge tone="purple">transaksi pengeluaran</Badge></div>
                <div><span>Peringatan</span><Badge tone="orange">80%</Badge></div>
                <div><span>Terlampaui</span><Badge tone="red">100%</Badge></div>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
