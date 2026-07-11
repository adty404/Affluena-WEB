import { useContext, type ReactNode } from 'react';
import clsx from 'clsx';
import { formatIDR, maskedIDR } from '../../lib/money';
import { AmountVisibilityContext } from '../../contexts/AmountVisibilityProvider';

type AmountTone = 'income' | 'expense' | 'neutral';

type AmountProps = {
  children?: ReactNode;
  value?: number;
  type?: AmountTone;
  variant?: AmountTone;
  note?: string;
  /**
   * Opt-in "Penyamaran nominal" support: when the persisted amount-visibility
   * setting is off, render `Rp ••••••` instead of the amount. Scope mirrors
   * mobile: balances/summaries (Beranda, Dompet, Target Tabungan) are
   * maskable; the transactions ledger/detail/reports stay visible.
   */
  maskable?: boolean;
};

export function Amount({ children, value, type = 'neutral', variant, note, maskable }: AmountProps) {
  // Read the context directly (not via useAmountVisibility) so a bare Amount
  // outside the provider — e.g. in isolated component tests — stays visible
  // instead of throwing.
  const visibility = useContext(AmountVisibilityContext);
  const masked = Boolean(maskable) && visibility !== null && !visibility.amountsVisible;
  const tone = variant ?? type;
  const content = masked ? maskedIDR() : typeof value === 'number' ? formatIDR(value) : children;

  return (
    <strong className={clsx('amount', tone)}>
      {content}
      {note && <span>{note}</span>}
    </strong>
  );
}
