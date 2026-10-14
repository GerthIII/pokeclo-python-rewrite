const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined

// Delivery URL for a stored photo, or null when there's no photo (or no cloud name set).
export function photoUrl(publicId: string | null | undefined, width = 480): string | null {
  if (!publicId || !CLOUD_NAME) return null
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/c_limit,w_${width},q_auto,f_auto/${publicId}`
}
