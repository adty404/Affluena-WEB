import { Link } from 'react-router-dom';

type LogoProps = {
  to?: string;
};

export function Logo({ to = '/' }: LogoProps) {
  return (
    <Link className="logo" to={to} aria-label="Beranda Affluena">
      <span className="logo-mark">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M8.4 14.8c-1.68-.8-2.8-2.4-2.8-4.24C5.6 7.54 8.08 5 11.2 5h1.08" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
          <path d="M15.6 9.2c1.68.8 2.8 2.4 2.8 4.24C18.4 16.46 15.92 19 12.8 19h-1.08" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
          <path d="M9.2 19c1.6-4.7 3.5-9.1 5.6-14" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
        </svg>
      </span>
      <span className="logo-text">Affluena</span>
    </Link>
  );
}
