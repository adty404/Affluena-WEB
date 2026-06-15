import type { ReactNode } from 'react';
import clsx from 'clsx';

type BadgeProps = {
  children: ReactNode;
  tone?: 'green' | 'blue' | 'orange' | 'purple' | 'gray' | 'red';
  className?: string;
};

export function Badge({ children, tone = 'green', className }: BadgeProps) {
  return <span className={clsx('badge', tone !== 'green' && tone, className)}>{children}</span>;
}
