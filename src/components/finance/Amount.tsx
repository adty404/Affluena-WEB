import type { ReactNode } from 'react';
import clsx from 'clsx';
import { formatIDR } from '../../lib/money';

type AmountTone = 'income' | 'expense' | 'neutral';

type AmountProps = {
  children?: ReactNode;
  value?: number;
  type?: AmountTone;
  variant?: AmountTone;
  note?: string;
};

export function Amount({ children, value, type = 'neutral', variant, note }: AmountProps) {
  const tone = variant ?? type;
  const content = typeof value === 'number' ? formatIDR(value) : children;

  return (
    <strong className={clsx('amount', tone)}>
      {content}
      {note && <span>{note}</span>}
    </strong>
  );
}
