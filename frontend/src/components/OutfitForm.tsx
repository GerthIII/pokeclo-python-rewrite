import { useState, type FormEvent } from 'react'
import { useCreateOutfit, useItems, useOutfit, useUpdateOutfit } from '../queries'
import { go } from '../router'
import { SLOTS, type Outfit, type OutfitStatus, type Slot } from '../types'
import { Empty, ErrorNotice, Loading } from './Notice'

// Create mode when `outfit` is omitted, edit mode otherwise.
function Form({ outfit }: { outfit?: Outfit }) {
  const { data: items, isPending, error } = useItems()
  const create = useCreateOutfit()
  const update = useUpdateOutfit()
  const mutation = outfit ? update : create

  const [name, setName] = useState(outfit?.name ?? '')
  const [description, setDescription] = useState(outfit?.description ?? '')
  const [status, setStatus] = useState<OutfitStatus>(outfit?.status ?? 'draft')
  // slot -> chosen item id (empty string = nothing)
  const [picks, setPicks] = useState<Partial<Record<Slot, string>>>(() =>
    Object.fromEntries((outfit?.items ?? []).map((i) => [i.slot, String(i.item_id)])),
  )

  const cancel = () => go(outfit ? `outfits/${outfit.id}` : 'outfits')

  function submit(e: FormEvent) {
    e.preventDefault()
    const chosen = SLOTS.flatMap((s) => (picks[s] ? [{ item_id: Number(picks[s]) }] : []))
    const opts = { onSuccess: (saved: Outfit) => go(`outfits/${saved.id}`) }
    if (outfit) update.mutate({ id: outfit.id, name, description, status, items: chosen }, opts)
    else create.mutate({ name, description: description || null, items: chosen }, opts)
  }

  if (isPending) return <Loading />
  if (error) return <ErrorNotice error={error} />

  return (
    <form className="card form" onSubmit={submit}>
      <label>
        Name
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={120}
          placeholder="Weekend brunch"
          required
        />
      </label>
      <label>
        Description
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>
      {outfit && (
        <label>
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value as OutfitStatus)}>
            <option>draft</option>
            <option>created</option>
          </select>
        </label>
      )}

      <fieldset>
        <legend>Pieces</legend>
        {items.length === 0 && <Empty>Add items to your wardrobe first.</Empty>}
        {SLOTS.map((slot) => {
          const options = items.filter((i) => i.slot === slot)
          return (
            <label key={slot}>
              {slot}
              <select
                value={picks[slot] ?? ''}
                onChange={(e) => setPicks({ ...picks, [slot]: e.target.value })}
                disabled={options.length === 0}
                title={options.length === 0 ? `No ${slot} items in your wardrobe` : undefined}
              >
                <option value="">— none —</option>
                {options.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name}
                  </option>
                ))}
              </select>
            </label>
          )
        })}
        {outfit && <p className="muted">Clearing a slot isn't supported yet; pick a different item to replace it.</p>}
      </fieldset>

      {mutation.error && <ErrorNotice error={mutation.error} />}
      <div className="row actions">
        <button type="submit" className="primary" disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving…' : outfit ? 'Save changes' : 'Create outfit'}
        </button>
        <button type="button" onClick={cancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}

export function NewOutfitPage() {
  return (
    <section>
      <header className="page-head">
        <h2>New outfit</h2>
      </header>
      <Form />
    </section>
  )
}

export function EditOutfitPage({ id }: { id: number }) {
  const { data: outfit, isPending, error } = useOutfit(id)
  return (
    <section>
      <header className="page-head">
        <h2>Edit outfit</h2>
      </header>
      {isPending ? <Loading /> : error ? <ErrorNotice error={error} /> : <Form outfit={outfit} />}
    </section>
  )
}
