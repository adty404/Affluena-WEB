import { useState } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input, Textarea, Select } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { AppIcon } from '../../components/ui/AppIcon';
import { faqItems } from '../../constants/faq';
import { SettingsCard, SettingsHero } from './SettingsShared';

export function HelpPage() {
  const { showToast } = useToast();
  const [ticketOpen, setTicketOpen] = useState(false);

  return (
    <AppLayout title="Help & FAQ" description="Bantuan penggunaan Affluena dan kontak support.">
      <div className="dashboard-page grid-stack">
        <SettingsHero badge="● Help" title="Bantuan yang langsung mengarah ke flow nyata." description="FAQ menjelaskan konsep wallet balance, budget alert, recurring run, export, dan privacy tanpa placeholder kosong.">
          <Button to="/settings/about"><AppIcon name="success" /> About</Button>
          <Button variant="primary" onClick={() => setTicketOpen(true)}><AppIcon name="profile" /> Contact Support</Button>
        </SettingsHero>

        <section className="dashboard-grid">
          <SettingsCard icon="list" title="Frequently Asked Questions" description="Penjelasan singkat untuk flow utama Affluena.">
            <div className="faq-list">
              {faqItems.map((item) => (
                <details key={item.id} open={item.id === 'faq-balance'}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </SettingsCard>

          <SettingsCard icon="health" title="Support Channels" description="Akses bantuan berdasarkan tipe masalah.">
            <div className="settings-list">
              <div><span>Transaction issue</span><Button to="/transactions/filter" size="small"><AppIcon name="filter" /> Open filtered transactions</Button></div>
              <div><span>Export issue</span><Button to="/exports/history" size="small"><AppIcon name="download" /> Check export history</Button></div>
              <div><span>Alert issue</span><Button to="/alerts" size="small"><AppIcon name="warning" /> Open alerts</Button></div>
              <div><span>Security issue</span><Button to="/settings/security" size="small"><AppIcon name="settings" /> Security settings</Button></div>
            </div>
          </SettingsCard>
        </section>

        <Modal open={ticketOpen} title="Contact Support" description="Form ini membuat support ticket internal." onClose={() => setTicketOpen(false)}>
          <form className="form-stack" onSubmit={(event) => { event.preventDefault(); setTicketOpen(false); showToast('Support ticket created. Activity log updated.'); }}>
            <label><span>Topic</span><Select defaultValue="transaction"><option value="transaction">Transaction issue</option><option value="security">Security issue</option><option value="export">Export issue</option><option value="bug">UI bug report</option></Select></label>
            <label><span>Subject</span><Input defaultValue="Need help reviewing finance data" /></label>
            <label><span>Description</span><Textarea defaultValue="Describe the issue with route, screen size, and expected behavior." /></label>
            <div className="modal-actions"><Button onClick={() => setTicketOpen(false)}>Cancel</Button><Button type="submit" variant="primary"><AppIcon name="save" /> Submit Ticket</Button></div>
          </form>
        </Modal>
      </div>
    </AppLayout>
  );
}
