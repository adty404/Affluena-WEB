import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { useWallets } from '../../hooks/useWallets';
import { useCategories } from '../../hooks/useCategories';
import { useQuickEntryTemplate, useCreateQuickEntryTemplate, useUpdateQuickEntryTemplate } from '../../hooks/useQuickEntry';
import { quickEntryTemplateSchema, type QuickEntryTemplateInput } from '../../schemas/quickEntry';
import { useEffect } from 'react';

export function QuickEntryFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEdit = Boolean(id);

  const { data: template, isLoading: isLoadingTemplate } = useQuickEntryTemplate(id || '');
  const { data: walletsData } = useWallets();
  const { data: categoriesData } = useCategories();
  
  const createMutation = useCreateQuickEntryTemplate();
  const updateMutation = useUpdateQuickEntryTemplate();

  const wallets = walletsData?.wallets || [];
  const categories = categoriesData?.categories || [];

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch } = useForm<QuickEntryTemplateInput>({
    resolver: zodResolver(quickEntryTemplateSchema),
    defaultValues: {
      type: 'expense',
      amount_minor: 0,
    }
  });

  useEffect(() => {
    if (template) {
      reset({
        name: template.name,
        type: template.type as any,
        wallet_id: template.wallet_id,
        to_wallet_id: template.to_wallet_id || undefined,
        category_id: template.category_id || undefined,
        amount_minor: template.amount_minor,
        note: template.note || '',
      });
    }
  }, [template, reset]);

  const type = watch('type');

  const onSubmit = async (data: QuickEntryTemplateInput) => {
    try {
      if (isEdit && id) {
        await updateMutation.mutateAsync({ id, data });
        showToast('Quick entry template updated successfully');
      } else {
        await createMutation.mutateAsync(data);
        showToast('Quick entry template created successfully');
      }
      navigate('/quick-entry');
    } catch (error) {
      showToast('Failed to save quick entry template');
    }
  };

  if (isEdit && isLoadingTemplate) {
    return <AppLayout title="Edit Quick Entry" description="Loading..."><div className="p-8">Loading...</div></AppLayout>;
  }

  return (
    <AppLayout title={isEdit ? 'Edit Quick Entry' : 'New Quick Entry'} description="Create reusable transaction template.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div><span className="badge dark">● Quick Entry Form</span><h2>{isEdit ? 'Edit template transaksi rutin.' : 'Buat template transaksi rutin.'}</h2><p>Execute quick entry wajib memakai confirmation modal saat production.</p></div>
          <div className="app-hero-actions"><Button to="/quick-entry">Back</Button><Button variant="primary" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>Save Template</Button></div>
        </section>
        
        <Card className="panel-card">
          <div className="panel-head"><div><h3>Template Information</h3><p>Field template untuk transaksi cepat.</p></div></div>
          <form className="form-stack" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-two">
              <label>
                <span>Name</span>
                <Input {...register('name')} />
              </label>
              <label>
                <span>Type</span>
                <Select {...register('type')}>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                  <option value="transfer">Transfer</option>
                  <option value="adjustment">Adjustment</option>
                </Select>
              </label>
            </div>
            
            <div className="form-two">
              <label>
                <span>Wallet</span>
                <Select {...register('wallet_id')}>
                  <option value="">Select Wallet</option>
                  {wallets.map((wallet) => <option key={wallet.id} value={wallet.id}>{wallet.name}</option>)}
                </Select>
              </label>
              <label>
                <span>Destination Wallet (for Transfer)</span>
                <Select {...register('to_wallet_id')} disabled={type !== 'transfer'}>
                  <option value="">Not used</option>
                  {wallets.map((wallet) => <option key={wallet.id} value={wallet.id}>{wallet.name}</option>)}
                </Select>
              </label>
            </div>
            
            <div className="form-two">
              <label>
                <span>Category</span>
                <Select {...register('category_id')} disabled={type === 'transfer'}>
                  <option value="">Select Category</option>
                  {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                </Select>
              </label>
              <label>
                <span>Amount</span>
                <Input 
                  type="number" 
                  {...register('amount_minor', { valueAsNumber: true })} 
                  
                />
              </label>
            </div>
            
            <label>
              <span>Note</span>
              <Textarea {...register('note')} />
            </label>
            
            <div className="form-row-between">
              <Button to="/quick-entry">Cancel</Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Template'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
