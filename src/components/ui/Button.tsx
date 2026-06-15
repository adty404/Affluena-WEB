import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

type CommonProps = {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'ghost' | 'danger';
  size?: 'md' | 'small' | 'icon';
  full?: boolean;
  className?: string;
};

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { to?: never };
type LinkButtonProps = CommonProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { to: string };

export function Button(props: ButtonProps | LinkButtonProps) {
  const { children, variant = 'default', size = 'md', full, className } = props;
  const classes = clsx('btn', variant !== 'default' && variant, size !== 'md' && size, full && 'full', className);

  if ('to' in props && props.to) {
    const {
      to,
      children: _children,
      variant: _variant,
      size: _size,
      full: _full,
      className: _className,
      ...anchorProps
    } = props;

    return (
      <Link {...anchorProps} to={to} className={classes}>
        {children}
      </Link>
    );
  }

  const {
    children: _children,
    variant: _variant,
    size: _size,
    full: _full,
    className: _className,
    type = 'button',
    ...buttonProps
  } = props as ButtonProps;

  return (
    <button {...buttonProps} type={type} className={classes}>
      {children}
    </button>
  );
}
