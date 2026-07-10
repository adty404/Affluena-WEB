import { Card } from '../ui/Card';
import { Amount } from '../finance/Amount';

type BalanceDeltaPreviewProps = {
  title: string;
  before: number;
  delta: number;
  after: number;
  description: string;
};

export function BalanceDeltaPreview({ title, before, delta, after, description }: BalanceDeltaPreviewProps) {
  return (
    <Card className="panel-card balance-delta-card">
      <div className="panel-head">
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>
      <div className="delta-grid balance-preview-grid">
        <div className="delta-cell"><span>Sebelum</span><Amount value={before} /></div>
        <div className={`delta-cell delta-cell-current ${delta < 0 ? 'is-down' : 'is-up'}`}><span>Perubahan</span><Amount value={Math.abs(delta)} variant={delta < 0 ? 'expense' : 'income'} /></div>
        <div className="delta-cell"><span>Sesudah</span><Amount value={after} /></div>
      </div>
    </Card>
  );
}
