import { useOutfits } from '../queries'
import { go } from '../router'
import { Empty, ErrorNotice, Loading } from './Notice'
import { OutfitGrid } from './Preview'

export function OutfitsPage() {
  const { data: outfits, isPending, error } = useOutfits()

  return (
    <section>
      <header className="page-head">
        <h2>My Outfits</h2>
        <button className="primary" onClick={() => go('outfits/new')}>
          + New outfit
        </button>
      </header>

      {isPending ? (
        <Loading />
      ) : error ? (
        <ErrorNotice error={error} />
      ) : outfits.length === 0 ? (
        <Empty>No outfits yet. Put one together from your wardrobe.</Empty>
      ) : (
        <ul className="outfit-items-grid">
          {outfits.map((o) => (
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
    </section>
  )
}
