import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, del, patch, post } from './api'
import type {
  Item,
  ItemCreate,
  ItemUpdate,
  Outfit,
  OutfitCreate,
  OutfitUpdate,
} from './types'

export const keys = {
  items: ['items'] as const,
  outfits: ['outfits'] as const,
  outfit: (id: number) => ['outfits', id] as const,
}

// ---- items ----

export const useItems = () =>
  useQuery({ queryKey: keys.items, queryFn: () => api<Item[]>('/items') })

export function useCreateItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: ItemCreate) => post<Item>('/items', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.items }),
  })
}

export function useUpdateItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }: ItemUpdate & { id: number }) =>
      patch<Item>(`/items/${id}`, body),
    // An item's name/photo is embedded in outfits, so refresh those too.
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.items })
      qc.invalidateQueries({ queryKey: keys.outfits })
    },
  })
}

export function useDeleteItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => del(`/items/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.items })
      qc.invalidateQueries({ queryKey: keys.outfits })
    },
  })
}

// ---- outfits ----

export const useOutfits = () =>
  useQuery({ queryKey: keys.outfits, queryFn: () => api<Outfit[]>('/outfits') })

export const useOutfit = (id: number) =>
  useQuery({ queryKey: keys.outfit(id), queryFn: () => api<Outfit>(`/outfits/${id}`) })

export function useCreateOutfit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: OutfitCreate) => post<Outfit>('/outfits', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.outfits }),
  })
}

export function useUpdateOutfit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }: OutfitUpdate & { id: number }) =>
      patch<Outfit>(`/outfits/${id}`, body),
    // ['outfits'] is a prefix of ['outfits', id], so this refreshes list and detail.
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.outfits }),
  })
}

export function useDeleteOutfit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => del(`/outfits/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.outfits }),
  })
}
