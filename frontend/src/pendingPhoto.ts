import { uploadPhoto } from './api'

// Photo picked with the navbar plus button. The upload starts immediately and the
// new-item form picks it up. Held in memory only, so a reload drops it.
export type PendingPhoto = { file: File; upload: Promise<string> }

let pending: PendingPhoto | null = null

export function startPhotoUpload(file: File): PendingPhoto {
  const upload = uploadPhoto(file)
  upload.catch(() => {}) // the form reports the error; avoid an unhandled rejection
  pending = { file, upload }
  return pending
}

export const getPendingPhoto = () => pending
export const clearPendingPhoto = () => {
  pending = null
}
