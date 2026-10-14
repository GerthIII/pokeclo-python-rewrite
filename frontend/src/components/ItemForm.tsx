import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { photoUrl } from '../cloudinary'
import { clearPendingPhoto, getPendingPhoto, startPhotoUpload } from '../pendingPhoto'
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

type PhotoState =
  | { status: 'none' }
  | { status: 'uploading' }
  | { status: 'done'; publicId: string }
  | { status: 'error'; message: string }

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

  // Photo from the navbar plus button (new items only); it is already uploading.
  const [pending, setPending] = useState(() => (item ? null : getPendingPhoto()))
  const [photo, setPhoto] = useState<PhotoState>({ status: pending ? 'uploading' : 'none' })

  useEffect(() => {
    if (!pending) return
    let live = true
    pending.upload.then(
      (publicId) => live && setPhoto({ status: 'done', publicId }),
      (err: Error) => live && setPhoto({ status: 'error', message: err.message }),
    )
    return () => {
      live = false
    }
  }, [pending])

  const previewUrl = useMemo(
    () => (pending ? URL.createObjectURL(pending.file) : photoUrl(item?.photo_public_id)),
    [pending, item],
  )

  function retryUpload() {
    if (!pending) return
    setPhoto({ status: 'uploading' })
    setPending(startPhotoUpload(pending.file))
  }

  function submit(e: FormEvent) {
    e.preventDefault()
    const body = {
      name,
      description,
      category,
      slot,
      status,
      ...(photo.status === 'done' ? { photo_public_id: photo.publicId } : {}),
    }
    const opts = {
      onSuccess: () => {
        clearPendingPhoto()
        onDone()
      },
    }
    if (item) update.mutate({ id: item.id, ...body }, opts)
    else create.mutate(body, opts)
  }

  return (
    <form className="card form" onSubmit={submit}>
      {previewUrl && (
        <div className="photo-preview">
          <img src={previewUrl} alt={item ? item.name : 'Your new item'} />
          {photo.status === 'uploading' && <p className="muted">Uploading photo…</p>}
          {photo.status === 'done' && <p className="muted">Photo uploaded</p>}
          {photo.status === 'error' && (
            <p className="notice error" role="alert">
              Couldn't upload the photo ({photo.message}). You can save without it.{' '}
              <button type="button" className="link" onClick={retryUpload}>
                Try again
              </button>
            </p>
          )}
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
        <button
          type="submit"
          className="primary"
          disabled={mutation.isPending || photo.status === 'uploading'}
          title={photo.status === 'uploading' ? 'Waiting for the photo to finish uploading' : undefined}
        >
          {mutation.isPending ? 'Saving…' : item ? 'Save changes' : 'Add item'}
        </button>
        <button type="button" onClick={onDone}>
          Cancel
        </button>
      </div>
    </form>
  )
}
