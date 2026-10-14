import { photoUrl } from '../cloudinary'
import type { Outfit } from '../types'
import { SLOTS } from '../types'

// Shows the item's photo, or its name when it has none.
export function ItemCell({ name, photoId }: { name?: string; photoId?: string | null }) {
  const url = photoUrl(photoId, 320)
  return <div className="cell">{url ? <img src={url} alt={name ?? ''} /> : name && <span>{name}</span>}</div>
}

// 2x2 grid in slot order (outer, top, bottom, footwear), like the Rails dashboard.
export function OutfitGrid({ outfit, className }: { outfit: Outfit; className: string }) {
  const bySlot = new Map(outfit.items.map((i) => [i.slot, i]))
  return (
    <div className={className}>
      {SLOTS.map((slot) => (
        <ItemCell key={slot} name={bySlot.get(slot)?.name} photoId={bySlot.get(slot)?.photo_public_id} />
      ))}
    </div>
  )
}

