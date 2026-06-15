import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

type ToastContextValue = {
  showToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);

  const value = useMemo<ToastContextValue>(() => ({
    showToast: (nextMessage: string) => {
      setMessage(nextMessage);
      setVisible(true);
      window.clearTimeout(window.__affluenaToastTimer);
      window.__affluenaToastTimer = window.setTimeout(() => setVisible(false), 2200);
    },
  }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className={`toast ${visible ? 'show' : ''}`} role="status" aria-live="polite">
        {message}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}

declare global {
  interface Window {
    __affluenaToastTimer?: number;
  }
}
