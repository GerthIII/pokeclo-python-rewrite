import { useState } from 'react'
import { ApiError } from '../api'
import { useDeleteItem, useItem } from '../queries'
import { go } from '../router'
import { ItemForm } from './ItemForm'
import { ErrorNotice, Loading } from './Notice'

export function ItemDetail({ id }: { id: number }) {
  const { data: item, isPending, error } = useItem(id)
  const remove = useDeleteItem()
  const [editing, setEditing] = useState(false)

  if (isPending) return <Loading />
  if (error) {
    return (
      <section>
        <ErrorNotice error={error} />
        {error instanceof ApiError && error.status === 404 && (
          <a href="#/items">← Back to closet</a>
        )}
      </section>
    )
  }

  return (
    <section>
      <a href="#/items">← My closet</a>
      <header className="page-head">
        <h2>{item.name}</h2>
      </header>

      {editing ? (
        <ItemForm item={item} onDone={() => setEditing(false)} />
      ) : (
        <article className="card item-detail">
          <div className="detail-photo">
            <span className="slot-chip">{item.slot}</span>
          </div>
          <p>{item.description}</p>
          <dl className="facts">
            <div>
              <dt>Category</dt>
              <dd>{item.category}</dd>
            </div>
            <div>
              <dt>Slot</dt>
              <dd>{item.slot}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>
                <span className={`tag ${item.status}`}>{item.status}</span>
              </dd>
            </div>
          </dl>
          {remove.error && <ErrorNotice error={remove.error} />}
          <div className="actions">
            <button onClick={() => setEditing(true)}>Edit</button>
            <button
              className="danger"
              disabled={remove.isPending}
              onClick={() => {
                if (confirm(`Delete "${item.name}"? It will also leave any outfits using it.`))
                  remove.mutate(id, { onSuccess: () => go('items') })
              }}
            >
              {remove.isPending ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </article>
      )}
    </section>
  )
}
