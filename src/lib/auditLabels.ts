/** Humanize raw audit / log values (action types, entity types, UUIDs, timestamps). */

const ACTION_LABELS: Record<string, string> = {
  CREATE: 'Created',
  CREATED: 'Created',
  UPDATE: 'Updated',
  UPDATED: 'Updated',
  DELETE: 'Deleted',
  DELETED: 'Deleted',
  PAY: 'Payment',
  PAID: 'Payment',
  RUN: 'Run',
  EXECUTE: 'Executed',
  EXPORT: 'Export',
  LOGIN: 'Signed in',
  LOGOUT: 'Signed out',
  CONTRIBUTE: 'Contribution',
  CANCEL: 'Cancelled',
  CANCELLED: 'Cancelled',
};

const ENTITY_LABELS: Record<string, string> = {
  TRANSACTION: 'Transaction',
  WALLET: 'Wallet',
  CATEGORY: 'Category',
  TAG: 'Tag',
  BUDGET: 'Budget',
  DEBT: 'Debt',
  INSTALLMENT: 'Installment',
  SUBSCRIPTION: 'Subscription',
  RECURRING: 'Recurring',
  GOAL: 'Goal',
  EXPORT: 'Export',
  QUICK_ENTRY: 'Quick Entry',
  USER: 'Account',
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
  if (!action) return 'Activity';
  return ACTION_LABELS[action.toUpperCase()] ?? titleCase(action);
}

export function humanizeEntity(entity: string): string {
  if (!entity) return 'System';
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
  if (!userId) return 'System';
  return `You · ${shortRef(userId)}`;
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

/** Relative time, e.g. "5m ago", "2h ago", "3d ago". Falls back to absolute. */
export function relativeTime(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const diffMs = Date.now() - d.getTime();
  const sec = Math.round(diffMs / 1000);
  if (sec < 0) return 'just now';
  if (sec < 60) return 'just now';
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  if (day < 30) return `${day}d ago`;
  return formatTimestamp(iso);
}

/** Compact, readable user-agent (browser + OS) from a raw UA string. */
export function humanizeUserAgent(ua: string | null | undefined): string {
  if (!ua) return 'Unknown client';
  let browser = 'Unknown browser';
  if (/edg/i.test(ua)) browser = 'Edge';
  else if (/chrome|crios/i.test(ua)) browser = 'Chrome';
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
  else if (/safari/i.test(ua)) browser = 'Safari';
  else if (/curl|wget|go-http|python|node/i.test(ua)) browser = 'API client';

  let os = '';
  if (/windows/i.test(ua)) os = 'Windows';
  else if (/mac os|macintosh/i.test(ua)) os = 'macOS';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/iphone|ipad|ios/i.test(ua)) os = 'iOS';
  else if (/linux/i.test(ua)) os = 'Linux';

  return os ? `${browser} · ${os}` : browser;
}
