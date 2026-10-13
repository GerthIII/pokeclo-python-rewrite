import { NO_FILTERS, type Filters } from '../filters'
import { CATEGORIES, ITEM_STATUSES, SLOTS } from '../types'
import { Chips, FilterBar } from './FilterBar'

export function ItemFilters({
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
  const active = [filters.slot, filters.category, filters.status].filter(Boolean).length

  return (
    <FilterBar
      search={filters.search}
      onSearch={(v) => set('search', v)}
      placeholder="Search your closet"
      sort={filters.sort}
      onSort={(v) => set('sort', v)}
      active={active}
      dirty={active > 0 || filters.search !== '' || filters.sort !== NO_FILTERS.sort}
      onClear={() => onChange(NO_FILTERS)}
      shown={shown}
      total={total}
      noun="items"
    >
      <Chips label="Slot" options={SLOTS} value={filters.slot} onChange={(v) => set('slot', v)} />
      <Chips label="Category" options={CATEGORIES} value={filters.category} onChange={(v) => set('category', v)} />
      <Chips label="Status" options={ITEM_STATUSES} value={filters.status} onChange={(v) => set('status', v)} />
    </FilterBar>
  )
}
