import type { components } from './api-types'

type Schemas = components['schemas']

export type Item = Schemas['ItemRead']
export type ItemCreate = Schemas['ItemCreate']
export type ItemUpdate = Schemas['ItemUpdate']

export type Outfit = Schemas['OutfitRead']
export type OutfitCreate = Schemas['OutfitCreate']
export type OutfitUpdate = Schemas['OutfitUpdate']

export type Category = Schemas['Category']
export type Slot = Schemas['Slot']
export type ItemStatus = Schemas['ItemStatus']
export type OutfitStatus = Schemas['OutfitStatus']

// Mirror the backend enums. A removed or renamed value fails tsc; a newly added one must be added by hand.
export const CATEGORIES: Category[] = ['sports', 'casual', 'formal', 'outdoor']
export const SLOTS: Slot[] = ['outer', 'top', 'bottom', 'footwear']
export const ITEM_STATUSES: ItemStatus[] = ['owned', 'wanted']
