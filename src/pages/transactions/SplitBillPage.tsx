import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { Amount } from '../../components/finance/Amount';
import { useToast } from '../../components/ui/Toast';
import { AppIcon } from '../../components/ui/AppIcon';
import { useWallets } from '../../hooks/useWallets';
import { useCategories } from '../../hooks/useCategories';
import { useSplitBill } from '../../hooks/useTransactions';
import { splitTransactionSchema, type SplitTransactionFormData } from '../../schemas/transaction';

export function SplitBillPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [participantOpen, setParticipantOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  
  const { data: walletsData } = useWallets();
  const { data: categoriesData } = useCategories();
  const splitMutation = useSplitBill();

  const { register, control, handleSubmit, formState: { errors }, watch, getValues } = useForm<SplitTransactionFormData>({
    resolver: zodResolver(splitTransactionSchema),
    defaultValues: {
      total_amount_minor: 0,
      transaction_at: new Date().toISOString().slice(0, 16),
      splits: [],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'splits',
  });

  const [newParticipant, setNewParticipant] = useState({
    counterparty_name: '',
    amount_minor: 0,
    disbursement_category_id: '',
    payment_category_id: '',
  });

  const watchTotal = watch('total_amount_minor') || 0;
  const watchSplits = watch('splits') || [];
  
  const receivable = watchSplits.reduce((sum, item) => sum + (item.amount_minor || 0), 0);
  const userShare = watchTotal - receivable;

  const handleAddParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newParticipant.counterparty_name || newParticipant.amount_minor <= 0 || !newParticipant.disbursement_category_id || !newParticipant.payment_category_id) {
      showToast('Please fill all participant fields correctly');
      return;
    }
    append(newParticipant);
    setParticipantOpen(false);
    setNewParticipant({
      counterparty_name: '',
      amount_minor: 0,
      disbursement_category_id: '',
      payment_category_id: '',
    });
    showToast('Participant added to split bill.');
  };

  const onSubmit = (data: SplitTransactionFormData) => {
    const payload = {
      ...data,
      transaction_at: data.transaction_at ? new Date(data.transaction_at).toISOString() : undefined,
    };

    splitMutation.mutate(payload, {
      onSuccess: () => {
        showToast('Split bill created successfully.');
        navigate('/transactions');
      },
      onError: (err: any) => {
        showToast(err.message || 'Failed to create split bill');
      }
    });
  };

  return (
    <AppLayout title="Split Bill" description="Create one expense transaction and receivable debts for participants.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero">
          <div>
            <span className="badge dark">● Split Bill</span>
            <h2>Split bill harus atomic: expense berhasil, receivable debt juga harus berhasil.</h2>
            <p>Jika debt creation gagal, semua write sebaiknya rollback. UI menampilkan total bill, user share, participant share, dan receivable total.</p>
          </div>
          <div className="app-hero-actions">
            <Button to="/transactions">Back</Button>
            <Button variant="primary" onClick={() => setConfirmOpen(true)} disabled={watchSplits.length === 0 || userShare < 0}>
              <AppIcon name="split" /> Create Split Bill
            </Button>
          </div>
        </section>
        <section className="stat-grid">
          <Card className="stat-card"><span>Total Bill</span><strong><Amount value={watchTotal} variant="expense" /></strong><small>Dinner bill</small></Card>
          <Card className="stat-card blue"><span>User Share</span><strong><Amount value={userShare} variant="expense" /></strong><small>Final expense</small></Card>
          <Card className="stat-card purple"><span>Receivable</span><strong><Amount value={receivable} variant="income" /></strong><small>Created as debt</small></Card>
          <Card className="stat-card orange"><span>Participants</span><strong>{watchSplits.length}</strong><small>Team members</small></Card>
        </section>
        <section className="dashboard-grid transaction-entry-grid">
          <Card className="panel-card">
            <div className="panel-head"><div><h3>Bill Information</h3><p>Expense transaction source.</p></div></div>
            <form className="form-stack">
              <div className="form-two">
                <label>
                  <span>Wallet</span>
                  <Select {...register('wallet_id')}>
                    <option value="">Select Wallet</option>
                    {walletsData?.wallets?.map((wallet) => <option key={wallet.id} value={wallet.id}>{wallet.name}</option>)}
                  </Select>
                  {errors.wallet_id && <span className="error-text">{errors.wallet_id.message}</span>}
                </label>
                <label>
                  <span>Category</span>
                  <Select {...register('category_id')}>
                    <option value="">Select Category</option>
                    {categoriesData?.categories?.filter(c => c.type === 'expense').map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </Select>
                  {errors.category_id && <span className="error-text">{errors.category_id.message}</span>}
                </label>
              </div>
              <div className="form-two">
                <label>
                  <span>Total Amount (Rp)</span>
                  <Input type="number" {...register('total_amount_minor', { valueAsNumber: true })} />
                  {errors.total_amount_minor && <span className="error-text">{errors.total_amount_minor.message}</span>}
                </label>
                <label>
                  <span>Date</span>
                  <Input type="datetime-local" {...register('transaction_at')} />
                  {errors.transaction_at && <span className="error-text">{errors.transaction_at.message}</span>}
                </label>
              </div>
              <label>
                <span>Note</span>
                <Textarea {...register('note')} />
                {errors.note && <span className="error-text">{errors.note.message}</span>}
              </label>
            </form>
          </Card>
          <Card className="panel-card">
            <div className="panel-head">
              <div><h3>Participants</h3><p>Receivable debt per participant.</p></div>
              <Button size="small" onClick={() => setParticipantOpen(true)}><AppIcon name="add" /> Add</Button>
            </div>
            <div className="participant-list">
              {fields.map((item, index) => (
                <div key={item.id} className="participant-row">
                  <div>
                    <strong>{item.counterparty_name}</strong>
                  </div>
                  <Amount value={item.amount_minor} variant="income" />
                  <Button size="small" onClick={() => remove(index)}>Remove</Button>
                </div>
              ))}
              {fields.length === 0 && <p>No participants added yet.</p>}
              {errors.splits && <span className="error-text">{errors.splits.message}</span>}
            </div>
          </Card>
        </section>
      </div>

      <Modal open={participantOpen} title="Add Participant" description="Tambahkan participant dan share amount untuk receivable debt." onClose={() => setParticipantOpen(false)}>
        <form className="form-stack" onSubmit={handleAddParticipant}>
          <div className="form-two">
            <label>
              <span>Name</span>
              <Input 
                placeholder="Participant name" 
                value={newParticipant.counterparty_name} 
                onChange={(e) => setNewParticipant({...newParticipant, counterparty_name: e.target.value})} 
              />
            </label>
            <label>
              <span>Share Amount (Rp)</span>
              <Input 
                type="number" 
                value={newParticipant.amount_minor || ''} 
                onChange={(e) => setNewParticipant({...newParticipant, amount_minor: parseInt(e.target.value) || 0})} 
              />
            </label>
          </div>
          <div className="form-two">
            <label>
              <span>Disbursement Category</span>
              <Select 
                value={newParticipant.disbursement_category_id} 
                onChange={(e) => setNewParticipant({...newParticipant, disbursement_category_id: e.target.value})}
              >
                <option value="">Select Category</option>
                {categoriesData?.categories?.filter(c => c.type === 'expense').map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </Select>
            </label>
            <label>
              <span>Payment Category</span>
              <Select 
                value={newParticipant.payment_category_id} 
                onChange={(e) => setNewParticipant({...newParticipant, payment_category_id: e.target.value})}
              >
                <option value="">Select Category</option>
                {categoriesData?.categories?.filter(c => c.type === 'income').map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </Select>
            </label>
          </div>
          <div className="modal-actions">
            <Button onClick={() => setParticipantOpen(false)} type="button">Cancel</Button>
            <Button type="submit" variant="primary">Add Participant</Button>
          </div>
        </form>
      </Modal>

      <Modal open={confirmOpen} title="Create Split Bill" description="Review atomic write plan sebelum split bill dibuat." onClose={() => setConfirmOpen(false)}>
        <div className="readiness-list">
          <div><span>Expense transaction</span><strong><Amount value={userShare} variant="expense" /></strong></div>
          <div><span>Receivable debts</span><strong><Amount value={receivable} variant="income" /></strong></div>
          <div><span>Participants</span><strong>{watchSplits.length} people</strong></div>
          <div><span>Rollback rule</span><strong>Cancel all writes if one fails</strong></div>
        </div>
        <div className="modal-actions">
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={() => { setConfirmOpen(false); handleSubmit(onSubmit)(); }} disabled={splitMutation.isPending}>
            {splitMutation.isPending ? 'Creating...' : 'Confirm Split Bill'}
          </Button>
        </div>
      </Modal>
    </AppLayout>
  );
}
