import { useState } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import { AppIcon } from '../../components/ui/AppIcon';
import { SettingRow, SettingsCard, SettingsHero, SettingsToggle } from './SettingsShared';
import { useActivities } from '../../hooks/useActivities';
import { useAmountVisibility } from '../../hooks/useAmountVisibility';
import { humanizeAction, humanizeEntity, relativeTime } from '../../lib/auditLabels';

export function PrivacyPage() {
  // Persisted global setting (shared with the Beranda eye toggle): while
  // masked, balances/summaries render "Rp ••••••" — the ledger stays visible.
  const { amountsVisible, toggleAmountsVisible } = useAmountVisibility();
  const maskAmounts = !amountsVisible;
  const [shareAnalytics, setShareAnalytics] = useState(true);
  const [auditOpen, setAuditOpen] = useState(false);
  const { data: activitiesData, isLoading: activitiesLoading } = useActivities({ limit: 3 });
  const recentActivities = (activitiesData?.data ?? []).slice(0, 3);

  return (
    <AppLayout title="Privasi Data" description="Kontrol visibilitas data, penyamaran nominal, dan akses audit.">
      <div className="dashboard-page grid-stack">
        <SettingsHero badge="Privasi" title="Kontrol privasi untuk data keuangan pribadi." description="Penyamaran nominal, audit data, dan ekspor data pribadi dibuat transparan supaya kamu tetap pegang kendali.">
          <Button to="/settings/data"><AppIcon name="download" /> Kelola Data</Button>
          <Button variant="primary" onClick={() => setAuditOpen(true)}><AppIcon name="list" /> Audit Privasi</Button>
        </SettingsHero>

        <section className="dashboard-grid">
          <SettingsCard icon="health" title="Kontrol Privasi" description="Atur visibilitas data sensitif di layar dan laporan.">
            <div className="settings-list">
              <SettingRow title="Samarkan nominal keuangan" description="Sembunyikan saldo dan ringkasan di Beranda, Dompet, dan Target Tabungan saat layar dibagikan. Daftar transaksi tetap terlihat." aside={<SettingsToggle checked={maskAmounts} onChange={toggleAmountsVisible} label="Aktifkan/nonaktifkan penyamaran nominal" />} />
              <SettingRow title="Izinkan analitik produk" description="Kirim data pemakaian anonim untuk memperbaiki aplikasi tanpa menjual data kamu." aside={<SettingsToggle checked={shareAnalytics} onChange={() => setShareAnalytics(!shareAnalytics)} label="Aktifkan/nonaktifkan analitik produk" />} />
              <SettingRow title="Sertakan jejak audit" description="Sertakan riwayat aktivitas saat ekspor data pribadi." aside={<Badge tone="blue">Aktif</Badge>} />
              <SettingRow title="Retensi data" description="Riwayat aktivitas disimpan selama 12 bulan untuk kebutuhan audit kamu." aside={<Badge tone="gray">12 bulan</Badge>} />
            </div>
          </SettingsCard>

          <SettingsCard icon="warning" title="Aktivitas Terbaru" description="Perubahan terakhir pada data akunmu.">
            {activitiesLoading ? (
              <div className="loading-state">Memuat...</div>
            ) : recentActivities.length === 0 ? (
              <EmptyState icon={<AppIcon name="history" />} title="Belum ada aktivitas" description="Perubahan pada akun dan datamu akan muncul di sini." action={<Button to="/activities"><AppIcon name="history" /> Buka Riwayat Aktivitas</Button>} />
            ) : (
              <>
                <div className="settings-timeline">
                  {recentActivities.map((activity) => (
                    <div key={activity.id}>
                      <Badge tone="gray">{humanizeEntity(activity.entity_type)}</Badge>
                      <strong>{`${humanizeAction(activity.action_type)} ${humanizeEntity(activity.entity_type)}`}</strong>
                      <span>{relativeTime(activity.created_at)}</span>
                    </div>
                  ))}
                </div>
                <div className="modal-actions left-actions"><Button to="/activities"><AppIcon name="history" /> Buka Riwayat Aktivitas</Button></div>
              </>
            )}
          </SettingsCard>
        </section>

        <Modal open={auditOpen} title="Hasil Audit Privasi" description="Ringkasan audit privasi untuk sesi ini." onClose={() => setAuditOpen(false)}>
          <div className="settings-list compact">
            <div><span>Isolasi data pengguna</span><strong>Lolos</strong></div>
            <div><span>Penyamaran nominal</span><strong>{maskAmounts ? 'Aktif' : 'Tersedia, sedang nonaktif'}</strong></div>
            <div><span>Ekspor data pribadi</span><strong>Tersedia di menu Data</strong></div>
            <div><span>Alur penghapusan akun</span><strong>Butuh konfirmasi ketik</strong></div>
          </div>
          <div className="modal-actions"><Button onClick={() => setAuditOpen(false)}>Tutup</Button><Button to="/settings/data" variant="primary">Kelola Data</Button></div>
        </Modal>
      </div>
    </AppLayout>
  );
}
