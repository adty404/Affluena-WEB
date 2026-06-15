import { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/Button';
import { AppIcon } from '../ui/AppIcon';

type TopbarProps = {
  title: string;
  description: string;
  onMenuClick: () => void;
};

export function Topbar({ title, description, onMenuClick }: TopbarProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

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
            <AppIcon name="profile" /> AP
          </Button>

          {profileOpen ? (
            <div className="profile-popover" role="menu" aria-label="Profile menu">
              <div className="profile-popover-head">
                <div className="avatar large">AP</div>
                <div>
                  <h4>Aditya Prasetyo</h4>
                  <p>Personal Finance Pro · adty404@gmail.com</p>
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
                <Button to="/" variant="danger" onClick={() => setProfileOpen(false)}>Logout</Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
