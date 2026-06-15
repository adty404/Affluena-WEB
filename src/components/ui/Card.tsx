import type { HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

type CardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  as?: 'div' | 'article' | 'section';
};

export function Card({ children, as: Component = 'div', className, ...props }: CardProps) {
  return (
    <Component {...props} className={clsx('card', className)}>
      {children}
    </Component>
  );
}
