import { NO_OUTFIT_FILTERS, COMPLETENESS, type OutfitFilters as Filters } from '../outfitFilters'
import { SLOTS } from '../types'
import { Chips, FilterBar } from './FilterBar'

const STATUSES = ['draft', 'created'] as const

export function OutfitFilters({
  filters,
  onChange,
  shown,
  total,
}: {
  filters: Filters
  onChange: (f: Filters) => void
  shown: number
  total: number
}) {
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) => onChange({ ...filters, [key]: value })
  const active = [filters.status, filters.includes, filters.completeness].filter(Boolean).length

  return (
    <FilterBar
      search={filters.search}
      onSearch={(v) => set('search', v)}
      placeholder="Search outfits or pieces"
      sort={filters.sort}
      onSort={(v) => set('sort', v)}
      active={active}
      dirty={active > 0 || filters.search !== '' || filters.sort !== NO_OUTFIT_FILTERS.sort}
      onClear={() => onChange(NO_OUTFIT_FILTERS)}
      shown={shown}
      total={total}
      noun="outfits"
    >
      <Chips label="Status" options={STATUSES} value={filters.status} onChange={(v) => set('status', v)} />
      <Chips label="Includes" options={SLOTS} value={filters.includes} onChange={(v) => set('includes', v)} />
      <Chips label="Completeness" options={COMPLETENESS} value={filters.completeness} onChange={(v) => set('completeness', v)} />
    </FilterBar>
  )
}
