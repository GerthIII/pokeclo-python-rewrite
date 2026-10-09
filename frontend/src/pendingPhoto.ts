// Photo picked from the navbar camera button, waiting for the new-item form.
// Held in memory only: there is no upload endpoint yet, so it is preview-only.
let pending: File | null = null

export const setPendingPhoto = (file: File | null) => {
  pending = file
}
export const takePendingPhoto = () => pending
