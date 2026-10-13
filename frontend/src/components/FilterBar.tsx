import { useState, type ReactNode } from 'react'
import type { SortKey } from '../filters'

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'newest', label: 'Newest' },
  { key: 'oldest', label: 'Oldest' },
  { key: 'name', label: 'A–Z' },
]

export function Chips<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: readonly T[]
  value: T | null
  onChange: (v: T | null) => void
}) {
  return (
    <div className="chip-group" role="group" aria-label={label}>
      <span className="chip-label">{label}</span>
      <div className="chips">
        <button className={`chip ${value === null ? 'on' : ''}`} onClick={() => onChange(null)}>
          All
        </button>
        {options.map((o) => (
          <button
            key={o}
            className={`chip ${value === o ? 'on' : ''}`}
            aria-pressed={value === o}
            onClick={() => onChange(value === o ? null : o)}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  )
}

// Search + sort + collapsible chip panel, shared by the closet and outfits pages.
export function FilterBar({
  search,
  onSearch,
  placeholder,
  sort,
  onSort,
  active,
  dirty,
  onClear,
  shown,
  total,
  noun,
  children,
}: {
  search: string
  onSearch: (v: string) => void
  placeholder: string
  sort: SortKey
  onSort: (v: SortKey) => void
  active: number
  dirty: boolean
  onClear: () => void
  shown: number
  total: number
  noun: string
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="filters">
      <div className="filter-bar">
        <input
          type="search"
          className="search"
          placeholder={placeholder}
          aria-label={placeholder}
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
        <button
          className={`filter-toggle ${open ? 'open' : ''}`}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          Filters{active > 0 && <span className="count">{active}</span>}
        </button>
      </div>

      <div className="segmented" role="group" aria-label="Sort by">
        {SORTS.map((s) => (
          <button
            key={s.key}
            className={sort === s.key ? 'on' : ''}
            aria-pressed={sort === s.key}
            onClick={() => onSort(s.key)}
          >
            {s.label}
          </button>
        ))}
      </div>

      {open && <div className="filter-panel">{children}</div>}

      <div className="filter-summary">
        <span>{shown === total ? `${total} ${noun}` : `${shown} of ${total} ${noun}`}</span>
        {dirty && (
          <button className="link" onClick={onClear}>
            Clear all
          </button>
        )}
      </div>
    </div>
  )
}
