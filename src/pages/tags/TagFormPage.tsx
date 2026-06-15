import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { TagPill } from '../../components/master-data/TagPill';
import { useToast } from '../../components/ui/Toast';
import { AppIcon } from '../../components/ui/AppIcon';
import { mockTags } from '../../data/mockTags';

export function TagFormPage() {
  const { id } = useParams();
  const { showToast } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const tag = mockTags.find((item) => item.id === id) ?? mockTags[0];
  const isEdit = Boolean(id);
  return (
    <AppLayout title={isEdit ? 'Edit Tag' : 'Create Tag'} description="Create/edit transaction tag with color and unique name.">
      <div className="dashboard-page grid-stack"><section className="app-hero-card dashboard-hero"><div><span className="badge dark">● Tag Form</span><h2>{isEdit ? `Edit #${tag.name}` : 'Buat tag baru untuk filtering transaksi.'}</h2><p>Nama tag unique per user dan akan tampil sebagai chip/pill di transaksi.</p></div><div className="app-hero-actions"><Button to="/tags">Back</Button><Button variant="primary" onClick={() => showToast('Tag saved successfully.') }><AppIcon name="save" /> Save Tag</Button></div></section><section className="dashboard-grid"><Card className="panel-card"><div className="panel-head"><div><h3>Tag Information</h3><p>Field utama tags table.</p></div></div><form className="form-stack" onSubmit={(event) => { event.preventDefault(); showToast('Tag berhasil disimpan.'); }}><div className="form-two"><label><span>Name</span><Input defaultValue={tag.name} /></label><label><span>Color</span><Select defaultValue={tag.color}><option>green</option><option>blue</option><option>orange</option><option>purple</option><option>red</option><option>gray</option></Select></label></div><label><span>Description</span><Textarea defaultValue="Tag untuk memudahkan filter transaksi dan laporan lintas kategori." /></label><div className="form-row-between"><Button to="/tags">Cancel</Button><div className="inline-actions"><Button variant="danger" onClick={() => setDeleteOpen(true)}><AppIcon name="delete" /> Delete</Button><Button type="submit" variant="primary"><AppIcon name="save" /> Save Tag</Button></div></div></form></Card><Card className="panel-card"><div className="panel-head"><div><h3>Preview</h3><p>Tag chip appearance.</p></div></div><div className="tag-preview"><TagPill tag={tag} active /><p>Preview di transaction form: tag bisa multiple select dan dipakai filter/report.</p></div><div className="readiness-list"><div><span>Unique per user</span><strong>required</strong></div><div><span>Transaction relation</span><strong>transaction_tags</strong></div><div><span>Filter support</span><strong>Transaction module</strong></div></div></Card></section></div>
      <Modal open={deleteOpen} title="Delete Tag" description="Tag yang pernah dipakai transaksi sebaiknya diarsipkan." onClose={() => setDeleteOpen(false)}>
        <div className="readiness-list"><div><span>Tag</span><strong>#{tag.name}</strong></div><div><span>Color</span><strong>{tag.color}</strong></div><div><span>Recommended action</span><strong>Archive tag</strong></div></div>
        <div className="modal-actions"><Button onClick={() => setDeleteOpen(false)}>Cancel</Button><Button variant="danger" onClick={() => { setDeleteOpen(false); showToast('Tag archived safely.'); }}>Archive Tag</Button></div>
      </Modal>
    </AppLayout>
  );
}
