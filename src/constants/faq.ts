import type { FAQItem } from '../types/settings';

export const faqItems: FAQItem[] = [
  { id: 'faq-balance', question: 'Why does wallet balance change automatically?', answer: 'Income increases the selected wallet, expense decreases it, transfer moves balance between wallets, and adjustment changes the balance manually with an audit trail.' },
  { id: 'faq-budget', question: 'How are budget alerts calculated?', answer: 'Budget usage is calculated from expense transactions by category and period. Alerts are generated at configured warning and exceeded thresholds.' },
  { id: 'faq-recurring', question: 'What happens when a recurring rule runs?', answer: 'A recurring rule creates a transaction using the configured wallet, category, amount, date rule, and tags. Each run is recorded in run history.' },
  { id: 'faq-export', question: 'Can I export personal finance data?', answer: 'Yes. Export Center can generate CSV files for transactions, wallets, budgets, debts, goals, activities, alerts, and system logs.' },
];
