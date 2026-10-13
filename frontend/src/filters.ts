import type { Category, Item, ItemStatus, Slot } from './types'

export type SortKey = 'newest' | 'oldest' | 'name'

export type Filters = {
  search: string
  slot: Slot | null
  category: Category | null
  status: ItemStatus | null
  sort: SortKey
}

export const NO_FILTERS: Filters = { search: '', slot: null, category: null, status: null, sort: 'newest' }

// The API has no created_at, so a higher id means a more recently added item.
export function applyFilters(items: Item[], f: Filters): Item[] {
  const q = f.search.trim().toLowerCase()
  const out = items.filter(
    (i) =>
      (!f.slot || i.slot === f.slot) &&
      (!f.category || i.category === f.category) &&
      (!f.status || i.status === f.status) &&
      (!q || i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)),
  )
  if (f.sort === 'newest') out.sort((a, b) => b.id - a.id)
  else if (f.sort === 'oldest') out.sort((a, b) => a.id - b.id)
  else out.sort((a, b) => a.name.localeCompare(b.name))
  return out
}

