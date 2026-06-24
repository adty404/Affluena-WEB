import { useSearchParams } from 'react-router-dom';
import { currentMonth } from '../lib/reporting';

/**
 * Report period (month) state, backed by the `?month=YYYY-MM` URL search param.
 * Defaults to the current month when the param is missing or malformed, so the
 * period is never hardcoded and report links are shareable.
 */
export function useReportMonth(): [string, (month: string) => void] {
  const [params, setParams] = useSearchParams();
  const raw = params.get('month');
  const month = raw && /^\d{4}-\d{2}$/.test(raw) ? raw : currentMonth();

  const setMonth = (next: string) => {
    const updated = new URLSearchParams(params);
    updated.set('month', next);
    setParams(updated, { replace: true });
  };

  return [month, setMonth];
}
