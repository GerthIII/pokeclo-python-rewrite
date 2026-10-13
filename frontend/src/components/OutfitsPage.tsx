import { useMemo, useState } from 'react'
import { NO_OUTFIT_FILTERS, applyOutfitFilters, type OutfitFilters as Filters } from '../outfitFilters'
import { useOutfits } from '../queries'
import { go } from '../router'
import { Empty, ErrorNotice, Loading } from './Notice'
import { OutfitFilters } from './OutfitFilters'
import { OutfitGrid } from './Preview'

export function OutfitsPage() {
  const { data: outfits, isPending, error } = useOutfits()
  const [filters, setFilters] = useState<Filters>(NO_OUTFIT_FILTERS)
  const visible = useMemo(() => applyOutfitFilters(outfits ?? [], filters), [outfits, filters])

  return (
    <section>
      <header className="page-head">
        <h2>My Outfits</h2>
      </header>

      {isPending ? (
        <Loading />
      ) : error ? (
        <ErrorNotice error={error} />
      ) : outfits.length === 0 ? (
        <Empty>No outfits yet. Put one together from your wardrobe.</Empty>
      ) : (
        <>
          <OutfitFilters filters={filters} onChange={setFilters} shown={visible.length} total={outfits.length} />
          {visible.length === 0 ? (
            <Empty>No outfits match these filters.</Empty>
          ) : (
            <ul className="outfit-items-grid">
              {visible.map((o) => (
                <li key={o.id}>
                  <a className="outfit-item-shell" href={`#/outfits/${o.id}`}>
                    <h3 className="outfit-item-title">{o.name}</h3>
                    <OutfitGrid outfit={o} className="outfit-item-grid" />
                    <div className="outfit-item-cta">View outfit</div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <button className="fab" aria-label="New outfit" title="New outfit" onClick={() => go('outfits/new')}>
        <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>
    </section>
  )
}
