import { useMemo, useState, type FormEvent } from 'react'
import { takePendingPhoto, setPendingPhoto } from '../pendingPhoto'
import { useCreateItem, useUpdateItem } from '../queries'
import {
  CATEGORIES,
  ITEM_STATUSES,
  SLOTS,
  type Category,
  type Item,
  type ItemStatus,
  type Slot,
} from '../types'
import { ErrorNotice } from './Notice'

// Create mode when `item` is omitted, edit mode otherwise.
export function ItemForm({ item, onDone }: { item?: Item; onDone: () => void }) {
  const create = useCreateItem()
  const update = useUpdateItem()
  const mutation = item ? update : create

  const [name, setName] = useState(item?.name ?? '')
  const [description, setDescription] = useState(item?.description ?? '')
  const [category, setCategory] = useState<Category>(item?.category ?? 'casual')
  const [slot, setSlot] = useState<Slot>(item?.slot ?? 'top')
  const [status, setStatus] = useState<ItemStatus>(item?.status ?? 'owned')

  // Photo from the navbar camera button (new items only). Preview-only for now.
  const photoUrl = useMemo(() => {
    const file = item ? null : takePendingPhoto()
    return file ? URL.createObjectURL(file) : null
  }, [item])

  function submit(e: FormEvent) {
    e.preventDefault()
    const body = { name, description, category, slot, status }
    const opts = {
      onSuccess: () => {
        setPendingPhoto(null)
        onDone()
      },
    }
    if (item) update.mutate({ id: item.id, ...body }, opts)
    else create.mutate(body, opts)
  }

  return (
    <form className="card form" onSubmit={submit}>
      {photoUrl && (
        <div className="photo-preview">
          <img src={photoUrl} alt="Your new item" />
          <p className="muted">Photo preview only — saving photos isn't built yet.</p>
        </div>
      )}
      <label>
        Name
        <input value={name} onChange={(e) => setName(e.target.value)} maxLength={100} required />
      </label>
      <label>
        Description
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
      </label>
      <div className="row">
        <label>
          Category
          <select value={category} onChange={(e) => setCategory(e.target.value as Category)}>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          Slot
          <select value={slot} onChange={(e) => setSlot(e.target.value as Slot)}>
            {SLOTS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label>
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value as ItemStatus)}>
            {ITEM_STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>
      {mutation.error && <ErrorNotice error={mutation.error} />}
      <div className="row actions">
        <button type="submit" className="primary" disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving…' : item ? 'Save changes' : 'Add item'}
        </button>
        <button type="button" onClick={onDone}>
          Cancel
        </button>
      </div>
    </form>
  )
}
