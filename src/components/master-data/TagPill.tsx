import clsx from 'clsx';
import type { Tag } from '../../types/tag';

// Deterministic color from name hash
type TagColor = 'green' | 'blue' | 'orange' | 'purple' | 'red' | 'gray';
const COLORS: TagColor[] = ['green', 'blue', 'orange', 'purple', 'red', 'gray'];
function colorFromName(name: string): TagColor {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

type TagPillProps = { tag: Pick<Tag, 'name'>; active?: boolean };

export function TagPill({ tag, active }: TagPillProps) {
  const color = colorFromName(tag.name);
  return <span className={clsx('tag-pill', color, active && 'active')}>#{tag.name}</span>;
}
