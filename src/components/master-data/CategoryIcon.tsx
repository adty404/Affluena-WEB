import clsx from 'clsx'
import { resolveCategoryIconPaths } from '../../lib/categoryIcons'
import type { CategoryType } from '../../types/category'

type CategoryIconProps = {
  /** Chosen semantic icon id ('' / undefined = type fallback glyph). */
  icon?: string
  type: CategoryType
  className?: string
  size?: number
}

/**
 * Renders a category's chosen catalog icon (or its income/expense fallback) as
 * an inline stroked SVG, styled like {@link AppIcon}. Colouring is left to the
 * parent (via `currentColor`), so pair it with the category's accent.
 */
export function CategoryIcon({ icon, type, className, size }: CategoryIconProps) {
  const paths = resolveCategoryIconPaths(icon, type)
  return (
    <svg
      className={clsx('app-icon', className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      focusable="false"
      style={size ? { width: size, height: size } : undefined}
    >
      {paths.map((d) => (
        <path key={d} d={d} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      ))}
    </svg>
  )
}
