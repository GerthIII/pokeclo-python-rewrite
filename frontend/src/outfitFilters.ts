import type { SortKey } from './filters'
import type { Outfit, OutfitStatus, Slot } from './types'
import { SLOTS } from './types'

export type Completeness = 'complete' | 'incomplete'
export const COMPLETENESS: Completeness[] = ['complete', 'incomplete']

export type OutfitFilters = {
  search: string
  status: OutfitStatus | null
  includes: Slot | null // outfit has a piece in this slot
  completeness: Completeness | null // complete = every slot filled
  sort: SortKey
}

export const NO_OUTFIT_FILTERS: OutfitFilters = {
  search: '',
  status: null,
  includes: null,
  completeness: null,
  sort: 'newest',
}

// The API has no created_at, so a higher id means a more recently created outfit.
export function applyOutfitFilters(outfits: Outfit[], f: OutfitFilters): Outfit[] {
  const q = f.search.trim().toLowerCase()
  const out = outfits.filter((o) => {
    const slots = new Set(o.items.map((i) => i.slot))
    const complete = SLOTS.every((s) => slots.has(s))
    return (
      (!f.status || o.status === f.status) &&
      (!f.includes || slots.has(f.includes)) &&
      (!f.completeness || (f.completeness === 'complete') === complete) &&
      (!q ||
        o.name.toLowerCase().includes(q) ||
        (o.description ?? '').toLowerCase().includes(q) ||
        o.items.some((i) => i.name.toLowerCase().includes(q)))
    )
  })
  if (f.sort === 'newest') out.sort((a, b) => b.id - a.id)
  else if (f.sort === 'oldest') out.sort((a, b) => a.id - b.id)
  else out.sort((a, b) => a.name.localeCompare(b.name))
  return out
}
