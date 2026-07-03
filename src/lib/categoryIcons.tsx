import type { CategoryType } from '../types/category'

/**
 * Client-owned category icon catalog. The `id`s are persisted verbatim on the
 * API (`icon` is a free-form string there), so they MUST stay identical to the
 * mobile catalog (`lib/features/shared/presentation/appearance/item_appearance.dart`,
 * `kCategoryIconCatalog`) — a category's icon chosen on one client must resolve
 * on the other. Never rename or reorder an id; only append new ones.
 *
 * Web renders inline SVG (mobile renders the paired Material glyph); the two
 * glyphs only need to be recognisably the same concept, not pixel-identical.
 * Each entry stores its SVG path list, drawn as a stroked 24x24 icon like
 * {@link AppIcon}.
 */
export interface CategoryIconOption {
  /** Semantic id persisted on the API. Must match the mobile catalog id. */
  id: string
  /** Short Indonesian label for the picker. */
  label: string
  /** SVG paths (stroked, 24x24 viewBox). */
  paths: string[]
}

export const CATEGORY_ICON_CATALOG: CategoryIconOption[] = [
  // Original set (ids must never be reordered/renamed).
  { id: 'food', label: 'Makanan', paths: ['M5 3v7a2 2 0 0 0 2 2h0V3', 'M7 12v9', 'M16 3c-1.5 0-3 2-3 5s1.5 4 3 4v9'] },
  { id: 'groceries', label: 'Belanja harian', paths: ['M5 7h14l-1.2 9.5a2 2 0 0 1-2 1.5H8.2a2 2 0 0 1-2-1.5L5 7Z', 'M9 7a3 3 0 0 1 6 0', 'M3 4h1.5l.6 3'] },
  { id: 'transport', label: 'Transportasi', paths: ['M5 16l1.5-6.5A2 2 0 0 1 8.4 8h7.2a2 2 0 0 1 1.9 1.5L19 16', 'M4 16h16v3a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H7v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3Z', 'M7 13h.01', 'M17 13h.01'] },
  { id: 'home', label: 'Rumah', paths: ['M3 11l9-8 9 8', 'M5 10v10h14V10', 'M9 20v-6h6v6'] },
  { id: 'bills', label: 'Tagihan', paths: ['M6 3h12v18l-3-2-3 2-3-2-3 2V3Z', 'M9 8h6', 'M9 12h6', 'M9 16h4'] },
  { id: 'shopping', label: 'Belanja', paths: ['M6 8h12l-1 12H7L6 8Z', 'M9 8a3 3 0 0 1 6 0'] },
  { id: 'health', label: 'Kesehatan', paths: ['M20 7c0 6-8 12-8 12S4 13 4 7a4 4 0 0 1 8-2 4 4 0 0 1 8 2Z'] },
  { id: 'education', label: 'Pendidikan', paths: ['M3 9l9-4 9 4-9 4-9-4Z', 'M7 11v5c0 1 2.2 2 5 2s5-1 5-2v-5', 'M21 9v5'] },
  { id: 'entertainment', label: 'Hiburan', paths: ['M4 5h16v14H4z', 'M4 9h16', 'M8 5v4', 'M16 5v4', 'M8 19v-4', 'M16 19v-4'] },
  { id: 'travel', label: 'Perjalanan', paths: ['M10 5l9 3-3 9-3-3-4 3-1-5-5-1 3-4 5 1 3-3Z'] },
  { id: 'pets', label: 'Peliharaan', paths: ['M8 9a1.6 1.6 0 1 0 0-3.2A1.6 1.6 0 0 0 8 9Z', 'M16 9a1.6 1.6 0 1 0 0-3.2A1.6 1.6 0 0 0 16 9Z', 'M5.5 14a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z', 'M18.5 14a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z', 'M12 20c-2.5 0-4-1.5-4-3.2C8 15 9.8 14 12 14s4 1 4 2.8C16 18.5 14.5 20 12 20Z'] },
  { id: 'kids', label: 'Anak', paths: ['M12 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z', 'M6 20a6 6 0 0 1 12 0', 'M9 13h6'] },
  { id: 'work', label: 'Pekerjaan', paths: ['M4 8h16v11H4z', 'M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2', 'M4 13h16'] },
  { id: 'salary', label: 'Gaji', paths: ['M4 7h16v10H4z', 'M8 11h.01', 'M16 13h.01', 'M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z'] },
  { id: 'gift', label: 'Hadiah', paths: ['M4 11h16v9H4z', 'M4 7h16v4H4z', 'M12 7v13', 'M12 7C10 7 8 6 8 4.5S9.5 3 12 7Z', 'M12 7c2 0 4-1 4-2.5S14.5 3 12 7Z'] },
  { id: 'savings', label: 'Tabungan', paths: ['M4 12a6 5 0 0 1 6-5h4a5 5 0 0 1 5 5c0 1.5-.7 2.6-1.5 3.3V19h-3v-2h-4v2H7v-2.5C5.2 16 4 14.3 4 12Z', 'M9 9h3', 'M18 11h1'] },
  { id: 'investment', label: 'Investasi', paths: ['M4 18h16', 'M6 15l4-5 4 3 4-7', 'M16 6h4v4'] },
  { id: 'phone', label: 'Pulsa & internet', paths: ['M5 12.5a10 10 0 0 1 14 0', 'M8 15.5a6 6 0 0 1 8 0', 'M12 19h.01'] },
  { id: 'sports', label: 'Olahraga', paths: ['M6.5 9h11v6h-11z', 'M6.5 10.5H4v3h2.5', 'M17.5 10.5H20v3h-2.5', 'M12 8v8'] },
  // Extended catalog (appended 2026-07) — never reorder/rename ids above.
  { id: 'coffee', label: 'Kopi & kafe', paths: ['M4 8h13v5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8Z', 'M17 9h2a2 2 0 0 1 0 4h-2', 'M8 3v2', 'M12 3v2'] },
  { id: 'fastfood', label: 'Jajan', paths: ['M4 10h16', 'M5 10a7 7 0 0 1 14 0', 'M4 14h16a4 4 0 0 1-4 3H8a4 4 0 0 1-4-3Z', 'M9 7h.01', 'M13 6h.01'] },
  { id: 'drinks', label: 'Minuman', paths: ['M6 4h12l-2 5H8L6 4Z', 'M8 9l1.5 9h5L16 9', 'M9 13h6'] },
  { id: 'fuel', label: 'Bensin', paths: ['M5 20V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v15', 'M4 20h10', 'M6 11h6', 'M13 8l3 3v6a2 2 0 0 0 3 0V9l-3-3'] },
  { id: 'publictransport', label: 'Transportasi umum', paths: ['M5 4h14v12H5z', 'M5 16v2a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-2', 'M16 16v2a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-2', 'M5 10h14', 'M8 13h.01', 'M16 13h.01'] },
  { id: 'taxi', label: 'Taksi & ojek', paths: ['M5 16l1.5-6.5A2 2 0 0 1 8.4 8h7.2a2 2 0 0 1 1.9 1.5L19 16', 'M4 16h16v3H4z', 'M9 5h6v3H9z', 'M7 13h.01', 'M17 13h.01'] },
  { id: 'parking', label: 'Parkir', paths: ['M5 4h14v16H5z', 'M9 16V8h3a2.5 2.5 0 0 1 0 5H9'] },
  { id: 'rent', label: 'Sewa tempat', paths: ['M3 11l9-8 9 8', 'M5 10v10h14V10', 'M10 20v-5h4v5', 'M14 14h.01'] },
  { id: 'electricity', label: 'Listrik', paths: ['M13 2 4 14h7l-1 8 9-12h-7l1-8Z'] },
  { id: 'water', label: 'Air', paths: ['M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z'] },
  { id: 'tv', label: 'TV & streaming', paths: ['M4 6h16v11H4z', 'M9 20h6', 'M12 17v3', 'M10 9.5l4 2-4 2v-4Z'] },
  { id: 'music', label: 'Musik', paths: ['M9 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z', 'M9 15.5V5l10-2v10.5', 'M19 13.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z', 'M9 8l10-2'] },
  { id: 'games', label: 'Game', paths: ['M7 8h10a4 4 0 0 1 4 4 4 4 0 0 1-7 3H10a4 4 0 0 1-7-3 4 4 0 0 1 4-4Z', 'M7 11v2', 'M6 12h2', 'M15 11h.01', 'M17 13h.01'] },
  { id: 'beauty', label: 'Perawatan diri', paths: ['M12 4c3 3 5 5 5 8a5 5 0 0 1-10 0c0-3 2-5 5-8Z', 'M4 20c3-1 5-1 8-1s5 0 8 1'] },
  { id: 'haircut', label: 'Salon & cukur', paths: ['M7 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z', 'M7 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z', 'M9 6.5 20 18', 'M9 17.5 20 6'] },
  { id: 'clothes', label: 'Pakaian', paths: ['M9 4l3 2 3-2 5 4-3 3-2-1v8H9v-8l-2 1-3-3 5-4Z'] },
  { id: 'laundry', label: 'Laundry', paths: ['M5 4h14v16H5z', 'M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z', 'M8 7h.01', 'M11 7h.01'] },
  { id: 'pharmacy', label: 'Apotek', paths: ['M5 5h14v14H5z', 'M12 8v8', 'M8 12h8'] },
  { id: 'insurance', label: 'Asuransi', paths: ['M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z', 'M9 12l2 2 4-4'] },
  { id: 'tax', label: 'Pajak', paths: ['M3 9l9-5 9 5', 'M5 10h14', 'M6 10v8', 'M10 10v8', 'M14 10v8', 'M18 10v8', 'M4 18h16', 'M3 21h18'] },
  { id: 'donation', label: 'Donasi', paths: ['M12 20s-7-4-7-9a4 4 0 0 1 7-2.5A4 4 0 0 1 19 11c0 5-7 9-7 9Z', 'M12 8.5v3', 'M10.5 10h3'] },
  { id: 'baby', label: 'Bayi', paths: ['M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z', 'M9 7c1 1 5 1 6 0', 'M6 20a6 6 0 0 1 12 0', 'M10 16h4'] },
  { id: 'tools', label: 'Perkakas', paths: ['M14 6a3.5 3.5 0 0 0 4.6 4.6l-8.2 8.2a2 2 0 0 1-2.8-2.8L14 6Z', 'M15 5l3 3'] },
  { id: 'camera', label: 'Kamera & foto', paths: ['M4 8h4l1.5-2h5L16 8h4v11H4z', 'M12 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z'] },
  { id: 'celebration', label: 'Perayaan', paths: ['M4 20l4-11 7 7-11 4Z', 'M14 4v3', 'M18 6l-2 2', 'M20 11h-3', 'M8 9l7 7'] },
  { id: 'bonus', label: 'Bonus', paths: ['M12 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z', 'M9 14l-1 7 4-2 4 2-1-7'] },
  { id: 'interest', label: 'Bunga', paths: ['M6 18 18 6', 'M7.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z', 'M16.5 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z'] },
  { id: 'rental_income', label: 'Pemasukan sewa', paths: ['M4 20V10l8-6 8 6v10', 'M4 20h16', 'M9 20v-5h6v5', 'M20 8l1-1'] },
  { id: 'refund', label: 'Pengembalian dana', paths: ['M4 12a8 8 0 1 1 2.3 5.6', 'M3 20v-5h5'] },
  { id: 'misc', label: 'Lainnya', paths: ['M4 5h7v6H4z', 'M13 5h7v6h-7z', 'M4 13h16v6H4z'] },
]

const ICON_BY_ID = new Map(CATEGORY_ICON_CATALOG.map((option) => [option.id, option]))

/** The catalog entry for a stored icon id, or undefined when empty/unknown. */
export function categoryIconOption(id?: string | null): CategoryIconOption | undefined {
  if (!id) return undefined
  return ICON_BY_ID.get(id)
}

/** Fallback SVG paths for a category with no chosen icon, by type. */
export function categoryTypeFallbackPaths(type: CategoryType): string[] {
  // Income = up trend, expense = down trend (matches the mobile fallback).
  return type === 'income'
    ? ['M4 18h16', 'M6 15l4-4 3 3 5-7', 'M16 6h4v4']
    : ['M4 6h16', 'M6 9l4 4 3-3 5 7', 'M16 18h4v-4']
}

/**
 * The SVG paths to render for a category: its chosen catalog icon when set and
 * known, otherwise the income/expense fallback glyph.
 */
export function resolveCategoryIconPaths(icon: string | undefined, type: CategoryType): string[] {
  return categoryIconOption(icon)?.paths ?? categoryTypeFallbackPaths(type)
}
