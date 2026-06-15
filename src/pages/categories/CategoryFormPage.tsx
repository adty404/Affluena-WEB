import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { AppIcon } from '../../components/ui/AppIcon';
import { flatCategories } from '../../data/mockCategories';

export function CategoryFormPage() {
  const { id } = useParams();
  const { showToast } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const category = flatCategories.find((item) => item.id === id) ?? flatCategories[0];
  const isEdit = Boolean(id);
  return (
    <AppLayout title={isEdit ? 'Edit Category' : 'Create Category'} description="Create/edit income atau expense category dengan parent validation.">
      <div className="dashboard-page grid-stack">
        <section className="app-hero-card dashboard-hero"><div><span className="badge dark">● Category Form</span><h2>{isEdit ? `Edit ${category.name}` : 'Buat category baru untuk transaksi dan budget.'}</h2><p>Parent category harus same type, same user, dan tidak boleh cycle.</p></div><div className="app-hero-actions"><Button to="/categories">Back</Button><Button variant="primary" onClick={() => showToast('Category saved successfully.') }><AppIcon name="save" /> Save Category</Button></div></section>
        <section className="dashboard-grid"><Card className="panel-card"><div className="panel-head"><div><h3>Category Information</h3><p>Field utama categories table.</p></div></div><form className="form-stack" onSubmit={(event) => { event.preventDefault(); showToast('Category berhasil disimpan.'); }}><div className="form-two"><label><span>Name</span><Input defaultValue={category.name} /></label><label><span>Type</span><Select defaultValue={category.type}><option value="expense">expense</option><option value="income">income</option></Select></label></div><div className="form-two"><label><span>Icon</span><Input defaultValue={category.icon} /></label><label><span>Color</span><Select defaultValue={category.color}><option>green</option><option>blue</option><option>orange</option><option>purple</option><option>red</option><option>gray</option></Select></label></div><label><span>Parent category</span><Select defaultValue={category.parentId ?? ''}><option value="">No parent</option>{flatCategories.filter((item) => item.type === category.type).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</Select></label><label><span>Description</span><Textarea defaultValue="Digunakan untuk klasifikasi transaksi dan ringkasan budget bulanan." /></label><div className="form-row-between"><Button to="/categories">Cancel</Button><div className="inline-actions"><Button variant="danger" onClick={() => setDeleteOpen(true)}><AppIcon name="delete" /> Delete</Button><Button type="submit" variant="primary"><AppIcon name="save" /> Save Category</Button></div></div></form></Card><Card className="panel-card"><div className="panel-head"><div><h3>Validation</h3><p>Rules penting untuk backend.</p></div></div><div className="readiness-list"><div><span>Max depth</span><strong>3 levels</strong></div><div><span>Parent type</span><strong>same type</strong></div><div><span>No cycle</span><strong>required</strong></div><div><span>User isolation</span><strong>required</strong></div></div></Card></section>
      </div>
      <Modal open={deleteOpen} title="Delete Category" description="Kategori yang punya transaksi sebaiknya diarsipkan agar histori tetap utuh." onClose={() => setDeleteOpen(false)}>
        <div className="readiness-list"><div><span>Category</span><strong>{category.name}</strong></div><div><span>Type</span><strong>{category.type}</strong></div><div><span>Recommended action</span><strong>Archive category</strong></div></div>
        <div className="modal-actions"><Button onClick={() => setDeleteOpen(false)}>Cancel</Button><Button variant="danger" onClick={() => { setDeleteOpen(false); showToast('Category archived safely.'); }}>Archive Category</Button></div>
      </Modal>
    </AppLayout>
  );
}
