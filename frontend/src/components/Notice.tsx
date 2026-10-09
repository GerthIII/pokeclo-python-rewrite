import type { ReactNode } from 'react'

export function Loading() {
  return <p className="notice">Loading…</p>
}

export function ErrorNotice({ error }: { error: Error }) {
  return (
    <p className="notice error" role="alert">
      {error.message}
    </p>
  )
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="notice">{children}</p>
}
