import type { ReportResponse, ReportRow, ReportMetric } from '../types/reporting';

/** Current month as YYYY-MM, used as the default report period. */
export function currentMonth(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  return `${yyyy}-${mm}`;
}

/** Human label for a YYYY-MM month, e.g. "Juni 2026". Falls back to the raw value. */
export function formatMonthLabel(month: string): string {
  const match = /^(\d{4})-(\d{2})$/.exec(month);
  if (!match) return month;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, 1);
  return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
}

/** Build a list of recent months (YYYY-MM) ending at the current month. */
export function recentMonths(count = 12): string[] {
  const months: string[] = [];
  const base = new Date();
  base.setDate(1);
  for (let i = 0; i < count; i += 1) {
    const d = new Date(base.getFullYear(), base.getMonth() - i, 1);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    months.push(`${yyyy}-${mm}`);
  }
  return months;
}

function csvEscape(value: string | number): string {
  const str = String(value ?? '');
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function rowsToCsv(headers: string[], rows: (string | number)[][]): string {
  const lines = [headers.map(csvEscape).join(',')];
  for (const row of rows) {
    lines.push(row.map(csvEscape).join(','));
  }
  return lines.join('\r\n');
}

/** Trigger a browser download of CSV text. */
export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

/**
 * Serialize a report's metrics + rows into a single CSV file and download it.
 * This exports the actual report data the user is looking at, instead of
 * routing to the generic transactions export form.
 */
export function exportReportCsv(
  reportName: string,
  month: string,
  data: Pick<ReportResponse, 'metrics' | 'rows'>,
): void {
  const metrics: ReportMetric[] = data.metrics ?? [];
  const rows: ReportRow[] = data.rows ?? [];

  const sections: string[] = [];

  sections.push(`${reportName} — ${formatMonthLabel(month)}`);

  if (metrics.length > 0) {
    sections.push('');
    sections.push('Ringkasan');
    sections.push(
      rowsToCsv(
        ['Metrik', 'Jumlah', 'Keterangan'],
        metrics.map((m) => [m.label, m.value_minor, m.helper]),
      ),
    );
  }

  if (rows.length > 0) {
    sections.push('');
    sections.push('Detail');
    sections.push(
      rowsToCsv(
        ['Nama', 'Kategori', 'Dompet', 'Jumlah', 'Sebelumnya', 'Perubahan %', 'Status'],
        rows.map((r) => [
          r.name,
          r.category,
          r.wallet,
          r.amount_minor,
          r.previous_amount_minor,
          r.change_percent,
          r.status,
        ]),
      ),
    );
  }

  if (metrics.length === 0 && rows.length === 0) {
    sections.push('');
    sections.push('Tidak ada data untuk periode ini.');
  }

  const slug = reportName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  downloadCsv(`${slug}-${month}.csv`, sections.join('\r\n'));
}
