import { ApiError } from '../api'
import { useDeleteOutfit, useOutfit } from '../queries'
import { go } from '../router'
import { SLOTS } from '../types'
import { ErrorNotice, Loading } from './Notice'

export function OutfitDetail({ id }: { id: number }) {
  const { data: outfit, isPending, error } = useOutfit(id)
  const remove = useDeleteOutfit()

  if (isPending) return <Loading />
  if (error) {
    return (
      <section>
        <ErrorNotice error={error} />
        {error instanceof ApiError && error.status === 404 && (
          <a href="#/outfits">← Back to outfits</a>
        )}
      </section>
    )
  }

  const bySlot = new Map(outfit.items.map((i) => [i.slot, i]))

  return (
    <section>
      <a href="#/outfits">← All outfits</a>
      <header className="page-head">
        <h2>{outfit.name}</h2>
        <div className="actions">
          <button onClick={() => go(`outfits/${id}/edit`)}>Edit</button>
          <button
            className="danger"
            disabled={remove.isPending}
            onClick={() => {
              if (confirm(`Delete "${outfit.name}"?`))
                remove.mutate(id, { onSuccess: () => go('outfits') })
            }}
          >
            {remove.isPending ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </header>
      <p>
        <span className={`tag ${outfit.status}`}>{outfit.status}</span>
      </p>
      {outfit.description && <p>{outfit.description}</p>}
      {remove.error && <ErrorNotice error={remove.error} />}

      <ul className="slots">
        {SLOTS.map((slot) => {
          const entry = bySlot.get(slot)
          return (
            <li key={slot} className={`card slot ${entry ? '' : 'empty'}`}>
              <span className="slot-label">{slot}</span>
              <span>{entry ? entry.name : 'Nothing chosen'}</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
