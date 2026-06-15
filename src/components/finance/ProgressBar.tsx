import clsx from 'clsx';

type ProgressBarProps = {
  value: number;
  tone?: 'green' | 'blue' | 'orange' | 'red' | 'purple';
};

export function ProgressBar({ value, tone = 'green' }: ProgressBarProps) {
  return (
    <div className={clsx('progress-bar', tone)} aria-label={`Progress ${value}%`}>
      <span style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}
