import { useState } from 'react'
import { useDeleteItem, useItems } from '../queries'
import { go } from '../router'
import type { Item } from '../types'
import { ItemForm } from './ItemForm'
import { Empty, ErrorNotice, Loading } from './Notice'

// Own component per row so "Deleting…" only shows on the row being deleted.
function ItemRow({ item }: { item: Item }) {
  const [editing, setEditing] = useState(false)
  const remove = useDeleteItem()

  if (editing)
    return (
      <li className="span-all">
        <ItemForm item={item} onDone={() => setEditing(false)} />
      </li>
    )

  return (
    <li className="product-card">
      <div className="product-image">
        <span className="slot-chip">{item.slot}</span>
        <span className={`product-badge ${item.status}`}>{item.status}</span>
      </div>
      <h3 className="product-title">{item.name}</h3>
      <p className="product-subtitle">{item.description}</p>
      <p className="product-category">{item.category}</p>
      {remove.error && <ErrorNotice error={remove.error} />}
      <div className="actions">
        <button className="small" onClick={() => setEditing(true)}>
          Edit
        </button>
        <button
          className="small danger"
          disabled={remove.isPending}
          aria-label={`Delete ${item.name}`}
          onClick={() => {
            if (confirm(`Delete "${item.name}"? It will also leave any outfits using it.`))
              remove.mutate(item.id)
          }}
        >
          {remove.isPending ? '…' : 'Delete'}
        </button>
      </div>
    </li>
  )
}

export function ItemsPage({ startAdding = false }: { startAdding?: boolean }) {
  const { data: items, isPending, error } = useItems()
  const [adding, setAdding] = useState(startAdding)
  const closeForm = () => {
    setAdding(false)
    if (startAdding) go('items')
  }

  return (
    <section>
      <header className="page-head">
        <h2>My Closet</h2>
        {!adding && (
          <button className="primary" onClick={() => setAdding(true)}>
            + Add item
          </button>
        )}
      </header>

      {adding && <ItemForm onDone={closeForm} />}

      {isPending ? (
        <Loading />
      ) : error ? (
        <ErrorNotice error={error} />
      ) : items.length === 0 ? (
        <Empty>Your wardrobe is empty. Add your first item.</Empty>
      ) : (
        <ul className="cards-wrapper">
          {items.map((item) => (
            <ItemRow key={item.id} item={item} />
          ))}
        </ul>
      )}
    </section>
  )
}
