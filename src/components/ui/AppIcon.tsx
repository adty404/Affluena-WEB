import clsx from 'clsx';

export type AppIconName =
  | 'dashboard' | 'analytics' | 'forecast' | 'widgets'
  | 'wallet' | 'bank' | 'cash' | 'eWallet' | 'investment' | 'goal' | 'categories' | 'tags'
  | 'transactions' | 'split' | 'quick'
  | 'budget' | 'budgetForm' | 'budgetAlert' | 'budgetReport'
  | 'debt' | 'receivable' | 'payable' | 'tracker' | 'installment' | 'subscription' | 'pay' | 'history' | 'run' | 'active' | 'paused' | 'cancelled' | 'recurring' | 'home' | 'add' | 'more'
  | 'trend' | 'chart' | 'calendar' | 'list' | 'filter' | 'search'
  | 'save' | 'back' | 'edit' | 'delete' | 'export'
  | 'warning' | 'success' | 'food' | 'transport' | 'shopping' | 'bills'
  | 'health' | 'empty' | 'close' | 'profile' | 'settings' | 'copy' | 'download'
  | 'arrow-up' | 'arrow-down' | 'arrow-up-down'
  | 'eye' | 'eyeOff';

type AppIconProps = {
  name: AppIconName;
  className?: string;
  decorative?: boolean;
  size?: number;
};

const paths: Record<AppIconName, string[]> = {
  dashboard: ['M4 13h7V4H4v9Z', 'M13 20h7V4h-7v16Z', 'M4 20h7v-5H4v5Z'],
  analytics: ['M4 19V5', 'M4 19h16', 'M7 15l3-3 3 2 5-7'],
  forecast: ['M4 15c3-7 6-7 9-2s5 5 7-1', 'M5 20c4-6 8-6 15-2'],
  widgets: ['M4 4h7v7H4z', 'M13 4h7v7h-7z', 'M4 13h7v7H4z', 'M13 13h7v7h-7z'],
  wallet: ['M4 7h16v12H4z', 'M16 12h4v4h-4z', 'M6 7V5h10v2'],
  bank: ['M3 9l9-5 9 5', 'M5 10h14', 'M6 10v8', 'M10 10v8', 'M14 10v8', 'M18 10v8', 'M4 18h16', 'M3 21h18'],
  cash: ['M4 7h16v10H4z', 'M8 11h.01', 'M16 13h.01', 'M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z'],
  eWallet: ['M8 3h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z', 'M10 17h4', 'M9 7h6'],
  investment: ['M4 18h16', 'M6 15l4-5 4 3 4-7', 'M16 6h4v4'],
  goal: ['M12 21s7-4 7-10a7 7 0 1 0-14 0c0 6 7 10 7 10Z', 'M12 8v4l3 2'],
  categories: ['M4 5h7v6H4z', 'M13 5h7v6h-7z', 'M4 13h16v6H4z'],
  tags: ['M4 12V5h7l9 9-7 7-9-9Z', 'M8 8h.01'],
  transactions: ['M7 7h13M17 4l3 3-3 3', 'M17 17H4m3-3-3 3 3 3'],
  split: ['M12 4v5', 'M6 20v-4a6 6 0 0 1 12 0v4', 'M6 20h12', 'M9 9h6'],
  quick: ['M13 2 4 14h7l-1 8 9-12h-7l1-8Z'],
  budget: ['M4 6h16v14H4z', 'M8 6V4h8v2', 'M8 12h8', 'M8 16h5'],
  budgetForm: ['M5 4h10l4 4v12H5z', 'M14 4v5h5', 'M8 14h8', 'M8 17h5'],
  budgetAlert: ['M12 3 3 20h18L12 3Z', 'M12 9v5', 'M12 17h.01'],
  budgetReport: ['M4 20V4h16v16H4Z', 'M8 16v-4', 'M12 16V8', 'M16 16v-7'],
  debt: ['M5 7h14v10H5z', 'M8 7V5h8v2', 'M8 12h8'],
  payable: ['M7 7h12', 'M16 4l3 3-3 3', 'M17 17H5', 'M8 14l-3 3 3 3'],
  receivable: ['M17 7H5', 'M8 4 5 7l3 3', 'M7 17h12', 'M16 14l3 3-3 3'],
  tracker: ['M5 5h14v14H5z', 'M8 9h8', 'M8 13h5', 'M8 17h7'],
  installment: ['M4 7h16v10H4z', 'M7 7V5h10v2', 'M8 13h8', 'M8 17h5'],
  subscription: ['M7 7a5 5 0 0 1 9-2l2 2', 'M17 17a5 5 0 0 1-9 2l-2-2', 'M12 8v4l3 2'],
  pay: ['M4 12h16', 'M14 6l6 6-6 6', 'M5 6h5a4 4 0 0 1 0 8H5'],
  history: ['M12 8v5l3 2', 'M21 12a9 9 0 1 1-3-6.7', 'M21 4v6h-6'],
  run: ['M8 5v14l11-7-11-7Z'],
  active: ['M20 6 9 17l-5-5'],
  paused: ['M8 5v14', 'M16 5v14'],
  cancelled: ['M6 6l12 12', 'M18 6 6 18'],
  recurring: ['M17 3l4 4-4 4', 'M3 11V9a6 6 0 0 1 6-6h12', 'M7 21l-4-4 4-4', 'M21 13v2a6 6 0 0 1-6 6H3'],
  home: ['M3 11l9-8 9 8', 'M5 10v10h14V10', 'M9 20v-6h6v6'],
  add: ['M12 5v14', 'M5 12h14'],
  more: ['M5 12h.01', 'M12 12h.01', 'M19 12h.01'],
  trend: ['M4 18h16', 'M6 15l4-4 3 3 5-7'],
  chart: ['M4 20V4', 'M4 20h16', 'M8 16v-5', 'M12 16V8', 'M16 16v-9'],
  calendar: ['M5 5h14v15H5z', 'M8 3v4', 'M16 3v4', 'M5 10h14'],
  list: ['M8 6h12', 'M8 12h12', 'M8 18h12', 'M4 6h.01', 'M4 12h.01', 'M4 18h.01'],
  filter: ['M4 5h16l-6 7v6l-4 2v-8L4 5Z'],
  search: ['M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Z', 'M20 20l-4.35-4.35'],
  save: ['M5 4h12l2 2v14H5z', 'M8 4v6h8', 'M8 17h8'],
  back: ['M15 6l-6 6 6 6'],
  edit: ['M4 20h4l11-11-4-4L4 16v4Z', 'M14 6l4 4'],
  delete: ['M4 7h16', 'M9 7V4h6v3', 'M7 7l1 13h8l1-13'],
  export: ['M12 4v10', 'M8 8l4-4 4 4', 'M5 14v5h14v-5'],
  warning: ['M12 3 3 20h18L12 3Z', 'M12 9v5', 'M12 17h.01'],
  success: ['M20 6 9 17l-5-5'],
  food: ['M7 3v8', 'M10 3v8', 'M7 7h3', 'M8.5 11v10', 'M16 3v18', 'M14 3h4v8h-4z'],
  transport: ['M5 16l2-9h10l2 9', 'M7 16h10', 'M8 19h.01', 'M16 19h.01'],
  shopping: ['M6 8h12l-1 12H7L6 8Z', 'M9 8a3 3 0 0 1 6 0'],
  bills: ['M6 3h12v18l-3-2-3 2-3-2-3 2V3Z', 'M9 8h6', 'M9 12h6', 'M9 16h4'],
  health: ['M20 7c0 6-8 12-8 12S4 13 4 7a4 4 0 0 1 8-2 4 4 0 0 1 8 2Z'],
  empty: ['M4 6h16v12H4z', 'M8 10h8', 'M8 14h5'],
  close: ['M6 6l12 12', 'M18 6 6 18'],
  profile: ['M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z', 'M4 21a8 8 0 0 1 16 0'],
  settings: ['M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z', 'M19.4 15a1.7 1.7 0 0 0 .34 1.88l.05.08-1.9 3.3-.1-.03a1.7 1.7 0 0 0-1.84.42l-.07.07a1.7 1.7 0 0 0-.42 1.84l.03.1h-3.8l.03-.1a1.7 1.7 0 0 0-.42-1.84l-.07-.07a1.7 1.7 0 0 0-1.84-.42l-.1.03-1.9-3.3.05-.08A1.7 1.7 0 0 0 4.6 15H4v-6h.6a1.7 1.7 0 0 0 .34-1.88l-.05-.08 1.9-3.3.1.03a1.7 1.7 0 0 0 1.84-.42l.07-.07a1.7 1.7 0 0 0 .42-1.84L9.19 1h3.8l-.03.1a1.7 1.7 0 0 0 .42 1.84l.07.07a1.7 1.7 0 0 0 1.84.42l.1-.03 1.9 3.3-.05.08A1.7 1.7 0 0 0 19.4 9h.6v6h-.6Z'],
  copy: ['M8 8h10v12H8z', 'M6 16H4V4h12v2'],
  download: ['M12 4v10', 'M8 10l4 4 4-4', 'M5 20h14'],
  'arrow-up': ['M12 19V5', 'M5 12l7-7 7 7'],
  'arrow-down': ['M12 5v14', 'M19 12l-7 7-7-7'],
  'arrow-up-down': ['M7 15l5 5 5-5', 'M7 9l5-5 5 5'],
  eye: ['M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z', 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z'],
  eyeOff: ['M4 4l16 16', 'M10.6 5.2A8.8 8.8 0 0 1 12 5c6 0 9.5 7 9.5 7a16.6 16.6 0 0 1-2.8 3.8', 'M6.3 6.3A15.7 15.7 0 0 0 2.5 12s3.5 7 9.5 7a9 9 0 0 0 4.2-1.1', 'M9.9 9.9a3 3 0 0 0 4.2 4.2'],
};

export function AppIcon({ name, className, decorative = true, size }: AppIconProps) {
  return (
    <svg
      className={clsx('app-icon', className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden={decorative}
      focusable="false"
      role={decorative ? undefined : 'img'}
      style={size ? { width: size, height: size } : undefined}
    >
      {paths[name].map((d) => (
        <path key={d} d={d} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      ))}
    </svg>
  );
}
