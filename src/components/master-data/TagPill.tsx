import clsx from 'clsx';
import type { Tag } from '../../types/tag';

type TagPillProps = { tag: Pick<Tag, 'name' | 'color'>; active?: boolean };

export function TagPill({ tag, active }: TagPillProps) {
  return <span className={clsx('tag-pill', tag.color, active && 'active')}>#{tag.name}</span>;
}
