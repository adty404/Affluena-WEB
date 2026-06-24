import { Input } from '../ui/Input';

type MonthPickerProps = {
  /** Current month in YYYY-MM format. */
  value: string;
  onChange: (month: string) => void;
  label?: string;
};

/**
 * Period (month) picker driving the report queries. Uses the native month input
 * inside the shared filter-card style so it matches the report filter bar.
 */
export function MonthPicker({ value, onChange, label = 'Period' }: MonthPickerProps) {
  return (
    <label className="filter-card filter-card-input">
      <span>{label}</span>
      <Input
        type="month"
        value={value}
        max="2099-12"
        onChange={(event) => {
          const next = event.target.value;
          if (next) onChange(next);
        }}
        aria-label="Report period month"
      />
    </label>
  );
}
