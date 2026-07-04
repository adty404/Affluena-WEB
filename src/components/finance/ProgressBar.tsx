import clsx from 'clsx';

type ProgressBarProps = {
  value: number;
  tone?: 'green' | 'blue' | 'orange' | 'red' | 'purple';
};

export function ProgressBar({ value, tone = 'green' }: ProgressBarProps) {
  // Guard against NaN/Infinity (e.g. divide-by-zero upstream) so the width and
  // aria-label never become "NaN%"/"Infinity%".
  const safe = Number.isFinite(value) ? value : 0;
  const clamped = Math.min(100, Math.max(0, safe));
  return (
    <div className={clsx('progress-bar', tone)} aria-label={`Progres ${clamped}%`}>
      <span style={{ width: `${clamped}%` }} />
    </div>
  );
}
