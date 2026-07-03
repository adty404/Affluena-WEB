import { describe, it, expect } from 'vitest'
import { CATEGORY_ICON_CATALOG, categoryIconOption, resolveCategoryIconPaths, categoryTypeFallbackPaths } from './categoryIcons'

describe('category icon catalog', () => {
  it('has unique, non-empty ids and paths', () => {
    const ids = CATEGORY_ICON_CATALOG.map((o) => o.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const option of CATEGORY_ICON_CATALOG) {
      expect(option.id).not.toBe('')
      expect(option.paths.length).toBeGreaterThan(0)
    }
  })

  it('keeps the original mobile ids present (persisted ids must resolve)', () => {
    // A sample of ids from the mobile catalog's original + extended sets.
    for (const id of ['food', 'transport', 'salary', 'savings', 'coffee', 'misc']) {
      expect(categoryIconOption(id)).toBeDefined()
    }
  })

  it('resolves a chosen icon, else the type fallback glyph', () => {
    expect(resolveCategoryIconPaths('food', 'expense')).toEqual(categoryIconOption('food')!.paths)
    expect(resolveCategoryIconPaths('', 'income')).toEqual(categoryTypeFallbackPaths('income'))
    expect(resolveCategoryIconPaths(undefined, 'expense')).toEqual(categoryTypeFallbackPaths('expense'))
    // Unknown id (e.g. saved by a newer client) falls back too.
    expect(resolveCategoryIconPaths('not-a-real-id', 'expense')).toEqual(categoryTypeFallbackPaths('expense'))
  })
})
