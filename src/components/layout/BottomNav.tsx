import { Link, useLocation } from 'react-router-dom';
import { AppIcon } from '../ui/AppIcon';

const activeClass = (active: boolean) => (active ? 'active' : '');
const startsWithSegment = (pathname: string, segment: string) => pathname === segment || pathname.startsWith(`${segment}/`);

export function BottomNav() {
  const { pathname } = useLocation();
  const txActive = (startsWithSegment(pathname, '/transactions') && pathname !== '/transactions/new') || startsWithSegment(pathname, '/quick-entry');
  const moreActive = pathname === '/app-menu' || startsWithSegment(pathname, '/settings') || startsWithSegment(pathname, '/categories') || startsWithSegment(pathname, '/tags') || startsWithSegment(pathname, '/debts') || startsWithSegment(pathname, '/installments') || startsWithSegment(pathname, '/subscriptions') || startsWithSegment(pathname, '/recurring') || startsWithSegment(pathname, '/goals') || startsWithSegment(pathname, '/reports') || startsWithSegment(pathname, '/exports') || startsWithSegment(pathname, '/activities') || startsWithSegment(pathname, '/alerts') || startsWithSegment(pathname, '/system-logs') || pathname === '/tracker';

  return (
    <nav className="bottom-nav" aria-label="Mobile navigation">
      <Link to="/dashboard" className={activeClass(pathname === '/dashboard')}><AppIcon name="home" /><span>Home</span></Link>
      <Link to="/wallets" className={activeClass(startsWithSegment(pathname, '/wallets'))}><AppIcon name="wallet" /><span>Wallet</span></Link>
      <Link to="/transactions/new" className={activeClass(pathname === '/transactions/new')}><AppIcon name="add" /><span>Add</span></Link>
      <Link to="/transactions" className={activeClass(txActive)}><AppIcon name="transactions" /><span>Tx</span></Link>
      <Link to="/app-menu" className={activeClass(moreActive)}><AppIcon name="more" /><span>More</span></Link>
    </nav>
  );
}
