import type { ReactNode } from 'react';
import clsx from 'clsx';

type AmountTone = 'income' | 'expense' | 'neutral';

type AmountProps = {
  children?: ReactNode;
  value?: number;
  type?: AmountTone;
  variant?: AmountTone;
  note?: string;
};

const formatCurrency = (value: number) => new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
}).format(value);

export function Amount({ children, value, type = 'neutral', variant, note }: AmountProps) {
  const tone = variant ?? type;
  const content = typeof value === 'number' ? formatCurrency(value) : children;

  return (
    <strong className={clsx('amount', tone)}>
      {content}
      {note && <span>{note}</span>}
    </strong>
  );
}
