/** Humanize raw audit / log values (action types, entity types, UUIDs, timestamps). */

const ACTION_LABELS: Record<string, string> = {
  CREATE: 'Dibuat',
  CREATED: 'Dibuat',
  UPDATE: 'Diperbarui',
  UPDATED: 'Diperbarui',
  DELETE: 'Dihapus',
  DELETED: 'Dihapus',
  PAY: 'Pembayaran',
  PAID: 'Pembayaran',
  RUN: 'Dijalankan',
  EXECUTE: 'Dieksekusi',
  EXPORT: 'Ekspor',
  LOGIN: 'Masuk',
  LOGOUT: 'Keluar',
  CONTRIBUTE: 'Setoran',
  CANCEL: 'Dibatalkan',
  CANCELLED: 'Dibatalkan',
};

const ENTITY_LABELS: Record<string, string> = {
  TRANSACTION: 'Transaksi',
  WALLET: 'Dompet',
  CATEGORY: 'Kategori',
  TAG: 'Tag',
  BUDGET: 'Anggaran',
  DEBT: 'Utang',
  INSTALLMENT: 'Cicilan',
  SUBSCRIPTION: 'Langganan',
  RECURRING: 'Berulang',
  GOAL: 'Target Tabungan',
  EXPORT: 'Ekspor',
  QUICK_ENTRY: 'Catat Cepat',
  USER: 'Akun',
};

/** Title-case a raw enum-ish token like "QUICK_ENTRY" -> "Quick Entry". */
function titleCase(raw: string): string {
  return raw
    .toLowerCase()
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function humanizeAction(action: string): string {
  if (!action) return 'Aktivitas';
  return ACTION_LABELS[action.toUpperCase()] ?? titleCase(action);
}

export function humanizeEntity(entity: string): string {
  if (!entity) return 'Sistem';
  return ENTITY_LABELS[entity.toUpperCase()] ?? titleCase(entity);
}

/** Short, readable reference for an id (UUID-friendly): "#a1b2c3". */
export function shortRef(id: string | null | undefined): string {
  if (!id) return '—';
  const compact = id.replace(/-/g, '');
  return `#${compact.slice(0, 6)}`;
}

/** Distinguish a real user actor from a system/automation actor. */
export function actorLabel(userId: string | null | undefined): string {
  if (!userId) return 'Sistem';
  return `Kamu · ${shortRef(userId)}`;
}

/** Absolute, localized timestamp, e.g. "24 Jun 2026, 14:32". */
export function formatTimestamp(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Relative time, e.g. "5 mnt lalu", "2 jam lalu", "3 hari lalu". Falls back to absolute. */
export function relativeTime(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const diffMs = Date.now() - d.getTime();
  const sec = Math.round(diffMs / 1000);
  if (sec < 0) return 'baru saja';
  if (sec < 60) return 'baru saja';
  const min = Math.round(sec / 60);
  if (min < 60) return `${min} mnt lalu`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr} jam lalu`;
  const day = Math.round(hr / 24);
  if (day < 30) return `${day} hari lalu`;
  return formatTimestamp(iso);
}

/** Compact, readable user-agent (browser + OS) from a raw UA string. */
export function humanizeUserAgent(ua: string | null | undefined): string {
  if (!ua) return 'Perangkat tidak dikenal';
  let browser = 'Browser tidak dikenal';
  if (/edg/i.test(ua)) browser = 'Edge';
  else if (/chrome|crios/i.test(ua)) browser = 'Chrome';
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
  else if (/safari/i.test(ua)) browser = 'Safari';
  else if (/curl|wget|go-http|python|node/i.test(ua)) browser = 'Klien API';

  let os = '';
  if (/windows/i.test(ua)) os = 'Windows';
  else if (/mac os|macintosh/i.test(ua)) os = 'macOS';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/iphone|ipad|ios/i.test(ua)) os = 'iOS';
  else if (/linux/i.test(ua)) os = 'Linux';

  return os ? `${browser} · ${os}` : browser;
}
