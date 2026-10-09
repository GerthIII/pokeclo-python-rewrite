import type { Outfit } from '../types'
import { SLOTS } from '../types'

// Photos aren't uploaded yet, so a cell shows the item's name until they are.
export function ItemCell({ name }: { name?: string }) {
  return <div className="cell">{name && <span>{name}</span>}</div>
}

// 2x2 grid in slot order (outer, top, bottom, footwear), like the Rails dashboard.
export function OutfitGrid({ outfit, className }: { outfit: Outfit; className: string }) {
  const bySlot = new Map(outfit.items.map((i) => [i.slot, i]))
  return (
    <div className={className}>
      {SLOTS.map((slot) => (
        <ItemCell key={slot} name={bySlot.get(slot)?.name} />
      ))}
    </div>
  )
}

