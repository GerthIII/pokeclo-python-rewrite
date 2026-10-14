import { useMemo, useState } from 'react'
import { photoUrl } from '../cloudinary'
import { useItems } from '../queries'
import { go } from '../router'
import type { Item } from '../types'
import { NO_FILTERS, applyFilters, type Filters } from '../filters'
import { ItemFilters } from './ItemFilters'
import { ItemForm } from './ItemForm'
import { Empty, ErrorNotice, Loading } from './Notice'

function ItemCard({ item }: { item: Item }) {
  return (
    <li>
      <a className="product-card product-link" href={`#/items/${item.id}`}>
        <div className="product-image">
          {photoUrl(item.photo_public_id) ? (
            <img src={photoUrl(item.photo_public_id)!} alt={item.name} loading="lazy" />
          ) : (
            <span className="slot-chip">{item.slot}</span>
          )}
        </div>
        <h3 className="product-title">{item.name}</h3>
        <p className="product-subtitle">{item.description}</p>
      </a>
    </li>
  )
}

export function ItemsPage({ startAdding = false }: { startAdding?: boolean }) {
  const { data: items, isPending, error } = useItems()
  const [filters, setFilters] = useState<Filters>(NO_FILTERS)
  const visible = useMemo(() => applyFilters(items ?? [], filters), [items, filters])

  return (
    <section>
      <header className="page-head">
        <h2>My Closet</h2>
      </header>

      {startAdding && <ItemForm onDone={() => go('items')} />}

      {isPending ? (
        <Loading />
      ) : error ? (
        <ErrorNotice error={error} />
      ) : items.length === 0 ? (
        <Empty>Your closet is empty. Tap the camera button to add your first item.</Empty>
      ) : (
        <>
          <ItemFilters filters={filters} onChange={setFilters} shown={visible.length} total={items.length} />
          {visible.length === 0 ? (
            <Empty>No items match these filters.</Empty>
          ) : (
            <ul className="cards-wrapper">
              {visible.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  )
}
