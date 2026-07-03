import type { CSSProperties } from 'react'
import clsx from 'clsx'
import { CATEGORY_ICON_CATALOG, categoryTypeFallbackPaths } from '../../lib/categoryIcons'
import { normalizeItemColor } from './ColorPicker'
import type { CategoryType } from '../../types/category'

function Glyph({ paths }: { paths: string[] }) {
  return (
    <svg className="app-icon" viewBox="0 0 24 24" fill="none" aria-hidden focusable="false">
      {paths.map((d) => (
        <path key={d} d={d} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      ))}
    </svg>
  )
}

type IconPickerProps = {
  /** Current value: '' / undefined = default (type) glyph, else a catalog id. */
  value?: string
  /** Receives the picked id, or '' when "default" is chosen. */
  onChange: (id: string) => void
  /** The category type, used to draw the leading "default" glyph. */
  type: CategoryType
  /** The chosen accent color, used to tint the selected cell (preview). */
  accentColor?: string
  disabled?: boolean
}

/**
 * Grid picker over the shared {@link CATEGORY_ICON_CATALOG} (ids match mobile)
 * plus a leading "default" option that keeps the category's income/expense
 * glyph. Plain buttons with `aria-pressed`, so it is keyboard accessible.
 * Render inside a form `<label>` with an "Ikon" caption. The selected cell is
 * tinted with the chosen accent color (if any) so the form previews the final
 * appearance.
 */
export function IconPicker({ value, onChange, type, accentColor, disabled }: IconPickerProps) {
  const selected = value ?? ''
  const accent = normalizeItemColor(accentColor)
  const accentVars = accent ? ({ '--icon-accent': accent } as CSSProperties) : undefined

  return (
    <div className="icon-picker-grid" role="group" aria-label="Ikon" style={accentVars}>
      <button
        type="button"
        className={clsx('icon-picker-cell', accent && 'has-accent')}
        aria-pressed={selected === ''}
        aria-label="Ikon bawaan"
        title="Ikon bawaan"
        disabled={disabled}
        onClick={() => onChange('')}
      >
        <Glyph paths={categoryTypeFallbackPaths(type)} />
      </button>
      {CATEGORY_ICON_CATALOG.map((option) => (
        <button
          key={option.id}
          type="button"
          className={clsx('icon-picker-cell', accent && 'has-accent')}
          aria-pressed={selected === option.id}
          aria-label={`Ikon ${option.label}`}
          title={option.label}
          disabled={disabled}
          onClick={() => onChange(option.id)}
        >
          <Glyph paths={option.paths} />
        </button>
      ))}
    </div>
  )
}
