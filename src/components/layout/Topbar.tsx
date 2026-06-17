import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { AppIcon } from '../ui/AppIcon';
import { useAuth } from '../../hooks/useAuth';
import { useMe } from '../../hooks/useMe';
import { queryClient } from '../../lib/queryClient';

type TopbarProps = {
  title: string;
  description: string;
  onMenuClick: () => void;
};

export function Topbar({ title, description, onMenuClick }: TopbarProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();
  const { data } = useMe();
  const navigate = useNavigate();
  const user = data?.user;
  const initials = (user?.email ?? 'U').slice(0, 2).toUpperCase();

  function handleLogout() {
    logout();
    queryClient.clear();
    setProfileOpen(false);
    navigate('/login', { replace: true });
  }

  useEffect(() => {
    if (!profileOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setProfileOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [profileOpen]);

  return (
    <header className="app-topbar">
      <Button size="icon" className="mobile-sidebar-button" onClick={onMenuClick} aria-label="Open sidebar"><AppIcon name="more" /></Button>
      <div className="topbar-title">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="topbar-actions">
        <Button to="/transactions/new"><AppIcon name="add" /> Quick Add</Button>
        <div className="profile-menu-wrap" ref={profileRef}>
          <Button variant="primary" onClick={() => setProfileOpen((value) => !value)} aria-expanded={profileOpen} aria-haspopup="menu" aria-label="Open profile menu">
            <AppIcon name="profile" /> {initials}
          </Button>

          {profileOpen ? (
            <div className="profile-popover" role="menu" aria-label="Profile menu">
              <div className="profile-popover-head">
                <div className="avatar large">{initials}</div>
                <div>
                  <h4>{user?.email ?? 'Pengguna'}</h4>
                  <p>{user?.email ?? '—'}</p>
                </div>
              </div>
              <div className="profile-popover-actions">
                <Button to="/settings/profile" onClick={() => setProfileOpen(false)}><AppIcon name="settings" /> Profile Settings</Button>
                <Button to="/dashboard/widget-states" onClick={() => setProfileOpen(false)}><AppIcon name="widgets" /> UI States</Button>
                <Button to="/alerts" onClick={() => setProfileOpen(false)}><AppIcon name="budgetAlert" /> Alert Center</Button>
                <Button to="/app-menu" onClick={() => setProfileOpen(false)}><AppIcon name="more" /> All Access</Button>
              </div>
              <div className="profile-popover-foot">
                <Button onClick={() => setProfileOpen(false)}>Close</Button>
                <Button variant="danger" onClick={handleLogout}>Logout</Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
