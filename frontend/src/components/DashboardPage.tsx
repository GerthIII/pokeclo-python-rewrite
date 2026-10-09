import { useEffect, useState } from 'react'
import { useOutfits } from '../queries'
import { Empty, ErrorNotice, Loading } from './Notice'

const RECENT = 6
const INTERVAL_MS = 4000

// Stand-in photos until real photo storage exists: the Nth-oldest outfit shows photo N (cycling).
const PHOTOS = [1, 2, 3, 4, 5].map((n) => `/outfit-photos/${n}.jpg`)

export function DashboardPage() {
  const { data, isPending, error } = useOutfits()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  // The API has no created_at, so the highest ids are the newest outfits.
  const oldestFirst = data ? [...data].sort((a, b) => a.id - b.id) : []
  const recent = oldestFirst.slice(-RECENT).reverse()
  const photoFor = (id: number) => PHOTOS[oldestFirst.findIndex((o) => o.id === id) % PHOTOS.length]

  useEffect(() => {
    if (paused || recent.length < 2) return
    const timer = setInterval(() => setIndex((i) => (i + 1) % recent.length), INTERVAL_MS)
    return () => clearInterval(timer)
  }, [paused, recent.length])

  if (isPending) return <Loading />
  if (error) return <ErrorNotice error={error} />
  if (recent.length === 0) {
    return (
      <section className="recent">
        <h2 className="section-title">Recent outfits</h2>
        <Empty>No outfits yet. Create one to see it here.</Empty>
      </section>
    )
  }

  const current = recent[index % recent.length]

  return (
    <section
      className="recent"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <h2 className="section-title">Recent outfits</h2>
      <a href={`#/outfits/${current.id}`} className="stage">
        <div className="stage-photos">
          {recent.map((o, i) => (
            <img
              key={o.id}
              src={photoFor(o.id)}
              alt={i === index ? o.name : ''}
              className={i === index ? 'active' : ''}
            />
          ))}
        </div>
        <strong className="stage-caption" key={current.id}>
          {current.name}
        </strong>
      </a>
      <div className="dots">
        {recent.map((o, i) => (
          <button
            key={o.id}
            className={`dot ${i === index ? 'active' : ''}`}
            aria-label={`Show ${o.name}`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </section>
  )
}
