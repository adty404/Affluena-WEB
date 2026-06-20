import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AuthContext } from '../../contexts/AuthProvider';
import { PublicOnlyRoute } from './PublicOnlyRoute';

let root: Root | null = null;
let host: HTMLDivElement | null = null;

afterEach(() => {
  if (root) {
    act(() => {
      root?.unmount();
    });
  }
  root = null;
  host?.remove();
  host = null;
});

function renderPublicRoute(isAuthenticated: boolean, isLoading = false) {
  host = document.createElement('div');
  document.body.appendChild(host);
  root = createRoot(host);

  act(() => {
    root?.render(
      <AuthContext.Provider
        value={{
          user: isAuthenticated
            ? {
                id: 'user-1',
                email: 'user@example.com',
                name: 'User',
                avatar_url: '',
                created_at: '2026-06-21T00:00:00.000Z',
                updated_at: '2026-06-21T00:00:00.000Z',
              }
            : null,
          isLoading,
          isAuthenticated,
          login: vi.fn(),
          register: vi.fn(),
          logout: vi.fn(),
        }}
      >
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <div>Login page</div>
                </PublicOnlyRoute>
              }
            />
            <Route path="/dashboard" element={<div>Dashboard page</div>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );
  });

  return host;
}

describe('PublicOnlyRoute', () => {
  it('renders public auth content when the user is not authenticated', () => {
    const container = renderPublicRoute(false);

    expect(container.textContent).toContain('Login page');
  });

  it('redirects authenticated users to the dashboard', () => {
    const container = renderPublicRoute(true);

    expect(container.textContent).toContain('Dashboard page');
  });

  it('keeps auth content hidden while the session is still loading', () => {
    const container = renderPublicRoute(false, true);

    expect(container.textContent).toContain('Memuat');
    expect(container.textContent).not.toContain('Login page');
  });
});
