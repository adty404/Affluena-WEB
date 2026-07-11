import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { App } from './App';
import { ToastProvider } from './components/ui/Toast';
import { queryClient } from './lib/queryClient';
import { AuthProvider } from './contexts/AuthProvider';
import { AmountVisibilityProvider } from './contexts/AmountVisibilityProvider';
import './styles/tokens.css';
import './styles/globals.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/pages.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AmountVisibilityProvider>
          <BrowserRouter>
            <ToastProvider>
              <App />
            </ToastProvider>
          </BrowserRouter>
        </AmountVisibilityProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
