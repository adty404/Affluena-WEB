export type ModuleGroup = {
  title: string;
  description: string;
  items: string[];
};

export type AppWidget = {
  title: string;
  value: string;
  note: string;
  tone?: 'green' | 'blue' | 'orange' | 'purple' | 'danger';
};
